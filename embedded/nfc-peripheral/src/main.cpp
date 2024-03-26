// #include <SPI.h>
#include <MFRC522.h>
#include "NfcAdapter.h"

#define CS_PIN 10

MFRC522 mfrc522(CS_PIN, UINT8_MAX); // Create MFRC522 instance

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

enum command
{
  read,
  write,
  none
};

command cmd = none;
char amount[3];
bool writing = false;
bool writeToNFC = false;
char bytes[999];

// length of language code ("en")
const int langLength = 2;

void loop(void)
{
  if (nfc.tagPresent())
  {
    if (cmd == read)
    {
      NfcTag tag = nfc.read();
      NdefMessage message = tag.getNdefMessage();
      NdefRecord record = message.getRecord(0);
      Serial.print("tag: ");
      int payloadLength = record.getPayloadLength();
      int typeLength = record.getTypeLength();
      for (int i = 0; i < 3 - String(payloadLength - typeLength - langLength).length(); i++)
      {
        Serial.print("0");
      }
      Serial.print(payloadLength - typeLength - langLength);
      Serial.print(" ");
      for (int i = typeLength + langLength; i < payloadLength; i++)
      {
        Serial.print((char)record.getPayload()[i]);
      }
      Serial.println();
      cmd = none;
    }
    else if (cmd == write && writeToNFC)
    {
      NdefMessage message = NdefMessage();
      message.addTextRecord(bytes);
      nfc.write(message);
      writing = false;
      writeToNFC = false;
      cmd = none;
      bytes[0] = '\0';
      amount[0] = '\0';
      Serial.println("log: done writing");
      return;
    }
  }

  if (Serial.available() > 0)
  {
    if (writeToNFC)
      return;

    char inChar = Serial.read();

    if (writing)
    {
      bytes[strlen(bytes)] = inChar;
      if (strlen(bytes) == atoi(amount))
      {
        Serial.println("log: begin writing; put in card");
        writeToNFC = true;
        return;
      }
      return;
    }

    // if inChar is a digit, append
    if (inChar >= '0' && inChar <= '9')
    {
      amount[strlen(amount)] = inChar;

      if (strlen(amount) == 3)
      {
        int amountInt = atoi(amount);
        Serial.print("log: now, write ");
        Serial.print(amountInt);
        Serial.println(" bytes:");
        writing = true;
      }
      return;
    }

    if (inChar == 'r')
    {
      cmd = read;
      Serial.println("log: read");
      return;
    }
    else if (inChar == 'w')
    {
      cmd = write;
      amount[strlen(amount)] = '\0';
      Serial.println("log: write; how much?");
      return;
    }
    else if (inChar == 'p')
    {
      Serial.println("log: pong");
      return;
    }
  }
}
