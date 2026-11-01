#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

// ---------- Wi-Fi Credentials ----------
const char* ssid = "YOUR_WIFI_SSID";       // আপনার ওয়াইফাইয়ের নাম দিন
const char* password = "YOUR_WIFI_PASSWORD"; // আপনার ওয়াইফাইয়ের পাসওয়ার্ড দিন

// ---------- Backend Server API URL ----------
// নোড জেএস সার্ভার যে পিসিতে চলছে, সেই পিসির লোকাল আইপি অ্যাড্রেস দিন (যেমন: http://192.168.0.105:5000/api)
const String serverUrl = "http://192.168.X.X:5000/api/sensor-data";

// ---------- Pin Definitions ----------
#define DHTPIN 4           // DHT11 ডাটা পিন GPIO 4
#define DHTTYPE DHT11      // DHT 11 সেন্সর টাইপ
#define SOIL_PIN 34        // সয়েল ময়েশ্চার অ্যানালগ পিন GPIO 34
#define PUMP_PIN 26        // রিলে মডিউল পিন GPIO 26

DHT dht(DHTPIN, DHTTYPE);

// Timing variables
unsigned long lastTime = 0;
unsigned long timerDelay = 5000; // প্রতি ৫ সেকেন্ড পর পর ডাটা পাঠাবে

void setup() {
  Serial.begin(115200);

  // Pin Modes Setup
  pinMode(SOIL_PIN, INPUT);
  pinMode(PUMP_PIN, OUTPUT);
  digitalWrite(PUMP_PIN, HIGH); // ডিফল্টভাবে পিন হাই (রিলে অফ মোড, রিলে সাধারণত LOW-তে ট্রিগার হয়)

  // Initialize Sensors
  dht.begin();

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // নির্দিষ্ট সময় পর পর (প্রতি ৫ সেকেন্ডে) ডাটা রিড ও সেন্ড করবে
  if ((millis() - lastTime) > timerDelay) {
    
    if (WiFi.status() == WL_CONNECTED) {
      
      // 1. Read Sensors
      int rawSoilValue = analogRead(SOIL_PIN);
      // সয়েল ময়েশ্চার রিডিং পার্সেন্টেজে রূপান্তর (ক্যালিব্রেশনের ওপর ভিত্তি করে এটি অ্যাডজাস্ট করতে হতে পারে)
      int soilMoisture = map(rawSoilValue, 4095, 0, 0, 100); 
      soilMoisture = constrain(soilMoisture, 0, 100);

      float humidity = dht.readHumidity();
      float temperature = dht.readTemperature();

      // সেন্সর রিডিং ঠিকমতো না আসলে চেক করা
      if (isnan(humidity) || isnan(temperature)) {
        Serial.println("Failed to read from DHT sensor!");
        return;
      }

      // বর্তমান পাম্পের স্ট্যাটাস চেক করা (RELAY_PIN LOW হলে পাম্প অন হয় ধরে নিচ্ছি)
      bool currentPumpStatus = (digitalRead(PUMP_PIN) == LOW);

      // 2. Prepare JSON Payload
      String httpRequestData = "{\"soilMoisture\":" + String(soilMoisture) + 
                               ",\"temperature\":" + String(temperature) + 
                               ",\"humidity\":" + String(humidity) + 
                               ",\"pumpStatus\":" + (currentPumpStatus ? "true" : "false") + "}";

      // 3. Send HTTP POST Request
      HTTPClient http;
      http.begin(serverUrl);
      http.addHeader("Content-Type", "application/json");

      int httpResponseCode = http.POST(httpRequestData);

      if (httpResponseCode > 0) {
        Serial.print("HTTP Response code: ");
        String response = http.getString();
        Serial.println(httpResponseCode);
        Serial.println("Server Response: " + response);

        // সার্ভার থেকে রেসপন্স (কনফিগারেশন ও অটো/ম্যানুয়াল মোড নির্দেশিকা) পার্স করে পাম্প কন্ট্রোল করা যেতে পারে
        // (সহজ রাখার জন্য ব্যাকএন্ড রেসপন্স ড্যাশবোর্ড থেকে হ্যান্ডেল করা হচ্ছে)
      } else {
        Serial.print("Error on sending POST: ");
        Serial.println(httpResponseCode);
      }
      
      http.end();
    } else {
      Serial.println("WiFi Disconnected");
    }
    
    lastTime = millis();
  }
}