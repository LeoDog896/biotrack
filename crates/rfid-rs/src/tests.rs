#[cfg(all(test, feature = "eh02"))]
mod test_eh02_spi {
    use crate::comm::eh02::spi::SpiInterface;
    use crate::Mfrc522;
    use embedded_hal_mock::eh0::spi::{Mock as SpiMock, Transaction as SpiTransaction};

    #[test]
    pub fn test_calculate_crc() {
        let expectations = [
            SpiTransaction::write([0x02, 0x00].to_vec()),
            SpiTransaction::write([0x0A, 0x04].to_vec()),
            SpiTransaction::write([0x14, 0x80].to_vec()),
            SpiTransaction::write([0x12, 0x01, 0x02, 0x40].to_vec()),
            SpiTransaction::write([0x02, 0x03].to_vec()),
            SpiTransaction::transfer([0x8A, 0x00].to_vec(), [0x23, 0x00].to_vec()),
            SpiTransaction::transfer([0x8A, 0x00].to_vec(), [0x32, 0x1B].to_vec()),
            SpiTransaction::transfer([0x8A, 0x00].to_vec(), [0x63, 0x1F].to_vec()),
            SpiTransaction::write([0x02, 0x00].to_vec()),
            SpiTransaction::transfer([0xC4, 0x00].to_vec(), [0x29, 0xbe].to_vec()),
            SpiTransaction::transfer([0xC2, 0x00].to_vec(), [0x93, 0xef].to_vec()),
        ];

        let spi = SpiMock::new(&expectations);
        let mut spi_clone = spi.clone();
        let spi = SpiInterface::new(spi);

        assert_eq!(
            Mfrc522::new(spi).calculate_crc(&[0x01, 0x02, 0x40]),
            Ok([0xbe, 0xef])
        );

        spi_clone.done();
    }

    #[test]
    pub fn test_transceive() {
        let expectations = [
            SpiTransaction::write([0x02, 0x00].to_vec()),
            SpiTransaction::write([0x08, 0x7f].to_vec()),
            SpiTransaction::write([0x14, 0x80].to_vec()),
            SpiTransaction::write([0x12, 0xfe, 0xed].to_vec()),
            SpiTransaction::write([0x02, 0x0C].to_vec()),
            SpiTransaction::write([0x1A, 0xA1].to_vec()),
            SpiTransaction::transfer([0x88, 0x00].to_vec(), [0x39, 0x04].to_vec()),
            SpiTransaction::transfer([0x88, 0x00].to_vec(), [0x71, 0x02].to_vec()),
            SpiTransaction::transfer([0x8C, 0x00].to_vec(), [0xef, 0x00].to_vec()),
            SpiTransaction::transfer([0x94, 0x00].to_vec(), [0xe0, 0x04].to_vec()),
            SpiTransaction::transfer(
                [0x92, 0x92, 0x92, 0x92, 0x00].to_vec(),
                [0x91, 0x98, 0x76, 0x52, 0x2b].to_vec(),
            ),
            SpiTransaction::transfer([0x98, 0x00].to_vec(), [0x30, 0xf3].to_vec()),
        ];

        let spi = SpiMock::new(&expectations);
        let mut spi_clone = spi.clone();
        let spi = SpiInterface::new(spi);

        assert_eq!(
            Mfrc522::new(spi).transceive::<4>(&[0xfe, 0xed], 0xf9, 0xfa),
            Ok(crate::FifoData {
                buffer: [0x98, 0x76, 0x52, 0x2b],
                valid_bytes: 4,
                valid_bits: 3,
            })
        );

        spi_clone.done();
    }
}

#[cfg(all(test, feature = "eh02"))]
mod test_eh02_i2c {
    use crate::comm::eh02::i2c::I2cInterface;
    use crate::Mfrc522;
    use embedded_hal_mock::eh0::i2c::{Mock as I2cMock, Transaction as I2cTransaction};

    #[test]
    pub fn test_calculate_crc() {
        let expectations = [
            I2cTransaction::write(0x2C, [0x01, 0x00].to_vec()),
            I2cTransaction::write(0x2C, [0x05, 0x04].to_vec()),
            I2cTransaction::write(0x2C, [0x0A, 0x80].to_vec()),
            I2cTransaction::write(0x2C, [0x09, 0x01, 0x02, 0x40].to_vec()),
            I2cTransaction::write(0x2C, [0x01, 0x03].to_vec()),
            I2cTransaction::write_read(0x2C, [0x05].to_vec(), [0x00].to_vec()),
            I2cTransaction::write_read(0x2C, [0x05].to_vec(), [0x1B].to_vec()),
            I2cTransaction::write_read(0x2C, [0x05].to_vec(), [0x1F].to_vec()),
            I2cTransaction::write(0x2C, [0x01, 0x00].to_vec()),
            I2cTransaction::write_read(0x2C, [0x22].to_vec(), [0xbe].to_vec()),
            I2cTransaction::write_read(0x2C, [0x21].to_vec(), [0xef].to_vec()),
        ];

        let i2c = I2cMock::new(&expectations);
        let mut i2c_clone = i2c.clone();
        let i2c = I2cInterface::new(i2c, 0x2c);

        assert_eq!(
            Mfrc522::new(i2c).calculate_crc(&[0x01, 0x02, 0x40]),
            Ok([0xbe, 0xef])
        );

        i2c_clone.done();
    }

    #[test]
    pub fn test_transceive() {
        let expectations = [
            I2cTransaction::write(0x2C, [0x01, 0x00].to_vec()),
            I2cTransaction::write(0x2C, [0x04, 0x7f].to_vec()),
            I2cTransaction::write(0x2C, [0x0A, 0x80].to_vec()),
            I2cTransaction::write(0x2C, [0x09, 0xfe, 0xed].to_vec()),
            I2cTransaction::write(0x2C, [0x01, 0x0C].to_vec()),
            I2cTransaction::write(0x2C, [0x0D, 0xA1].to_vec()),
            I2cTransaction::write_read(0x2C, [0x04].to_vec(), [0x04].to_vec()),
            I2cTransaction::write_read(0x2C, [0x04].to_vec(), [0x02].to_vec()),
            I2cTransaction::write_read(0x2C, [0x06].to_vec(), [0x00].to_vec()),
            I2cTransaction::write_read(0x2C, [0x0A].to_vec(), [0x04].to_vec()),
            I2cTransaction::write_read(0x2C, [0x09].to_vec(), [0x98, 0x76, 0x52, 0x2b].to_vec()),
            I2cTransaction::write_read(0x2C, [0x0C].to_vec(), [0x91].to_vec()),
        ];

        let i2c = I2cMock::new(&expectations);
        let mut i2c_clone = i2c.clone();
        let i2c = I2cInterface::new(i2c, 0x2c);

        assert_eq!(
            Mfrc522::new(i2c).transceive::<4>(&[0xfe, 0xed], 0xf9, 0xfa),
            Ok(crate::FifoData {
                buffer: [0x98, 0x76, 0x52, 0x2b],
                valid_bytes: 4,
                valid_bits: 1,
            })
        );

        i2c_clone.done();
    }
}

#[cfg(test)]
mod test_eh1_spi {
    use crate::comm::blocking::spi::SpiInterface;
    use crate::Mfrc522;
    use embedded_hal_mock::eh1::spi::{Mock as SpiMock, Transaction as SpiTransaction};

    #[test]
    pub fn test_calculate_crc() {
        let expectations = [
            SpiTransaction::transaction_start(),
            SpiTransaction::write_vec([0x02, 0x00].to_vec()),
            SpiTransaction::transaction_end(),

            SpiTransaction::transaction_start(),
            SpiTransaction::write_vec([0x0A, 0x04].to_vec()),
            SpiTransaction::transaction_end(),

            SpiTransaction::transaction_start(),
            SpiTransaction::write_vec([0x14, 0x80].to_vec()),
            SpiTransaction::transaction_end(),

            SpiTransaction::transaction_start(),
            SpiTransaction::write_vec([0x12].to_vec()),
            SpiTransaction::write_vec([0x01, 0x02, 0x40].to_vec()),
            SpiTransaction::transaction_end(),

            SpiTransaction::transaction_start(),
            SpiTransaction::write_vec([0x02, 0x03].to_vec()),
            SpiTransaction::transaction_end(),

            SpiTransaction::transaction_start(),
            SpiTransaction::transfer_in_place([0x8A, 0x00].to_vec(), [0x23, 0x00].to_vec()),
            SpiTransaction::transaction_end(),

            SpiTransaction::transaction_start(),
            SpiTransaction::transfer_in_place([0x8A, 0x00].to_vec(), [0x32, 0x1B].to_vec()),
            SpiTransaction::transaction_end(),

            SpiTransaction::transaction_start(),
            SpiTransaction::transfer_in_place([0x8A, 0x00].to_vec(), [0x63, 0x1F].to_vec()),
            SpiTransaction::transaction_end(),

            SpiTransaction::transaction_start(),
            SpiTransaction::write_vec([0x02, 0x00].to_vec()),
            SpiTransaction::transaction_end(),

            SpiTransaction::transaction_start(),
            SpiTransaction::transfer_in_place([0xC4, 0x00].to_vec(), [0x29, 0xbe].to_vec()),
            SpiTransaction::transaction_end(),

            SpiTransaction::transaction_start(),
            SpiTransaction::transfer_in_place([0xC2, 0x00].to_vec(), [0x93, 0xef].to_vec()),
            SpiTransaction::transaction_end(),
        ];

        let spi = SpiMock::new(&expectations);
        let mut spi_clone = spi.clone();
        let spi = SpiInterface::new(spi);

        assert_eq!(
            Mfrc522::new(spi).calculate_crc(&[0x01, 0x02, 0x40]),
            Ok([0xbe, 0xef])
        );

        spi_clone.done();
    }

    #[test]
    pub fn test_transceive() {
        let expectations = [
            SpiTransaction::transaction_start(),
            SpiTransaction::write_vec([0x02, 0x00].to_vec()),
            SpiTransaction::transaction_end(),

            SpiTransaction::transaction_start(),
            SpiTransaction::write_vec([0x08, 0x7f].to_vec()),
            SpiTransaction::transaction_end(),

            SpiTransaction::transaction_start(),
            SpiTransaction::write_vec([0x14, 0x80].to_vec()),
            SpiTransaction::transaction_end(),

            SpiTransaction::transaction_start(),
            SpiTransaction::write_vec([0x12].to_vec()),
            SpiTransaction::write_vec([0xfe, 0xed].to_vec()),
            SpiTransaction::transaction_end(),

            SpiTransaction::transaction_start(),
            SpiTransaction::write_vec([0x02, 0x0C].to_vec()),
            SpiTransaction::transaction_end(),

            SpiTransaction::transaction_start(),
            SpiTransaction::write_vec([0x1A, 0xA1].to_vec()),
            SpiTransaction::transaction_end(),

            SpiTransaction::transaction_start(),
            SpiTransaction::transfer_in_place([0x88, 0x00].to_vec(), [0x00, 0x04].to_vec()),
            SpiTransaction::transaction_end(),

            SpiTransaction::transaction_start(),
            SpiTransaction::transfer_in_place([0x88, 0x00].to_vec(), [0x00, 0x02].to_vec()),
            SpiTransaction::transaction_end(),

            SpiTransaction::transaction_start(),
            SpiTransaction::transfer_in_place([0x8C, 0x00].to_vec(), [0x00, 0x00].to_vec()),
            SpiTransaction::transaction_end(),
            SpiTransaction::transaction_start(),
            SpiTransaction::transfer_in_place([0x94, 0x00].to_vec(), [0x00, 0x04].to_vec()),
            SpiTransaction::transaction_end(),

            SpiTransaction::transaction_start(),
            SpiTransaction::write(0x92),
            SpiTransaction::transfer_in_place(
                [0x92, 0x92, 0x92, 0x00].to_vec(),
                [0x98, 0x76, 0x52, 0x2b].to_vec(),
            ),
            SpiTransaction::transaction_end(),
            SpiTransaction::transaction_start(),
            SpiTransaction::transfer_in_place([0x98, 0x00].to_vec(), [0x00, 0xf3].to_vec()),
            SpiTransaction::transaction_end(),
        ];

        let spi = SpiMock::new(&expectations);
        let mut spi_clone = spi.clone();
        let spi = SpiInterface::new(spi);

        assert_eq!(
            Mfrc522::new(spi).transceive::<4>(&[0xfe, 0xed], 0xf9, 0xfa),
            Ok(crate::FifoData {
                buffer: [0x98, 0x76, 0x52, 0x2b],
                valid_bytes: 4,
                valid_bits: 3,
            })
        );

        spi_clone.done();
    }
}

#[cfg(test)]
mod test_eh1_i2c {
    use crate::comm::blocking::i2c::I2cInterface;
    use crate::Mfrc522;
    use embedded_hal_mock::eh1::i2c::{Mock as I2cMock, Transaction as I2cTransaction};

    #[test]
    pub fn test_calculate_crc() {
        let expectations = [
            I2cTransaction::write(0x2C, [0x01, 0x00].to_vec()),
            I2cTransaction::write(0x2C, [0x05, 0x04].to_vec()),
            I2cTransaction::write(0x2C, [0x0A, 0x80].to_vec()),
            I2cTransaction::transaction_start(0x2c),
            I2cTransaction::write(0x2c, [0x09].to_vec()),
            I2cTransaction::write(0x2c, [0x01, 0x02, 0x40].to_vec()),
            I2cTransaction::transaction_end(0x2c),
            I2cTransaction::write(0x2C, [0x01, 0x03].to_vec()),
            I2cTransaction::write_read(0x2C, [0x05].to_vec(), [0x00].to_vec()),
            I2cTransaction::write_read(0x2C, [0x05].to_vec(), [0x1B].to_vec()),
            I2cTransaction::write_read(0x2C, [0x05].to_vec(), [0x1F].to_vec()),
            I2cTransaction::write(0x2C, [0x01, 0x00].to_vec()),
            I2cTransaction::write_read(0x2C, [0x22].to_vec(), [0xbe].to_vec()),
            I2cTransaction::write_read(0x2C, [0x21].to_vec(), [0xef].to_vec()),
        ];

        let i2c = I2cMock::new(&expectations);
        let mut i2c_clone = i2c.clone();
        let i2c = I2cInterface::new(i2c, 0x2c);

        assert_eq!(
            Mfrc522::new(i2c).calculate_crc(&[0x01, 0x02, 0x40]),
            Ok([0xbe, 0xef])
        );

        i2c_clone.done();
    }

    #[test]
    pub fn test_transceive() {
        let expectations = [
            I2cTransaction::write(0x2C, [0x01, 0x00].to_vec()),
            I2cTransaction::write(0x2C, [0x04, 0x7f].to_vec()),
            I2cTransaction::write(0x2C, [0x0A, 0x80].to_vec()),
            I2cTransaction::transaction_start(0x2c),
            I2cTransaction::write(0x2C, [0x09].to_vec()),
            I2cTransaction::write(0x2C, [0xfe, 0xed].to_vec()),
            I2cTransaction::transaction_end(0x2c),
            I2cTransaction::write(0x2C, [0x01, 0x0C].to_vec()),
            I2cTransaction::write(0x2C, [0x0D, 0xA1].to_vec()),
            I2cTransaction::write_read(0x2C, [0x04].to_vec(), [0x04].to_vec()),
            I2cTransaction::write_read(0x2C, [0x04].to_vec(), [0x02].to_vec()),
            I2cTransaction::write_read(0x2C, [0x06].to_vec(), [0x00].to_vec()),
            I2cTransaction::write_read(0x2C, [0x0A].to_vec(), [0x04].to_vec()),
            I2cTransaction::write_read(0x2C, [0x09].to_vec(), [0x98, 0x76, 0x52, 0x2b].to_vec()),
            I2cTransaction::write_read(0x2C, [0x0C].to_vec(), [0x91].to_vec()),
        ];

        let i2c = I2cMock::new(&expectations);
        let mut i2c_clone = i2c.clone();
        let i2c = I2cInterface::new(i2c, 0x2c);

        assert_eq!(
            Mfrc522::new(i2c).transceive::<4>(&[0xfe, 0xed], 0xf9, 0xfa),
            Ok(crate::FifoData {
                buffer: [0x98, 0x76, 0x52, 0x2b],
                valid_bytes: 4,
                valid_bits: 1,
            })
        );

        i2c_clone.done();
    }
}
