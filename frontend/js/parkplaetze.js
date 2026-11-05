// Parkplätze aus derselben Datenquelle wie die interaktive Karte laden.
document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("parkplatz-liste");
    if (!container) return;

    try {
        const response = await fetch("data/parkplaetze.json");
        if (!response.ok) throw new Error("Parkplätze konnten nicht geladen werden.");
        const parkplaetze = await response.json();
        container.replaceChildren();

        if (!Array.isArray(parkplaetze) || parkplaetze.length === 0) {
            container.textContent = "Aktuell sind keine Parkplätze erfasst.";
            return;
        }

        parkplaetze.forEach((parkplatz, index) => {
            if (!Number.isFinite(parkplatz.lat) || !Number.isFinite(parkplatz.lng)) return;
            const card = document.createElement("article");
            card.className = "parking-card";
            if (/^parkplatz-[1-6]$/.test(parkplatz.id)) card.id = parkplatz.id;

            const symbol = document.createElement("span");
            symbol.className = "parking-symbol";
            symbol.textContent = "P";
            symbol.setAttribute("aria-hidden", "true");

            const title = document.createElement("h3");
            title.textContent = parkplatz.name && parkplatz.name !== "Parkplatz"
                ? parkplatz.name : `Parkplatz ${index + 1}`;

            const capacity = document.createElement("p");
            capacity.className = "parking-capacity";
            capacity.textContent = `${parkplatz.anzahl_plaetze} ${parkplatz.anzahl_plaetze === 1 ? "Stellplatz" : "Stellplätze"}`;

            const description = document.createElement("p");
            description.textContent = parkplatz.beschreibung || "";

            let url = `https://www.openstreetmap.org/?mlat=${parkplatz.lat}&mlon=${parkplatz.lng}#map=18/${parkplatz.lat}/${parkplatz.lng}`;
            if (parkplatz.link) {
                try {
                    const candidate = new URL(parkplatz.link, window.location.href);
                    if (["http:", "https:"].includes(candidate.protocol)) url = candidate.href;
                } catch (error) {
                    console.warn("Ungültiger Parkplatz-Link", parkplatz.id);
                }
            }

            const link = document.createElement("a");
            link.href = url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = parkplatz.link ? "Weitere Informationen →" : "Standort ansehen →";

            card.append(symbol, title, capacity);
            if (parkplatz.beschreibung) card.appendChild(description);
            card.appendChild(link);
            container.appendChild(card);
        });

        // Direkte Links von den Kartenmarkern zur passenden Parkplatzkarte.
        if (location.hash) {
            const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
            if (target) target.scrollIntoView({ block: "start" });
        }
    } catch (error) {
        console.error(error);
        container.textContent = "Die Parkplätze konnten leider nicht geladen werden.";
    }
});
