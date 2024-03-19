//! Blocking implementation of the `Interface` trait for SPI communication.
use crate::comm::Interface;
use crate::register::Register;

use embedded_hal_1 as embedded_hal;

use embedded_hal::spi::{Operation, SpiDevice};

/// Type to represent *'no delay function'*.
pub struct DummyDelay;

/// Blocking SPI interface to the MFRC522
pub struct SpiInterface<SPI, D> {
    /// The actual SPI device
    spi: SPI,
    /// Optional delay function to guarantee timing requirements between transfers
    delay: D,
}

impl<E, SPI> SpiInterface<SPI, DummyDelay>
where
    SPI: SpiDevice<Error = E>,
{
    /// Create a new SPI interface.
    ///
    /// The resulting driver will use a *dummy* NSS pin and expects the
    /// actual chip-select to be controlled by hardware.
    ///
    /// If you are using optimization / release mode, you may want to add a delay function
    /// using the [with_delay](SpiInterface::with_delay) method to ensure
    /// timing requirements are respected.
    pub fn new(spi: SPI) -> Self {
        Self {
            spi,
            delay: DummyDelay {},
        }
    }
}

impl<SPI> SpiInterface<SPI, DummyDelay> {
    /// Add a delay function to be used after each SPI transaction.
    ///
    /// The MFRC522 specifies that the NSS pin needs to be high/de-asserted
    /// for at least 50ns between communications.
    ///
    /// If optimizations are enabled, we can run into issues with this timing requirement
    /// if we do not add a delay between transactions.
    /// This function allows the user to specify a (platform specific) function
    /// that will (busy) wait for at least 50ns.
    pub fn with_delay<D: FnMut()>(self, delay: D) -> SpiInterface<SPI, D> {
        SpiInterface {
            spi: self.spi,
            delay,
        }
    }
}

impl<SPI, D> SpiInterface<SPI, D> {
    /// Release the underlying SPI device and NSS pin
    pub fn release(self) -> SPI {
        self.spi
    }
}

impl<E, SPI, D> Interface for SpiInterface<SPI, D>
where
    SPI: SpiDevice<Error = E>,
    SpiInterface<SPI, D>: WrapTransfer<E>,
{
    type Error = E;
    fn read(&mut self, reg: Register) -> Result<u8, Self::Error> {
        let mut buffer = [((reg as u8) << 1) | 0x80, 0];

        self.wrap_transfer(|mfr| {
            mfr.spi.transfer_in_place(&mut buffer)?;

            Ok(buffer[1])
        })
    }

    fn read_many<'b>(&mut self, reg: Register, buf: &'b mut [u8]) -> Result<&'b [u8], Self::Error> {
        for byte in buf.iter_mut() {
            *byte = ((reg as u8) << 1) | 0x80;
        }
        buf.last_mut().map(|b| *b = 0);

        let address = [((reg as u8) << 1) | 0x80];
        let mut operations = [Operation::Write(&address), Operation::TransferInPlace(buf)];
        self.wrap_transfer(move |mfr| mfr.spi.transaction(&mut operations))?;
        Ok(&*buf)
    }

    fn write(&mut self, reg: Register, val: u8) -> Result<(), Self::Error> {
        self.wrap_transfer(|mfr| mfr.spi.write(&[(reg as u8) << 1, val]))
    }

    fn write_many(&mut self, reg: Register, bytes: &[u8]) -> Result<(), Self::Error> {
        let address = [(reg as u8) << 1];
        let mut operations = [Operation::Write(&address), Operation::Write(bytes)];
        self.wrap_transfer(|mfr| mfr.spi.transaction(&mut operations))
    }
}

/// Helper trait that will be implemented differently for the
/// different combinations (with/without NSS and delay function).
pub trait WrapTransfer<E> {
    /// Executes the given transfer function and possibly controls
    /// the chip-select pin and/or executes the delay function afterwards.
    fn wrap_transfer<F, T>(&mut self, f: F) -> Result<T, E>
    where
        F: FnOnce(&mut Self) -> Result<T, E>;
}

#[doc(hidden)]
impl<E, SPI> WrapTransfer<E> for SpiInterface<SPI, DummyDelay>
where
    SPI: SpiDevice,
{
    fn wrap_transfer<F, T>(&mut self, f: F) -> Result<T, E>
    where
        F: FnOnce(&mut Self) -> Result<T, E>,
    {
        f(self)
    }
}

#[doc(hidden)]
impl<E, SPI, D> WrapTransfer<E> for SpiInterface<SPI, D>
where
    SPI: SpiDevice,
    D: FnMut(),
{
    fn wrap_transfer<F, T>(&mut self, f: F) -> Result<T, E>
    where
        F: FnOnce(&mut Self) -> Result<T, E>,
    {
        let result = f(self);
        (self.delay)();

        result
    }
}

#[cfg(test)]
mod test {
    use crate::comm::blocking::spi::SpiInterface;
    use crate::comm::Interface;
    use embedded_hal_mock::eh1::spi::{Mock as SpiMock, Transaction as SpiTransaction};

    #[test]
    pub fn test_read() {
        let expectations = [
            SpiTransaction::transaction_start(),
            SpiTransaction::transfer_in_place([0x96, 0x00].to_vec(), [0x11, 0x37].to_vec()),
            SpiTransaction::transaction_end(),
        ];

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
        let expectations = [
            SpiTransaction::transaction_start(),
            SpiTransaction::write_vec([0x42, 0xfd].to_vec()),
            SpiTransaction::transaction_end()
        ];

        let spi = SpiMock::new(&expectations);
        let mut spi_clone = spi.clone();

        SpiInterface::new(spi)
            .write(crate::register::Register::CRCResultRegHigh, 0xfd)
            .unwrap();

        spi_clone.done();
    }

    #[test]
    pub fn test_write_many() {
        let expectations = [
            SpiTransaction::transaction_start(),
            SpiTransaction::write(0x4E),
            SpiTransaction::write_vec([0xca, 0xfe, 0xf0, 0x0d].to_vec()),
            SpiTransaction::transaction_end(),
        ];

        let spi = SpiMock::new(&expectations);
        let mut spi_clone = spi.clone();

        SpiInterface::new(spi)
            .write_many(crate::register::Register::GsNReg, &[0xca, 0xfe, 0xf0, 0x0d])
            .unwrap();

        spi_clone.done();
    }

    #[test]
    pub fn test_read_many_2() {
        let expectations = [
            SpiTransaction::transaction_start(),
            SpiTransaction::write(0xAA),
            SpiTransaction::transfer_in_place([0xAA, 0x00].to_vec(), [0x12, 0x23].to_vec()),
            SpiTransaction::transaction_end(),
        ];

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
        let expectations = [
            SpiTransaction::transaction_start(),
            SpiTransaction::write(0xAA),
            SpiTransaction::transfer_in_place(
                [0xAA, 0xAA, 0x00].to_vec(),
                [0x12, 0x23, 0x34].to_vec(),
            ),
            SpiTransaction::transaction_end(),
        ];

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
