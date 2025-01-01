const readAPIKeyMeasurements = 'HHKW02HETKGK3GXL'; // Clé pour lire les données du canal measurements
const readAPIKeyPatientState = 'ZLI37R69VL5QOR6J'; // Clé pour lire les données du canal patientState
const writeAPIKey = 'OC0Z7HUOG8CSJAEV'; // Clé pour écrire les données
const channelMeasurements = 2794663; // ID du canal measurements
const channelPatientState = 2798918; // ID du canal patientState
const channelConfigParameters = 2798919; // ID du canal configParameters

// Fonction pour récupérer les données
async function fetchData() {
    // Récupérer les données du canal measurements
    const measurementsUrl = `https://api.thingspeak.com/channels/${channelMeasurements}/feeds.json?api_key=${readAPIKeyMeasurements}&results=1`;
    const measurementsResponse = await fetch(measurementsUrl);
    const measurementsData = await measurementsResponse.json();

    // Récupérer les données du canal patientState
    const patientStateUrl = `https://api.thingspeak.com/channels/${channelPatientState}/feeds.json?api_key=${readAPIKeyPatientState}&results=1`;
    const patientStateResponse = await fetch(patientStateUrl);
    const patientStateData = await patientStateResponse.json();

    // Extraire les données du canal measurements
    const hrValue = measurementsData.feeds[0]?.field1 || "-";
    const spo2Value = measurementsData.feeds[0]?.field2 || "-";

    // Extraire les données du canal patientState
    const stateHR = patientStateData.feeds[0]?.field1 || "-";
    const stateSpO2 = patientStateData.feeds[0]?.field2 || "-";

    // Logique pour afficher la classe HR
    let hrClass = "Inconnu";
    const hrNumericValue = parseInt(hrValue, 10);
    if (hrNumericValue < 60) {
        hrClass = "Sinus Bradycardia";
    } else if (hrNumericValue <= 100) {
        hrClass = "Normal Sinus Rhythm";
    } else if (hrNumericValue <= 140) {
        hrClass = "Sinus Tachycardia";
    }

    // Mettre à jour les champs dans la page
    document.getElementById("hr-value").innerText = hrValue;
    document.getElementById("spo2-value").innerText = spo2Value;
    document.getElementById("state-hr-value").innerText = stateHR;
    document.getElementById("state-spo2-value").innerText = stateSpO2;
    document.getElementById("hr-class").innerText = hrClass;
}

// Fonction pour mettre à jour les paramètres
async function updateConfig() {
    const hrRef = document.getElementById("hr-ref").value;
    const spo2Ref = document.getElementById("spo2-ref").value;

    const updateUrl = `https://api.thingspeak.com/update.json`;
    const response = await fetch(updateUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `api_key=${writeAPIKey}&field1=${hrRef}&field2=${spo2Ref}`
    });

    if (response.ok) {
        alert("Configuration mise à jour !");
    } else {
        alert("Erreur lors de la mise à jour !");
    }
}

// Charger les données au démarrage
fetchData();
setInterval(fetchData, 10000); // Met à jour toutes les 10 secondes
