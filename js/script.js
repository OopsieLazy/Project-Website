// Shared script for every page. Loaded with defer, so the HTML is already parsed when it runs
// (no DOMContentLoaded wrapper needed, unlike projcript.js which loads without defer)

// Mobile menu (task 1.11)
// The button is hidden in the HTML and starts "expanded", so without JS the links simply stay visible.
// JS shows the button and collapses the menu; the CSS reads aria-expanded to show or hide the links.
const menuToggle = document.getElementById("menu-toggle");

if (menuToggle) {
    menuToggle.hidden = false;
    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", () => {
        // Attributes are always strings, so compare with "true", not true
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", String(!isOpen));
    });
}
