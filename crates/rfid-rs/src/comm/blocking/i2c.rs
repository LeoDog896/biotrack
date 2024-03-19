//! Blocking implementation of the `Interface` trait for I2C communication.

use crate::comm::Interface;
use crate::register::Register;

use embedded_hal_1 as embedded_hal;

use embedded_hal::i2c::{I2c, Operation};

/// Blocking I2C interface to the MFRC522
pub struct I2cInterface<I2C> {
    address: u8,
    /// The actual I2C device
    i2c: I2C,
}

impl<E, I2C> I2cInterface<I2C>
where
    I2C: I2c<Error = E>,
{
    /// Create a new I2C interface.
    pub fn new(i2c: I2C, address: u8) -> Self {
        Self { i2c, address }
    }
}

impl<I2C> I2cInterface<I2C> {
    /// Release the underlying I2C device
    pub fn release(self) -> I2C {
        self.i2c
    }
}

impl<E, I2C> Interface for I2cInterface<I2C>
where
    I2C: I2c<Error = E>,
{
    type Error = E;
    fn read(&mut self, reg: Register) -> Result<u8, Self::Error> {
        let mut buffer = [0];

        self.i2c
            .write_read(self.address, &[reg.into()], &mut buffer)?;

        Ok(buffer[0])
    }

    fn read_many<'b>(&mut self, reg: Register, buf: &'b mut [u8]) -> Result<&'b [u8], Self::Error> {
        self.i2c.write_read(self.address, &[reg.into()], buf)?;
        Ok(buf)
    }

    fn write(&mut self, reg: Register, val: u8) -> Result<(), Self::Error> {
        self.i2c.write(self.address, &[reg.into(), val])
    }

    fn write_many(&mut self, reg: Register, bytes: &[u8]) -> Result<(), Self::Error> {
        let address = [reg.into()];
        let mut operations = [Operation::Write(&address), Operation::Write(bytes)];
        self.i2c.transaction(self.address, &mut operations)
    }
}

#[cfg(test)]
mod test {
    use crate::comm::blocking::i2c::I2cInterface;
    use crate::comm::Interface;
    use embedded_hal_mock::eh1::i2c::{Mock as I2cMock, Transaction as I2cTransaction};

    #[test]
    pub fn test_read() {
        let expectations = [I2cTransaction::write_read(
            0x2C,
            [0x0B].to_vec(),
            [0x37].to_vec(),
        )];

        let i2c = I2cMock::new(&expectations);
        let mut i2c_clone = i2c.clone();

        assert_eq!(
            I2cInterface::new(i2c, 0x2C).read(crate::register::Register::WaterLevelReg),
            Ok(0x37)
        );

        i2c_clone.done();
    }

    #[test]
    pub fn test_read_many_2() {
        let expectations = [I2cTransaction::write_read(
            0x2C,
            [0x15].to_vec(),
            [0x12, 0x23].to_vec(),
        )];

        let i2c = I2cMock::new(&expectations);
        let mut i2c_clone = i2c.clone();

        let mut buffer = [0u8; 2];
        I2cInterface::new(i2c, 0x2C)
            .read_many(crate::register::Register::TxASKReg, &mut buffer)
            .unwrap();
        assert_eq!(buffer, [0x12, 0x23]);

        i2c_clone.done();
    }

    #[test]
    pub fn test_read_many_3() {
        let expectations = [I2cTransaction::write_read(
            0x2C,
            [0x15].to_vec(),
            [0x12, 0x23, 0x34].to_vec(),
        )];

        let i2c = I2cMock::new(&expectations);
        let mut i2c_clone = i2c.clone();

        let mut buffer = [0u8; 3];
        I2cInterface::new(i2c, 0x2C)
            .read_many(crate::register::Register::TxASKReg, &mut buffer)
            .unwrap();
        assert_eq!(buffer, [0x12, 0x23, 0x34]);

        i2c_clone.done();
    }

    #[test]
    pub fn test_write() {
        let expectations = [I2cTransaction::write(0x2C, [0x21, 0xfd].to_vec())];

        let i2c = I2cMock::new(&expectations);
        let mut i2c_clone = i2c.clone();

        I2cInterface::new(i2c, 0x2C)
            .write(crate::register::Register::CRCResultRegHigh, 0xfd)
            .unwrap();

        i2c_clone.done();
    }

    #[test]
    pub fn test_write_many() {
        let expectations = [
            I2cTransaction::transaction_start(0x2c),
            I2cTransaction::write(0x2C, [0x27].to_vec()),
            I2cTransaction::write(0x2C, [0xca, 0xfe, 0xf0, 0x0d].to_vec()),
            I2cTransaction::transaction_end(0x2c),
        ];

        let i2c = I2cMock::new(&expectations);
        let mut i2c_clone = i2c.clone();

        I2cInterface::new(i2c, 0x2C)
            .write_many(crate::register::Register::GsNReg, &[0xca, 0xfe, 0xf0, 0x0d])
            .unwrap();

        i2c_clone.done();
    }
}
