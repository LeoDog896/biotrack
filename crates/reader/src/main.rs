#![no_std]
#![no_main]

use embedded_hal::blocking::spi::Operation;
use mfrc522::{comm::{blocking::spi::{SpiInterface, WrapTransfer}, Interface}, register::Register, Mfrc522};
use panic_halt as _;
use arduino_hal::spi::Spi;


impl<E, D> Interface for Spi {
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

#[arduino_hal::entry]
fn main() -> ! {
    let dp = arduino_hal::Peripherals::take().unwrap();
    let pins = arduino_hal::pins!(dp);

    // ss goes to 10
    // sck goes to 13
    // mosi goes to 11
    // miso goes to 12
    // rst goes to 9

    let (mut spi, _) = arduino_hal::spi::Spi::new(
        dp.SPI,
        pins.d13.into_output(),
        pins.d11.into_output(),
        pins.d12.into_pull_up_input(),
        pins.d10.into_output(),

        arduino_hal::spi::Settings::default()
    );

    let itf = SpiInterface::new(spi);
    let mut mfrc522 = Mfrc522::new(itf);
    
    loop {
        match mfrc522.wupa() {
            Ok(atqa) => {
                if let Ok(uid) = mfrc522.select(&atqa) {
                    // rprintln!("Card detected! {:X?}", uid.as_bytes());
                }
            },
            Err(e) => {
                // rprintln!("Err: {:?}", e);
            },
        }


        arduino_hal::delay_ms(1000);
    }
}
