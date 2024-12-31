# ESP32 Implementation

## Description
Cette partie contient le code pour la simulation ESP32 dans l'environnement Wokwi. Elle permet :
- D'envoyer les mesures HR et SpO2 vers le canal ThingSpeak `measurements`.
- De lire les valeurs des états (`stateHR` et `stateSpO2`) depuis le canal `patientState`.

## Fichiers
- `esp32_code.ino` : Code Arduino pour l'ESP32.

## Instructions
1. Ouvrez le fichier `ESP32_simulator.cpp` dans l'IDE Arduino.
2. Configurez les clés API et les IDs de canaux dans le code.
3. Simulez le code sur [Wokwi](https://wokwi.com/).
