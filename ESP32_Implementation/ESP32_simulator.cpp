#include <WiFi.h>
#include <HTTPClient.h>

// Configuration Wi-Fi (Wokwi simule une connexion réseau)
const char* ssid = "Wokwi-GUEST"; // Réseau simulé par Wokwi
const char* password = ""; // Pas de mot de passe pour le réseau Wokwi-GUEST

// Configuration ThingSpeak
const char* writeAPIKey = "ID52JN5XCDN3CMYF"; // Clé API pour écrire dans measurements
const char* readAPIKey = "8EQQ78NW401MZTXA";  // Clé API pour lire depuis patientState
const char* server = "http://api.thingspeak.com";

// IDs des canaux
const int channelID_measurements = 2798301;
const int channelID_patientState = 2798302;

// Variables pour les données
float HR = 75.0; // Exemple de valeur HR (peut être simulée ou mesurée)
float SpO2 = 98.0; // Exemple de valeur SpO2 (peut être simulée ou mesurée)

void setup() {
  // Initialisation série
  Serial.begin(115200);
  delay(1000);

  // Connexion Wi-Fi
  Serial.print("Connexion au WiFi");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nConnecté au WiFi !");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    // 1. Envoyer les mesures HR et SpO2 vers measurements
    sendDataToThingSpeak(HR, SpO2);

    // 2. Lire l'état depuis patientState et afficher dans Serial Monitor
    readPatientState();

    // Générer de nouvelles données pour simuler des capteurs
    simulateSensorData();

    // Attendre 15 secondes avant le prochain envoi
    delay(15000);
  } else {
    Serial.println("WiFi non connecté !");
  }
}

// Fonction pour envoyer les données vers ThingSpeak
void sendDataToThingSpeak(float heartRate, float spo2) {
  HTTPClient http;
  String url = String(server) + "/update?api_key=" + writeAPIKey +
               "&field1=" + String(heartRate) + "&field2=" + String(spo2);
  http.begin(url);
  int httpResponseCode = http.GET();

  if (httpResponseCode > 0) {
    Serial.println("Données envoyées avec succès !");
  } else {
    Serial.println("Erreur lors de l'envoi des données : " + String(httpResponseCode));
  }
  http.end();
}

// Fonction pour lire l'état depuis ThingSpeak
void readPatientState() {
  HTTPClient http;
  String url = String(server) + "/channels/" + String(channelID_patientState) +
               "/feeds.json?api_key=" + readAPIKey + "&results=1";
  http.begin(url);
  int httpResponseCode = http.GET();

  if (httpResponseCode > 0) {
    String payload = http.getString();
    Serial.println("État reçu : " + payload);
  } else {
    Serial.println("Erreur lors de la lecture des données : " + String(httpResponseCode));
  }
  http.end();
}

// Simuler des données aléatoires pour les capteurs
void simulateSensorData() {
  HR = random(60, 100); // Générer des valeurs aléatoires entre 60 et 100 pour HR
  SpO2 = random(90, 100); // Générer des valeurs aléatoires entre 90 et 100 pour SpO2
  Serial.print("HR simulé : ");
  Serial.println(HR);
  Serial.print("SpO2 simulé : ");
  Serial.println(SpO2);
}