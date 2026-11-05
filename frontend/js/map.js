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
                        <span class="posten-marker-nummer">${punkt.nummer}</span>
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
                    icon: postenIcon,
                    interactive: false,
                    keyboard: false
                }
            );


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


// Parkplätze separat laden und mit blauen P-Markern anzeigen.
// Ein optionaler "link" in parkplaetze.json führt zu weiteren Informationen.
fetch("data/parkplaetze.json")
    .then(response => {
        if (!response.ok) throw new Error("parkplaetze.json konnte nicht geladen werden.");
        return response.json();
    })
    .then(parkplaetze => {
        const parkplatzGroup = L.featureGroup();
        parkplaetze.forEach(parkplatz => {
            if (!Number.isFinite(parkplatz.lat) || !Number.isFinite(parkplatz.lng)) return;

            const icon = L.divIcon({
                className: "parkplatz-marker-wrapper",
                html: '<div class="parkplatz-marker" aria-hidden="true">P</div>',
                iconSize: [42, 42],
                iconAnchor: [21, 21],
                popupAnchor: [0, -21]
            });

            const marker = L.marker([parkplatz.lat, parkplatz.lng], {
                icon,
                title: parkplatz.name || "Parkplatz",
                alt: "Parkplatz"
            });

            const popup = document.createElement("div");
            popup.className = "parkplatz-popup";
            const heading = document.createElement("strong");
            heading.textContent = parkplatz.name || "Parkplatz";
            popup.appendChild(heading);

            if (parkplatz.beschreibung) {
                const description = document.createElement("p");
                description.textContent = parkplatz.beschreibung;
                popup.appendChild(description);
            }

            // Nur sichere Weblinks erlauben; solange kein Link hinterlegt ist,
            // kann der Parkplatz über einen OpenStreetMap-Link geöffnet werden.
            let destination = "";
            if (parkplatz.link) {
                try {
                    const url = new URL(parkplatz.link, window.location.href);
                    if (url.protocol === "https:" || url.protocol === "http:") {
                        destination = url.href;
                    }
                } catch (error) {
                    console.warn("Ungültiger Parkplatz-Link:", parkplatz.id);
                }
            }
            if (!destination) {
                destination = `https://www.openstreetmap.org/?mlat=${parkplatz.lat}&mlon=${parkplatz.lng}#map=18/${parkplatz.lat}/${parkplatz.lng}`;
            }

            const link = document.createElement("a");
            link.href = destination;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = parkplatz.link ? "Weitere Informationen →" : "Standort ansehen →";
            popup.appendChild(link);

            marker.bindPopup(popup);
            marker.addTo(parkplatzGroup);
        });
        parkplatzGroup.addTo(map);
        // Kartenausschnitt umfasst auch weiter entfernte Parkplätze.
        if (parkplatzGroup.getLayers().length) {
            const combinedBounds = L.latLngBounds(parkplatzGroup.getBounds());
            map.eachLayer(layer => {
                if (layer instanceof L.Marker && !parkplatzGroup.hasLayer(layer)) {
                    combinedBounds.extend(layer.getLatLng());
                }
            });
            map.fitBounds(combinedBounds, { padding: [40, 40] });
        }
    })
    .catch(error => console.error("Fehler beim Laden der Parkplätze:", error));
