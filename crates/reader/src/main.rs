#![no_std]
#![no_main]

use panic_halt as _;

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
    
    loop {
        arduino_hal::delay_ms(1000);
    }
}
