document.addEventListener("DOMContentLoaded", function () {
    const banner = document.getElementById("cookie-banner");
    const settingsPanel = document.getElementById("cookie-settings");
    const acceptAllBtn = document.getElementById("accept-all");
    const rejectAllBtn = document.getElementById("reject-all");
    const openSettingsBtn = document.getElementById("open-settings");
    const saveSettingsBtn = document.getElementById("save-settings");
    const statCookies = document.getElementById("statistic-cookies");
    const markCookies = document.getElementById("marketing-cookies");
    const persCookies = document.getElementById("personalization-cookies");
    const reopenSettingsBtn = document.getElementById("open-cookie-settings");

    // Sicherstellen, dass alle Elemente existieren, bevor Event-Listener hinzugefügt werden
    if (!banner || !settingsPanel || !acceptAllBtn || !rejectAllBtn || !openSettingsBtn || !saveSettingsBtn || !statCookies || !markCookies || !persCookies || !reopenSettingsBtn) {
        console.error("Ein oder mehrere Cookie-Banner-Elemente fehlen im DOM.");
        return;
    }

    function getCookiePreferences() {
        return JSON.parse(localStorage.getItem("cookiePreferences")) || {};
    }

    function savePreferences(preferences) {
        localStorage.setItem("cookiePreferences", JSON.stringify(preferences));
    }

    function applyPreferences(preferences) {
        // Marketing-Cookies (Elfsight Instagram Feed)
        if (preferences.marketing) {
            loadElfsightWidget();
        } else {
            removeElfsightWidget();
        }

        // Personalisierungs-Cookies (Google Maps und Google Fonts)
        if (preferences.personalization) {
            loadGoogleMaps();
            loadGoogleFonts();
        } else {
            removeGoogleMaps();
            removeGoogleFonts();
        }
    }

    function loadElfsightWidget() {
        if (!document.querySelector("script[data-elfsight]")) {
            const script = document.createElement("script");
            script.src = "https://static.elfsight.com/platform/platform.js";
            script.async = true;
            script.setAttribute("data-elfsight", "true");
            document.body.appendChild(script);
        }

        const elfsightContainer = document.getElementById("elfsight-instagram-feed");
        if (elfsightContainer && !document.querySelector(".elfsight-app-f649909e-7e22-45c9-a586-99922b2c8126")) {
            const div = document.createElement("div");
            div.className = "elfsight-app-f649909e-7e22-45c9-a586-99922b2c8126";
            div.setAttribute("data-elfsight-app-lazy", "");
            elfsightContainer.appendChild(div);
        }
    }

    function removeElfsightWidget() {
        document.querySelectorAll(".elfsight-app-f649909e-7e22-45c9-a586-99922b2c8126").forEach(el => el.remove());
        document.querySelectorAll("script[data-elfsight]").forEach(el => el.remove());
    }

    function loadGoogleMaps() {
        const mapContainer = document.querySelector(".map-container");
        if (mapContainer && !document.querySelector("iframe[data-maps]")) {
            const iframe = document.createElement("iframe");
            iframe.src = "https://www.google.com/maps/embed/v1/place?q=Johannespl.+12,+77815+Bühl&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8";
            iframe.width = "100%";
            iframe.height = "200";
            iframe.frameBorder = "0";
            iframe.style.border = "0";
            iframe.allowFullscreen = "";
            iframe.setAttribute("aria-hidden", "false");
            iframe.setAttribute("tabindex", "0");
            iframe.setAttribute("data-maps", "true");
            mapContainer.appendChild(iframe);
        }
    }

    function removeGoogleMaps() {
        document.querySelectorAll("iframe[data-maps]").forEach(el => el.remove());
    }

    function loadGoogleFonts() {
        if (!document.querySelector("link[data-fonts]")) {
            const link = document.createElement("link");
            link.href = "https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@700&display=swap";
            link.rel = "stylesheet";
            link.setAttribute("data-fonts", "true");
            document.head.appendChild(link);
        }
    }

    function removeGoogleFonts() {
        document.querySelectorAll("link[data-fonts]").forEach(el => el.remove());
    }

    function updateCheckboxState() {
        const savedPreferences = getCookiePreferences();
        statCookies.checked = savedPreferences.statistic || false;
        markCookies.checked = savedPreferences.marketing || false;
        persCookies.checked = savedPreferences.personalization || false;
    }

    // Prüfe, ob Präferenzen existieren
    const savedPreferences = getCookiePreferences();

    // Wenn keine Präferenzen gespeichert sind (Erstbesuch), Banner anzeigen
    if (Object.keys(savedPreferences).length === 0) {
        banner.style.display = "flex";
        updateCheckboxState();
    } else {
        // Wenn Präferenzen existieren, Banner ausblenden und Präferenzen anwenden
        banner.style.display = "none";
        applyPreferences(savedPreferences);
        updateCheckboxState();
    }

    acceptAllBtn.addEventListener("click", () => {
        const preferences = { statistic: true, marketing: true, personalization: true };
        savePreferences(preferences);
        banner.style.display = "none";
        updateCheckboxState();
        location.reload();
    });

    rejectAllBtn.addEventListener("click", () => {
        const preferences = { statistic: false, marketing: false, personalization: false };
        savePreferences(preferences);
        banner.style.display = "none";
        updateCheckboxState();
        location.reload();
    });

    openSettingsBtn.addEventListener("click", () => {
        settingsPanel.style.display = "block";
        updateCheckboxState();
    });

    reopenSettingsBtn.addEventListener("click", () => {
        banner.style.display = "flex";
        settingsPanel.style.display = "block";
        updateCheckboxState();
    });

    saveSettingsBtn.addEventListener("click", () => {
        const preferences = {
            statistic: statCookies.checked,
            marketing: markCookies.checked,
            personalization: persCookies.checked
        };
        savePreferences(preferences);
        settingsPanel.style.display = "none";
        banner.style.display = "none";
        location.reload();
    });
});