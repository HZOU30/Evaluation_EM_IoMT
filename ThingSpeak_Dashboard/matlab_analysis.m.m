% Configuration des paramètres
channelID_1 = 2798301; % ID du canal de lecture (measurements)
channelID_2 = 2798302; % ID du canal d'écriture (patientState)
readAPIKey = '1X9KZPOVW10599E8'; % Clé API pour lire les données du canal measurements
writeAPIKey = 'E7ZM10RP1FA64OX3'; % Clé API pour écrire les données du canal patientState




HRRef = 80; % Valeur de référence HR (modifiable selon le besoin)

% Lire les 5 dernières valeurs de HR depuis ThingSpeak
numPoints = 5; % Nombre de points à lire
HR_data = thingSpeakRead(channelID_1, 'Fields', 1, 'NumPoints', numPoints, 'ReadKey', readAPIKey);

% Vérification des données lues
if isempty(HR_data)
    error('Aucune donnée disponible pour le calcul.');
end

% Calculer la moyenne des 5 dernières valeurs de HR
HR_AVG = mean(HR_data);

% Comparer HR_AVG avec HRRef et déterminer stateHR
if HR_AVG > HRRef
    stateHR = 1; % État "anormal"
else
    stateHR = 0; % État "normal"
end

% Mettre à jour l'état stateHR sur ThingSpeak
response = thingSpeakWrite(channelID_2, 'Fields', 2, 'Values', stateHR, 'WriteKey', writeAPIKey);

% Afficher les résultats
fprintf('Moyenne HR (HR_AVG) : %.2f\n', HR_AVG);
fprintf('Valeur de référence HRRef : %.2f\n', HRRef);
fprintf('État mis à jour (stateHR) : %d\n', stateHR);


