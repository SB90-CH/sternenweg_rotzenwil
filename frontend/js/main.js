// =========================================================
// STERNENWEG ROTZENWIL
// Allgemeine Funktionen der Website
// =========================================================


document.addEventListener("DOMContentLoaded", () => {

    // -----------------------------------------------------
    // Aktuelles Jahr im Footer
    // -----------------------------------------------------

    const yearElement = document.getElementById("year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    // -----------------------------------------------------
    // Posten aus posten.json laden
    // -----------------------------------------------------

    const postenContainer =
        document.getElementById("posten-container");

    if (postenContainer) {

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

                // Vorhandenen Inhalt entfernen
                postenContainer.innerHTML = "";


                // Für jeden Posten eine Karte erstellen
                posten.forEach(punkt => {

                    const postenCard =
                        document.createElement("article");

                    postenCard.className = "posten-card";

                    postenCard.id =
                        `posten-${punkt.nummer}`;


                    // Bildpfad automatisch aus der
                    // Postennummer erstellen
                    const bildPfad =
                        `images/posten/posten-${punkt.nummer}.jpg`;


                    postenCard.innerHTML = `

                        <img
                            src="${bildPfad}"
                            alt="${punkt.name}"
                            class="posten-bild"
                        >

                        <div class="posten-inhalt">

                            <span class="posten-nummer">
                                Posten ${punkt.nummer}
                            </span>

                            <h3>
                                ${punkt.name}
                            </h3>

                            ${
                                punkt.beschreibung
                                    ? `<p>${punkt.beschreibung}</p>`
                                    : `<p>Weitere Informationen folgen.</p>`
                            }

                        </div>
                    `;


                    // Karte zur Seite hinzufügen
                    postenContainer.appendChild(
                        postenCard
                    );


                    // -------------------------------------------------
                    // Falls kein Bild existiert:
                    // Bild automatisch ausblenden
                    // -------------------------------------------------

                    const bild =
                        postenCard.querySelector(".posten-bild");

                    bild.addEventListener("error", () => {
                        bild.remove();
                    });

                });

            })

            .catch(error => {

                console.error(
                    "Fehler beim Laden der Posten:",
                    error
                );

                postenContainer.innerHTML = `
                    <p>
                        Die Posten konnten leider nicht
                        geladen werden.
                    </p>
                `;

            });

    }

});


// =========================================================
// Navigation innerhalb der Seite
// =========================================================

document
    .querySelectorAll('a[href^="#"]')
    .forEach(link => {

        link.addEventListener(
            "click",
            function (event) {

                const targetId =
                    this.getAttribute("href");

                if (targetId === "#") {
                    return;
                }

                const target =
                    document.querySelector(targetId);

                if (target) {

                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth"
                    });

                }

            }
        );

    });
