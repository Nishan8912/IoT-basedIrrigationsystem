#include <DHT.h>  // Including library for dht
 
#include <ESP8266WiFi.h>

 
String apiKey = "Q66DC0DDI0KSJMK2";     //  Enter your Write API key from ThingSpeak
 
const char *ssid =  "Kathford";     // replace with your wifi ssid and wpa2 key nishanrai 11111111@
const char *pass =  "k@thf0RD@123";
const char* server = "api.thingspeak.com";
 
#define DHTPIN D1 //pin where the dht11 is connected
const int AirValue = 1000;
const int WaterValue= 450;
const int SensorPin = A0;
int SoilMoistureValue = 0; 
int soilMoisturePercent = 0;
const int relaypin = D6;
DHT dht(DHTPIN, DHT11);
int motorStatus = 0;
WiFiClient client;
 
void setup() 
{
       Serial.begin(9600);
       delay(100);
       dht.begin();
 
       Serial.println("Connecting to ");
       Serial.println(ssid);
 
 
       WiFi.begin(ssid, pass);
 
      while (WiFi.status() != WL_CONNECTED) 
     {
            delay(2000);
            Serial.print(".");
     }
      Serial.println("");
      Serial.println("WiFi connected");

      pinMode(relaypin, OUTPUT); // initialize pin as OUTPUT
 
}
 
void loop() 
{
  
      float h = dht.readHumidity();
      float t = dht.readTemperature();

      Serial.print("Temperature: ");
      Serial.print(t);
      Serial.print(" degrees Celcius, Humidity: ");
      Serial.print(h);

      SoilMoistureValue = analogRead(A0);
      soilMoisturePercent = map(SoilMoistureValue, AirValue, WaterValue, 0, 100);
      Serial.print(" Moisture e : ");
       Serial.println(abs( SoilMoistureValue));
       Serial.print(" Moisture Percentage : "); //Serial.print(SoilMoistureValue);
       Serial.println(abs(soilMoisturePercent));
       
      if(soilMoisturePercent<=30)
      {
        digitalWrite(relaypin , HIGH);
        motorStatus = 1;
        Serial.println("Moter is onn");
        
      }
      else if(soilMoisturePercent>= 50)
      {
        digitalWrite(relaypin ,LOW);
        motorStatus = 0;
        Serial.println("Moter is off");
        
      }
      
      
              if (isnan(h) || isnan(t)) 
                 {
                     Serial.println("Failed to read from DHT sensor!");
                      return;
                 }
 
                         if (client.connect(server,80))   //   "184.106.153.149" or api.thingspeak.com
                      {  
                            
                             String postStr = apiKey;
                             postStr +="&field1=";
                             postStr += String(t);
                             postStr +="&field2=";
                             postStr += String(h);
                             postStr +="&field3=";
                             postStr += String(abs(soilMoisturePercent));
                             postStr +="&field4=";
                             postStr += String(motorStatus);
                             postStr += "\r\n\r\n\r\n";
 
                             client.print("POST /update HTTP/1.1\n");
                             client.print("Host: api.thingspeak.com\n");
                             client.print("Connection: close\n");
                             client.print("X-THINGSPEAKAPIKEY: "+apiKey+"\n");
                             client.print("Content-Type: application/x-www-form-urlencoded\n");
                             client.print("Content-Length: ");
                             client.print(postStr.length());
                             client.print("\n\n");
                             client.print(postStr);
 
                             
                           
                             

                             Serial.println("%. Send to Thingspeak.");
                        }
          client.stop();
 
          Serial.println("Waiting...");
  
  // thingspeak needs minimum 15 sec delay between updates
  delay(1000);
}
