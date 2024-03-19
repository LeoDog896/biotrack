//! BeagleBone Black demo
//!
//! # Connections
//!
//! - P9.1  = 3V3       = VCC
//! - P9.3  = GND       = GND
//! - P9.17 = SPI0_CS0  = NSS  (config-pin P9.17 spi_cs (or gpio))
//! - P9.18 = SPI0_D1   = MOSI (config-pin P9.18 spi)
//! - P9.21 = SPI0_D0   = MISO (config-pin P9.21 spi)
//! - P9.22 = SPI0_SCLK = SCLK (config-pin P9.22 spi_sclk)

use embedded_hal_1 as embedded_hal;
use linux_embedded_hal as hal;

use std::fs::File;
use std::io::Write;

use embedded_hal::delay::DelayNs;
use hal::spidev::{SpiModeFlags, SpidevOptions};
use hal::{Delay, SpidevDevice};
use mfrc522::comm::{blocking::spi::SpiInterface, Interface};
use mfrc522::{Initialized, Mfrc522};

// NOTE this requires tweaking permissions and configuring LED0
//
// ```
// $ echo gpio | sudo tee /sys/class/leds/led0/trigger
// $ sudo chown root:gpio /sys/class/leds/led0/brightness
// $ sudo chmod 770 /sys/class/leds/led0/brightness
// ```
//
// Alternatively you can omit the LED and comment out the contents of the `on` and `off` methods
// below
pub struct Led;

impl Led {
    fn on(&mut self) {
        File::create("/sys/class/leds/beaglebone:green:usr1/brightness")
            .unwrap()
            .write_all(b"1\n")
            .unwrap();
    }

    fn off(&mut self) {
        File::create("/sys/class/leds/beaglebone:green:usr1/brightness")
            .unwrap()
            .write_all(b"0\n")
            .unwrap();
    }
}

fn main() {
    let mut spi = SpidevDevice::open("/dev/spidev0.0").unwrap();
    let options = SpidevOptions::new()
        .max_speed_hz(1_000_000)
        .mode(SpiModeFlags::SPI_MODE_0)
        .build();
    spi.configure(&options).unwrap();

    let mut led = Led;
    let mut delay = Delay;
    // The `new` method assumes the chip select is hardware-controlled.
    // If you want software chip select (with GPIO5 in this case),
    // add a call to `with_nss(pin)`.
    let itf = SpiInterface::new(spi);
    let mut mfrc522 = Mfrc522::new(itf).init().unwrap();

    let vers = mfrc522.version().unwrap();

    println!("VERSION: 0x{:x}", vers);

    assert!(vers == 0x91 || vers == 0x92);

    loop {
        const CARD_UID: [u8; 4] = [34, 246, 178, 171];
        const TAG_UID: [u8; 4] = [128, 170, 179, 76];

        match mfrc522.reqa() {
            Ok(atqa) => {
                if let Ok(uid) = mfrc522.select(&atqa) {
                    println!("UID: {:?}", uid.as_bytes());

                    if uid.as_bytes() == &CARD_UID {
                        led.off();
                        println!("CARD");
                    } else if uid.as_bytes() == &TAG_UID {
                        led.on();
                        println!("TAG");
                    }

                    handle_authenticate(&mut mfrc522, &uid, |m| {
                        match m.mf_read(1) {
                            Ok(data) => {
                                println!("read {:?}", data);
                            }
                            Err(_) => {
                                println!("error during read");
                            }
                        }
                        // or try to write
                        //let buffer = [
                        //    0x0F, 0x0E, 0x0D, 0x0C,
                        //    0x0B, 0x0A, 0x09, 0x08,
                        //    0x07, 0x06, 0x05, 0x04,
                        //    0x03, 0x02, 0x01, 0x00,
                        //];
                        //match m.mf_write(1, buffer) {
                        //    Ok(_) => {
                        //        println!("write success");
                        //    }
                        //    Err(_) => {
                        //        println!("error during write");
                        //    }
                        //}
                    });
                }
            }
            Err(e) => {
                println!("ERROR: {:?}", e);
            }
        }
        delay.delay_ms(1000u32);
    }
}

fn handle_authenticate<E, COMM: Interface<Error = E>, F>(
    mfrc522: &mut Mfrc522<COMM, Initialized>,
    uid: &mfrc522::Uid,
    action: F,
) where
    F: FnOnce(&mut Mfrc522<COMM, Initialized>) -> (),
{
    let key = [0xFF; 6];
    if mfrc522.mf_authenticate(uid, 1, &key).is_ok() {
        action(mfrc522);
    } else {
        println!("Could not authenticate");
    }

    if mfrc522.hlta().is_err() {
        println!("Could not halt");
    }
    if mfrc522.stop_crypto1().is_err() {
        println!("Could not disable crypto1");
    }
}
