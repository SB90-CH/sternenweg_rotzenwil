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
            throw new Error(
                "posten.json konnte nicht geladen werden."
            );
        }

        return response.json();

    })

    .then(posten => {

        // Gruppe für alle Marker erstellen
        const markerGroup = L.featureGroup();


        // Für jeden Posten einen Marker erstellen
        posten.forEach(punkt => {

            // Nummerierten Marker erzeugen
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


            // Popup erstellen
            marker.bindPopup(`
                <a
                    href="#posten-${punkt.nummer}"
                    class="posten-popup-link"
                >
                    <strong>
                        Posten ${punkt.nummer}
                    </strong>

                    <span>
                        ${punkt.name}
                    </span>

                    <small>
                        Zum Posten →
                    </small>
                </a>
            `);


            // Marker zur Gruppe hinzufügen
            marker.addTo(markerGroup);

        });


        // Alle Marker auf der Karte anzeigen
        markerGroup.addTo(map);


        // Kartenausschnitt automatisch so einstellen,
        // dass alle Marker sichtbar sind
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
