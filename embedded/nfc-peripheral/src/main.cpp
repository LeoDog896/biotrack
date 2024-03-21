/*
 * Derived from https://github.com/miguelbalboa/rfid/blob/master/examples/ReadNUID/ReadNUID.ino.
 * Pin layout used:
 * -----------------------------------------------------------------------------------------
 *             MFRC522      Arduino       Arduino   Arduino    Arduino          Arduino
 *             Reader/PCD   Uno/101       Mega      Nano v3    Leonardo/Micro   Pro Micro
 * Signal      Pin          Pin           Pin       Pin        Pin              Pin
 * -----------------------------------------------------------------------------------------
 * RST/Reset   RST          9             5         D9         RESET/ICSP-5     RST
 * SPI SS      SDA(SS)      10            53        D10        10               10
 * SPI MOSI    MOSI         11 / ICSP-4   51        D11        ICSP-4           16
 * SPI MISO    MISO         12 / ICSP-1   50        D12        ICSP-1           14
 * SPI SCK     SCK          13 / ICSP-3   52        D13        ICSP-3           15
 */

#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 10
#define RST_PIN 9

// Global rfid object
MFRC522 rfid(SS_PIN, RST_PIN);

/**
 * Helper routine to dump a byte array as decimal values to Serial.
 */
void printDecimal(byte *buffer, byte bufferSize)
{
  for (byte i = 0; i < bufferSize; i++) {
    Serial.print(' ');
    Serial.print(buffer[i], DEC);
  }
}

void setup()
{
  Serial.begin(9600);
  // Init SPI bus
  SPI.begin();
  // Setup MFRC522
  rfid.PCD_Init();

  Serial.println(F("log: init"));
}

void loop()
{

  // Reset the loop if no new card present on the sensor/reader. This saves the entire process when idle.
  if (!rfid.PICC_IsNewCardPresent())
    return;

  // Verify if the NUID has been readed
  if (!rfid.PICC_ReadCardSerial())
    return;

  MFRC522::PICC_Type piccType = rfid.PICC_GetType(rfid.uid.sak);

  // Check is the PICC of Classic MIFARE type
  if (piccType != MFRC522::PICC_TYPE_MIFARE_MINI &&
      piccType != MFRC522::PICC_TYPE_MIFARE_1K &&
      piccType != MFRC522::PICC_TYPE_MIFARE_4K)
  {
    Serial.print(F("error: tag not of type MIFARE Classic, it is "));
    Serial.println(rfid.PICC_GetTypeName(piccType));
    return;
  }

  Serial.print(F("tag:"));
  rfid.PICC_DumpToSerial(&(rfid.uid));
  printDecimal(rfid.uid.uidByte, rfid.uid.size);
  Serial.println();

  // Halt PICC
  rfid.PICC_HaltA();

  // Stop encryption on PCD
  rfid.PCD_StopCrypto1();
}
