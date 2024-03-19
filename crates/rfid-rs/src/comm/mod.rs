//! Contains implementations for the different communication interfaces
//! that are available for the MFRC522.

pub mod blocking;
#[cfg(feature = "eh02")]
pub mod eh02;

use crate::register::Register;

/// Abstraction over the different communication interfaces
pub trait Interface {
    type Error;
    /// Read the value of a register
    fn read(&mut self, reg: Register) -> Result<u8, Self::Error>;
    /// Read the value of a register larger than a single byte (the FIFO)
    fn read_many<'b>(&mut self, reg: Register, buf: &'b mut [u8]) -> Result<&'b [u8], Self::Error>;
    /// Write the value of a register
    fn write(&mut self, reg: Register, val: u8) -> Result<(), Self::Error>;
    /// Write values to a register larger than a single byte (the FIFO)
    fn write_many(&mut self, reg: Register, bytes: &[u8]) -> Result<(), Self::Error>;
    /// Execute a read-modify-write operation
    fn rmw<F>(&mut self, reg: Register, f: F) -> Result<(), Self::Error>
    where
        F: FnOnce(u8) -> u8,
    {
        let byte = self.read(reg)?;
        self.write(reg, f(byte))?;
        Ok(())
    }
}
