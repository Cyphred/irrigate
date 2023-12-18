#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>

#define RELAY_PIN 2
#define ECHO_PIN 3
#define TRIG_PIN 4
#define FLOW_PIN 5

// Configure WiFi here
const int deviceId = 1;
const char *ssid = "";
const char *password = "";
const char *server = "";

bool relayOn = false;
int distance = 0;

// For the flow sensor
volatile int NumPulses;        // variable for the number of pulses received
int PinSensor = FLOW_PIN;      // Sensor connected to pin 2
float factor_conversion = 7.5; // to convert from frequency to flow rate
float volume = 0;
long dt = 0; // time variation for each loop
long t0 = 0; // millis() from the previous loop

unsigned long lastTime = 0;      // Last successful request
unsigned long timerDelay = 1000; // Delay between each request

void PulseCount() {
  NumPulses++; // increment the pulse variable
}

int GetFrequency() {
  int frequency;
  NumPulses = 0;         // We set the number of pulses to 0
  interrupts();          // We enable the interruptions
  delay(1000);           // sample for 1 second
  noInterrupts();        // We disable the interruptions
  frequency = NumPulses; // Hz(pulses per second)
  return frequency;
}

void setup() {
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(FLOW_PIN, INPUT);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(FLOW_PIN, INPUT);

  attachInterrupt(0, PulseCount, RISING);
  t0 = millis();

  // Make sure to turn the relay off on startup
  setRelay(false);

  Serial.begin(115200);

  // Connect to WiFi
  WiFi.begin(ssid, password);

  // while wifi not connected yet, print '.'
  // then after it connected, get out of the loop
  Serial.print("Connecting to ");
  Serial.print(ssid);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  // print a new line, then print WiFi connected and the IP address
  Serial.println();
  Serial.print("Connected using IP ");
  Serial.println(WiFi.localIP());
}

void loop() {
  distance = getDistance();
  float frequency = GetFrequency();
  float flow_L_m = frequency / factor_conversion;
  dt = millis() - t0;
  t0 = millis();
  volume = volume + (flow_L_m / 60) * (dt / 1000);

  // Check if it's time to send another request
  if ((millis() - lastTime) > timerDelay) {
    if (WiFi.status() == WL_CONNECTED) {
      WiFiClient client;
      HTTPClient http;

      http.begin(client, server);

      http.addHeader("Content-Type", "application/json");
      String httpRequestBody = "{\"id\":" + String(deviceId) +
                               ",\"distance\":" + String(distance) +
                               ",\"gateOpen\":" + String(relayOn) +
                               ",\"flowRate\":" + String(flow_L_m) +
                               ",\"volume\":" + String(volume) + "}";

      // Send the request
      int responseCode = http.POST(httpRequestBody);

      // Record the time if sent successfully
      // 200 corresponds to the gate being off
      if (responseCode == 200) {
        lastTime = millis();
        setRelay(false);
      }
      // 201 corresponds to the gate being on
      else if (responseCode == 201) {
        lastTime = millis();
        setRelay(true);
      }
    }
  }
}

void setRelay(bool state) {
  if (state)
    digitalWrite(RELAY_PIN, LOW);
  else
    digitalWrite(RELAY_PIN, HIGH);

  relayOn = state;
}

float getDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  float delay = pulseIn(ECHO_PIN, HIGH);
  float distance = (delay * 0.343) / 2;
  return distance;
}