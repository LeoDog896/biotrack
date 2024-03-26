#include <Arduino.h>
#include <MFRC522.h>
#include "NfcAdapter.h"

#define CS_PIN 13

MFRC522 mfrc522(8, 3); // Create MFRC522 instance

NfcAdapter nfc = NfcAdapter(&mfrc522);

void setup(void)
{
  Serial.begin(9600);
  // Init SPI bus
  SPI.begin();
  // Init MFRC522
  mfrc522.PCD_Init();
  nfc.begin();
  Serial.println("log: init");
}

// length of language code ("en")
const int langLength = 2;

void loop(void)
{
  Serial.println(nfc.tagPresent());
  if (nfc.tagPresent())
  {
    NfcTag tag = nfc.read();
    NdefMessage message = tag.getNdefMessage();
    NdefRecord record = message.getRecord(0);
    //Serial.print("tag: ");
    int payloadLength = record.getPayloadLength();
    int typeLength = record.getTypeLength();
    for (unsigned int i = 0; i < 3 - String(payloadLength - typeLength - langLength).length(); i++)
    {
      // Serial.print("0");
    }
    // Serial.print(payloadLength - typeLength - langLength);
    //Serial.print(" ");
    for (int i = typeLength + langLength; i < payloadLength; i++)
    {
      // Serial.print((char)record.getPayload()[i]);
    }
    //Serial.println();
  }
}
