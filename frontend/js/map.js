// =========================================================
// STERNENWEG ROTZENWIL
// Interaktive Karte
// =========================================================


// Karte erstellen
const map = L.map("map");


// OpenStreetMap laden
L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        maxZoom: 19,
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }
).addTo(map);


// Posten laden
fetch("data/posten.json")
    .then(response => {

        if (!response.ok) {
            throw new Error("posten.json konnte nicht geladen werden.");
        }

        return response.json();
    })

    .then(posten => {

        const markerGroup = L.featureGroup();

        posten.forEach(punkt => {

            // Eigenen nummerierten Marker erzeugen
            const postenIcon = L.divIcon({
                className: "posten-marker-wrapper",

                html: `
                    <div class="posten-marker">
                        ${punkt.nummer}
                    </div>
                `,

                iconSize: [48, 48],
                iconAnchor: [24, 24],
                popupAnchor: [0, -24]
});


            // Marker erstellen
            const marker = L.marker(
                [punkt.lat, punkt.lng],
                {
                    icon: postenIcon
                }
            );


            // Popup
            marker.bindPopup(`
                <strong>Posten ${punkt.nummer}</strong>
                <br>
                ${punkt.name}

                ${
                    punkt.beschreibung
                        ? `<br><br>${punkt.beschreibung}`
                        : ""
                }
            `);


            marker.addTo(markerGroup);

        });


        // Marker anzeigen
        markerGroup.addTo(map);


        // Kartenausschnitt automatisch bestimmen
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
