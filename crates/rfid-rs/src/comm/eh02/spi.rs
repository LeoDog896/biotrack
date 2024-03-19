//! Blocking implementation of the `Interface` trait for SPI communication.

use crate::comm::Interface;
use crate::register::Register;

use embedded_hal::blocking::spi;
use embedded_hal::digital::v2::OutputPin;
use embedded_hal_02 as embedded_hal;
use heapless::Vec;

/// Type to represent *'no software controlled NSS'*.
pub struct DummyNSS;
/// Type to represent *'no delay function'*.
pub struct DummyDelay;

/// Blocking SPI interface to the MFRC522
pub struct SpiInterface<SPI, NSS, D> {
    /// The actual SPI device
    spi: SPI,
    /// Optional software-controlled chip-select pin
    nss: NSS,
    /// Optional delay function to guarantee timing requirements between transfers
    delay: D,
}

#[derive(Debug, PartialEq)]
pub enum Error<E> {
    /// An error `E` occurred in the underlying SPI interface.
    Spi(E),
    /// An error occurred when changing the chip-select pin.
    Gpio,
    /// The provided buffer is too large to handle.
    /// This variant will be removed when updating to embedded-hal 1.0.
    BufferTooLarge,
}

impl<E, SPI> SpiInterface<SPI, DummyNSS, DummyDelay>
where
    SPI: spi::Transfer<u8, Error = E> + spi::Write<u8, Error = E>,
{
    /// Create a new SPI interface.
    ///
    /// The resulting driver will use a *dummy* NSS pin and expects the
    /// actual chip-select to be controlled by hardware.
    ///
    /// Use the [with_nss](SpiInterface::with_nss) method to add a software controlled NSS pin.
    ///
    /// If you are using optimization / release mode, you may want to add a delay function
    /// using the [with_delay](SpiInterface::with_delay) method to ensure
    /// timing requirements are respected.
    pub fn new(spi: SPI) -> Self {
        Self {
            spi,
            nss: DummyNSS {},
            delay: DummyDelay {},
        }
    }
}

impl<SPI, D> SpiInterface<SPI, DummyNSS, D> {
    /// Add a software controlled chip-select/NSS pin that should be used by this driver
    /// for the SPI communication.
    ///
    /// This is necessary if your hardware does not support hardware controller NSS
    /// or if it is unavailable to you for some reason.
    pub fn with_nss<NSS: OutputPin>(self, nss: NSS) -> SpiInterface<SPI, NSS, D> {
        SpiInterface {
            spi: self.spi,
            nss,
            delay: self.delay,
        }
    }
}

impl<SPI, NSS> SpiInterface<SPI, NSS, DummyDelay> {
    /// Add a delay function to be used after each SPI transaction.
    ///
    /// The MFRC522 specifies that the NSS pin needs to be high/de-asserted
    /// for at least 50ns between communications.
    ///
    /// If optimizations are enabled, we can run into issues with this timing requirement
    /// if we do not add a delay between transactions.
    /// This function allows the user to specify a (platform specific) function
    /// that will (busy) wait for at least 50ns.
    pub fn with_delay<D: FnMut()>(self, delay: D) -> SpiInterface<SPI, NSS, D> {
        SpiInterface {
            spi: self.spi,
            nss: self.nss,
            delay,
        }
    }
}

impl<SPI, NSS, D> SpiInterface<SPI, NSS, D> {
    /// Release the underlying SPI device and NSS pin
    pub fn release(self) -> (SPI, NSS) {
        (self.spi, self.nss)
    }
}

impl<E, SPI, NSS, D> Interface for SpiInterface<SPI, NSS, D>
where
    SPI: spi::Transfer<u8, Error = E> + spi::Write<u8, Error = E>,
    SpiInterface<SPI, NSS, D>: WrapTransfer<E>,
{
    type Error = Error<E>;
    fn read(&mut self, reg: Register) -> Result<u8, Self::Error> {
        let mut buffer = [((reg as u8) << 1) | 0x80, 0];

        self.wrap_transfer(|mfr| {
            let buffer = mfr.spi.transfer(&mut buffer).map_err(Error::Spi)?;

            Ok(buffer[1])
        })
    }

    fn read_many<'b>(&mut self, reg: Register, buf: &'b mut [u8]) -> Result<&'b [u8], Self::Error> {
        let mut vec = Vec::<u8, 65>::new();
        let n = buf.len();
        for _ in 0..n {
            vec.push(((reg as u8) << 1) | 0x80)
                .map_err(|_| Error::BufferTooLarge)?;
        }
        vec.push(0).map_err(|_| Error::BufferTooLarge)?;

        self.wrap_transfer(move |mfr| {
            let res = mfr.spi.transfer(vec.as_mut()).map_err(Error::Spi)?;

            for (idx, slot) in res[1..].iter().enumerate() {
                if idx >= n {
                    break;
                }
                buf[idx] = *slot;
            }

            Ok(&*buf)
        })
    }

    fn write(&mut self, reg: Register, val: u8) -> Result<(), Self::Error> {
        self.wrap_transfer(|mfr| mfr.spi.write(&[(reg as u8) << 1, val]).map_err(Error::Spi))
    }

    fn write_many(&mut self, reg: Register, bytes: &[u8]) -> Result<(), Self::Error> {
        self.wrap_transfer(|mfr| {
            let mut vec = Vec::<u8, 65>::new();
            vec.push((reg as u8) << 1)
                .map_err(|_| Error::BufferTooLarge)?;
            vec.extend_from_slice(bytes)
                .map_err(|_| Error::BufferTooLarge)?;
            mfr.spi.write(vec.as_slice()).map_err(Error::Spi)?;

            Ok(())
        })
    }
}

/// Helper trait that will be implemented differently for the
/// different combinations (with/without NSS and delay function).
pub trait WrapTransfer<E> {
    /// Executes the given transfer function and possibly controls
    /// the chip-select pin and/or executes the delay function afterwards.
    fn wrap_transfer<F, T>(&mut self, f: F) -> Result<T, Error<E>>
    where
        F: FnOnce(&mut Self) -> Result<T, Error<E>>;
}

#[doc(hidden)]
impl<E, SPI> WrapTransfer<E> for SpiInterface<SPI, DummyNSS, DummyDelay>
where
    SPI: spi::Transfer<u8, Error = E> + spi::Write<u8, Error = E>,
{
    fn wrap_transfer<F, T>(&mut self, f: F) -> Result<T, Error<E>>
    where
        F: FnOnce(&mut Self) -> Result<T, Error<E>>,
    {
        f(self)
    }
}

#[doc(hidden)]
impl<E, SPI, D> WrapTransfer<E> for SpiInterface<SPI, DummyNSS, D>
where
    SPI: spi::Transfer<u8, Error = E> + spi::Write<u8, Error = E>,
    D: FnMut(),
{
    fn wrap_transfer<F, T>(&mut self, f: F) -> Result<T, Error<E>>
    where
        F: FnOnce(&mut Self) -> Result<T, Error<E>>,
    {
        let result = f(self);
        (self.delay)();

        result
    }
}

#[doc(hidden)]
impl<E, SPI, NSS> WrapTransfer<E> for SpiInterface<SPI, NSS, DummyDelay>
where
    SPI: spi::Transfer<u8, Error = E> + spi::Write<u8, Error = E>,
    NSS: OutputPin,
{
    fn wrap_transfer<F, T>(&mut self, f: F) -> Result<T, Error<E>>
    where
        F: FnOnce(&mut Self) -> Result<T, Error<E>>,
    {
        self.nss.set_low().map_err(|_| Error::<E>::Gpio)?;
        let result = f(self);
        self.nss.set_high().map_err(|_| Error::<E>::Gpio)?;

        result
    }
}

#[doc(hidden)]
impl<E, SPI, NSS, D> WrapTransfer<E> for SpiInterface<SPI, NSS, D>
where
    SPI: spi::Transfer<u8, Error = E> + spi::Write<u8, Error = E>,
    NSS: OutputPin,
    D: FnMut(),
{
    fn wrap_transfer<F, T>(&mut self, f: F) -> Result<T, Error<E>>
    where
        F: FnOnce(&mut Self) -> Result<T, Error<E>>,
    {
        self.nss.set_low().map_err(|_| Error::<E>::Gpio)?;
        let result = f(self);
        self.nss.set_high().map_err(|_| Error::<E>::Gpio)?;
        (self.delay)();

        result
    }
}

#[cfg(test)]
mod test {
    use crate::comm::eh02::spi::SpiInterface;
    use crate::comm::Interface;
    use embedded_hal_mock::eh0::spi::{Mock as SpiMock, Transaction as SpiTransaction};

    #[test]
    pub fn test_read() {
        let expectations = [SpiTransaction::transfer(
            [0x96, 0x00].to_vec(),
            [0x11, 0x37].to_vec(),
        )];

        let spi = SpiMock::new(&expectations);
        let mut spi_clone = spi.clone();

        assert_eq!(
            SpiInterface::new(spi).read(crate::register::Register::WaterLevelReg),
            Ok(0x37)
        );

        spi_clone.done();
    }

    #[test]
    pub fn test_write() {
        let expectations = [SpiTransaction::write([0x42, 0xfd].to_vec())];

        let spi = SpiMock::new(&expectations);
        let mut spi_clone = spi.clone();

        SpiInterface::new(spi)
            .write(crate::register::Register::CRCResultRegHigh, 0xfd)
            .unwrap();

        spi_clone.done();
    }

    #[test]
    pub fn test_write_many() {
        let expectations = [SpiTransaction::write(
            [0x4E, 0xca, 0xfe, 0xf0, 0x0d].to_vec(),
        )];

        let spi = SpiMock::new(&expectations);
        let mut spi_clone = spi.clone();

        SpiInterface::new(spi)
            .write_many(crate::register::Register::GsNReg, &[0xca, 0xfe, 0xf0, 0x0d])
            .unwrap();

        spi_clone.done();
    }

    #[test]
    pub fn test_read_many_2() {
        let expectations = [SpiTransaction::transfer(
            [0xAA, 0xAA, 0x00].to_vec(),
            [0x69, 0x12, 0x23].to_vec(),
        )];

        let spi = SpiMock::new(&expectations);
        let mut spi_clone = spi.clone();

        let mut buffer = [0u8; 2];
        SpiInterface::new(spi)
            .read_many(crate::register::Register::TxASKReg, &mut buffer)
            .unwrap();
        assert_eq!(buffer, [0x12, 0x23]);

        spi_clone.done();
    }

    #[test]
    pub fn test_read_many_3() {
        let expectations = [SpiTransaction::transfer(
            [0xAA, 0xAA, 0xAA, 0x00].to_vec(),
            [0x69, 0x12, 0x23, 0x34].to_vec(),
        )];

        let spi = SpiMock::new(&expectations);
        let mut spi_clone = spi.clone();

        let mut buffer = [0u8; 3];
        SpiInterface::new(spi)
            .read_many(crate::register::Register::TxASKReg, &mut buffer)
            .unwrap();
        assert_eq!(buffer, [0x12, 0x23, 0x34]);

        spi_clone.done();
    }
}
