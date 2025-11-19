document.addEventListener("DOMContentLoaded", () => {
    async function loadHTML(url, elementId) {
        try {
            const response = await fetch(url);

            if (!response.ok) { throw new Error(`HTTP error! status: ${response.status} - Could not load ${url}`); }

            const html = await response.text();

            const targetElement = document.getElementById(elementId);
            if (targetElement) { targetElement.innerHTML = html; }
            else { console.warn(`Element with ID "${elementId}" not found for loading ${url}.`); }

        } catch (error) { console.error(`Error loading component from ${url}:`, error); }
    }

    loadHTML("/components/nav.html", "nav-placeholder");
    loadHTML("/components/footer.html", "footer-placeholder");
});