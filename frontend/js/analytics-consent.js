/* Google Analytics 4: erst nach ausdrücklicher Zustimmung laden. */
(function () {
    "use strict";
    const KEY = "sternenweg_analytics_consent";
    const MEASUREMENT_ID = "G-C0XRWGZ5GJ";
    let loaded = false;

    function getChoice() {
        try { return localStorage.getItem(KEY); } catch (_) { return null; }
    }
    function saveChoice(choice) {
        try { localStorage.setItem(KEY, choice); } catch (_) { /* Browser blockiert Speicher */ }
    }
    function loadAnalytics() {
        if (loaded) return;
        loaded = true;
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { window.dataLayer.push(arguments); };
        window.gtag("consent", "default", {
            analytics_storage: "granted",
            ad_storage: "denied",
            ad_user_data: "denied",
            ad_personalization: "denied"
        });
        window.gtag("js", new Date());
        window.gtag("config", MEASUREMENT_ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
        const script = document.createElement("script");
        script.async = true;
        script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(MEASUREMENT_ID);
        document.head.appendChild(script);
    }
    function clearAnalyticsCookies() {
        const host = window.location.hostname;
        const domains = ["", host, "." + host, ".sternenweg-rotzenwil.ch"];
        document.cookie.split(";").forEach(function (part) {
            const name = part.split("=")[0].trim();
            if (!/^(_ga|_gid|_gat)(_|$)/.test(name)) return;
            domains.forEach(function (domain) {
                document.cookie = name + "=; Max-Age=0; path=/; SameSite=Lax" + (domain ? "; domain=" + domain : "");
            });
        });
    }
    document.addEventListener("DOMContentLoaded", function () {
        const banner = document.getElementById("analytics-consent-banner");
        const settings = document.querySelectorAll("[data-analytics-settings]");
        const accept = document.getElementById("analytics-accept");
        const decline = document.getElementById("analytics-decline");
        if (!banner || !accept || !decline) return;
        function showBanner() { banner.hidden = false; }
        function hideBanner() { banner.hidden = true; }
        function choose(choice) {
            saveChoice(choice);
            hideBanner();
            if (choice === "accepted") {
                loadAnalytics();
            } else {
                if (typeof window.gtag === "function") {
                    window.gtag("consent", "update", { analytics_storage: "denied" });
                }
                clearAnalyticsCookies();
                if (loaded) window.location.reload();
            }
        }
        accept.addEventListener("click", function () { choose("accepted"); });
        decline.addEventListener("click", function () { choose("declined"); });
        settings.forEach(function (button) {
            button.addEventListener("click", showBanner);
        });
        if (getChoice() === "accepted") loadAnalytics();
        else if (getChoice() !== "declined") showBanner();
    });
})();
