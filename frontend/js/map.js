// =========================================================
// STERNENWEG ROTZENWIL
// Interaktive Karte
// =========================================================


// ---------------------------------------------------------
// Karte erstellen
// ---------------------------------------------------------

// Mittelpunkt der Karte
// Diese Koordinaten sind vorerst ein Beispiel.
// Später setzen wir hier die genaue Position des Sternenwegs.
const map = L.map("map").setView([47.2, 8.3], 13);


// ---------------------------------------------------------
// OpenStreetMap als Kartenhintergrund laden
// ---------------------------------------------------------

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {

    maxZoom: 19,

    attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

}).addTo(map);


// ---------------------------------------------------------
// Test-Marker
// ---------------------------------------------------------

const testMarker = L.marker([47.2, 8.3]).addTo(map);

testMarker.bindPopup(`
    <strong>Sternenweg Rotzenwil</strong><br>
    Hier kommt später ein Posten hin.
`);
