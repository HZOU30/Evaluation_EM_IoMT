const readAPIKey = '1X9KZPOVW10599E8'; // Clé pour lire les données
const writeAPIKey = 'OC0Z7HUOG8CSJAEV'; // Clé pour écrire les données
const channelMeasurements = 2794663; // ID du canal measurements
const channelPatientState = 2798918; // ID du canal patientState
const channelConfigParameters = 2798919; // ID du canal configParameters

// Fonction pour récupérer les données
async function fetchData() {
    const measurementsUrl = `https://api.thingspeak.com/channels/${channelMeasurements}/fields/1.json?api_key=${readAPIKey}`;
    const response = await fetch(measurementsUrl);
    const data = await response.json();

    // Mettre à jour les champs dans la page
    document.getElementById("hr-value").innerText = data.feeds[0]?.field1 || "-";
    document.getElementById("spo2-value").innerText = data.feeds[0]?.field2 || "-";

    // Logique pour afficher la classe HR
    const hrValue = parseInt(data.feeds[0]?.field1 || "0");
    let hrClass = "Inconnu";
    if (hrValue < 60) hrClass = "Sinus Bradycardia";
    else if (hrValue <= 100) hrClass = "Normal Sinus Rhythm";
    else hrClass = "Sinus Tachycardia";

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
setInterval(fetchData, 15000); // Met à jour toutes les 15 secondes
