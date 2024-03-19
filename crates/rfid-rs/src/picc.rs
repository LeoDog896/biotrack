//! The PICC (short for Proximity Integrated Circuit Card) is a card or tag
//! using the ISO 14443A interface, eg Mifare or NTAG203.

/// Commands that can be send to the PICC.
///
/// The commands used for MIFARE Classic begin with **Mf**
/// (cfr [Section 9](http://www.mouser.com/ds/2/302/MF1S503x-89574.pdf)).
///
/// The commands used for MIFARE Ultralight begin with **Ul**
/// (cfr [Section 8.6](http://www.nxp.com/documents/data_sheet/MF0ICU1.pdf)).
///
/// Use `PCD_MFAuthent` to authenticate access to a sector,
/// then use the other commands to read/write/modify the blocks on the sector.
///
/// The read/write commands can also be used for MIFARE Ultralight.
#[allow(dead_code)]
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum Command {
    /// REQuest command, Type A. invites PICCs in state IDLE to go to READY\
    /// and prepare for anticollision or selection. 7 bit frame.
    ReqA = 0x26,
    /// Wake-UP command, Type A. invites PICCs in state IDLE and HALT to go to READY(*)\
    /// and prepare for anticollision or selection. 7 bit frame.
    WupA = 0x52,
    /// Cascade Tag. Not really a command, but used during anti collision.
    CT = 0x88,
    /// Anti collision/Select, Cascade Level 1
    SelCl1 = 0x93,
    /// Anti collision/Select, Cascade Level 2
    SelCl2 = 0x95,
    /// Anti collision/Select, Cascade Level 3
    SelCl3 = 0x97,
    /// HaLT command, Type A. Instructs an ACTIVE PICC to go to state HALT.
    HltA = 0x50,
    /// Request command for Answer To Select.
    RAtS = 0xE0,
    /// Perform authentication with Key A
    MfAuthKeyA = 0x60,
    /// Perform authentication with Key B
    MfAuthKeyB = 0x61,
    /// Reads one 16 byte block from the authenticated sector of the PICC.\
    /// Also used for MIFARE Ultralight.
    MfRead = 0x30,
    /// Writes one 16 byte block to the authenticated sector of the PICC.\
    /// Called "COMPATIBILITY WRITE" for MIFARE Ultralight.
    MfWrite = 0xA0,
    /// Decrements the contents of a block and stores the result in the internal data register.
    MfDecrement = 0xC0,
    /// Increments the contents of a block and stores the result in the internal data register.
    MfIncrement = 0xC1,
    /// Reads the contents of a block into the internal data register.
    MfRestore = 0xC2,
    /// Writes the contents of the internal data register to a block.
    MfTransfer = 0xB0,
    /// Writes one 4 byte page to the PICC.
    UlWrite = 0xA2,
}

/// PICC Type
#[allow(dead_code)]
#[derive(Debug)]
pub enum Type {
    Unknown,
    /// PICC compliant with ISO/IEC 14443-4
    Iso14443_4,
    /// PICC compliant with ISO/IEC 18092 (NFC)
    Iso18092,
    /// MIFARE Classic protocol, 320 bytes
    MifareMini,
    /// MIFARE Classic protocol, 1KB
    Mifare1k,
    /// MIFARE Classic protocol, 4KB
    Mifare4k,
    /// MIFARE Ultralight or Ultralight C
    MifareUL,
    /// MIFARE Plus
    MifarePlus,
    /// MIFARE DESFire
    MifareDesfire,
    /// Only mentioned in NXP AN 10833 MIFARE Type Identification Procedure
    TNP3XXX,
    /// SAK indicates UID is not complete.
    NotComplete,
}

/// Select Acknowledge
pub struct Sak {
    byte: u8,
}

impl From<u8> for Sak {
    fn from(byte: u8) -> Self {
        Sak { byte }
    }
}

impl Sak {
    #[allow(dead_code)]
    pub fn get_type(&self) -> Type {
        // https://www.nxp.com/docs/en/application-note/AN10833.pdf
        // 3.2 Coding of Select Acknowledge (SAK)
        // ignore 8-bit (iso14443 starts with LSBit = bit 1)
        // fixes wrong type for manufacturer Infineon (http://nfc-tools.org/index.php?title=ISO14443A)
        match self.byte & 0x7F {
            0x04 => Type::NotComplete, // UID not complete
            0x09 => Type::MifareMini,
            0x08 => Type::Mifare1k,
            0x18 => Type::Mifare4k,
            0x00 => Type::MifareUL,
            0x10 | 0x11 => Type::MifarePlus,
            0x01 => Type::TNP3XXX,
            0x20 => Type::Iso14443_4,
            0x40 => Type::Iso18092,
            _ => Type::Unknown,
        }
    }

    /// Is the PICC compliant with ISO/IEC 14443-4
    pub fn is_compliant(&self) -> bool {
        self.byte & (1 << 5) != 0
    }

    /// Does the SAK indicate the UID has been completely received
    pub fn is_complete(&self) -> bool {
        self.byte & (1 << 2) == 0
    }
}
