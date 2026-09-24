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
// Posten aus posten.json laden
// ---------------------------------------------------------

fetch("data/posten.json")

    .then(response => {

        if (!response.ok) {
            throw new Error("posten.json konnte nicht geladen werden.");
        }

        return response.json();

    })

    .then(posten => {

        // Gruppe für alle Marker
        const markerGroup = L.featureGroup();


        // -------------------------------------------------
        // Für jeden Posten einen Marker erstellen
        // -------------------------------------------------

        posten.forEach(punkt => {

            const marker = L.marker([
                punkt.lat,
                punkt.lng
            ]);


            // Inhalt des Popups
            marker.bindPopup(`
                <strong>Posten ${punkt.nummer}</strong><br>
                ${punkt.name}
                ${
                    punkt.beschreibung
                        ? `<br><br>${punkt.beschreibung}`
                        : ""
                }
            `);


            marker.addTo(markerGroup);

        });


        // Marker auf die Karte setzen
        markerGroup.addTo(map);


        // -------------------------------------------------
        // Karte automatisch auf alle Posten ausrichten
        // -------------------------------------------------

        map.fitBounds(
            markerGroup.getBounds(),
            {
                padding: [40, 40]
            }
        );

    })

    .catch(error => {

        console.error(
            "Fehler beim Laden der Posten:",
            error
        );

    });
