#include <Arduino.h>
#include <MFRC522.h>
#include "NfcAdapter.h"
#include <ESP8266WiFi.h>

#define CS_PIN 13

const char* ssid = "........";
const char* password = "........";

MFRC522 mfrc522(8, 3); // Create MFRC522 instance

NfcAdapter nfc = NfcAdapter(&mfrc522);

void setup(void)
{
  Serial.begin(9600);
  delay(10);
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
    int payloadLength = record.getPayloadLength();
    int typeLength = record.getTypeLength();
    char type[typeLength];
    for (int i = typeLength + langLength; i < payloadLength; i++)
    {
      type[i - typeLength - langLength] = (char)record.getPayload()[i];
    }
  }
}
