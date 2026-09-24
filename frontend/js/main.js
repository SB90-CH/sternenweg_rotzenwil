// =========================================================
// STERNENWEG ROTZENWIL
// Allgemeine Funktionen der Website
// =========================================================


// ---------------------------------------------------------
// Aktuelles Jahr im Footer anzeigen
// ---------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {

    const yearElement = document.getElementById("year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

});


// ---------------------------------------------------------
// Navigation: Links innerhalb der Seite
// ---------------------------------------------------------

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function (event) {

        const targetId = this.getAttribute("href");

        if (targetId === "#") {
            return;
        }

        const target = document.querySelector(targetId);

        if (target) {
            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth"
            });
        }

    });

});
