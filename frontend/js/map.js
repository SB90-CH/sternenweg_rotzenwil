// =========================================================
// STERNENWEG ROTZENWIL
// Interaktive Karte
// =========================================================


// ---------------------------------------------------------
// Karte erstellen
// ---------------------------------------------------------

const map = L.map("map");


// ---------------------------------------------------------
// OpenStreetMap als Kartenhintergrund
// ---------------------------------------------------------

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {

    maxZoom: 19,

    attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

}).addTo(map);


// ---------------------------------------------------------
// Posten des Sternenwegs
// ---------------------------------------------------------

const posten = [

    {
        nummer: 1,
        name: "Posten 1",
        lat: 47.5139963,
        lng: 9.2891543
    },

    {
        nummer: 2,
        name: "Posten 2",
        lat: 47.5149390,
        lng: 9.2937150
    },

    {
        nummer: 3,
        name: "Posten 3",
        lat: 47.5159114,
        lng: 9.2864308
    },

    {
        nummer: 4,
        name: "Posten 4",
        lat: 47.5186137,
        lng: 9.2847952
    },

    {
        nummer: 5,
        name: "Posten 5",
        lat: 47.5190610,
        lng: 9.2870864
    },

    {
        nummer: 6,
        name: "Posten 6",
        lat: 47.5192892,
        lng: 9.2902833
    },

    {
        nummer: 7,
        name: "Posten 7",
        lat: 47.5180887,
        lng: 9.2917702
    },

    {
        nummer: 8,
        name: "Posten 8",
        lat: 47.5162994,
        lng: 9.2934937
    },

    {
        nummer: 9,
        name: "Posten 9",
        lat: 47.5145557,
        lng: 9.2914390
    },

    {
        nummer: 10,
        name: "Posten 10",
        lat: 47.5149345,
        lng: 9.2962445
    }

];


// ---------------------------------------------------------
// Marker erstellen
// ---------------------------------------------------------

const markerGroup = L.featureGroup();

posten.forEach(posten => {

    const marker = L.marker([
        posten.lat,
        posten.lng
    ]);

    marker.bindPopup(`
        <strong>${posten.name}</strong>
        <br>
        Sternenweg Rotzenwil
    `);

    marker.addTo(markerGroup);

});


// Marker-Gruppe zur Karte hinzufügen
markerGroup.addTo(map);


// ---------------------------------------------------------
// Karte automatisch auf alle Posten ausrichten
// ---------------------------------------------------------

map.fitBounds(
    markerGroup.getBounds(),
    {
        padding: [40, 40]
    }
);
