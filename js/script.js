// Shared script for every page. Loaded with defer, so the HTML is already parsed when it runs
// (no DOMContentLoaded wrapper needed, unlike projcript.js which loads without defer)

// Show/hide buttons in the header: the Menu button and the Lab ▸ button
// Each button is hidden in the HTML and starts "expanded", so without JS everything stays visible.
// JS shows the button and collapses its content; the CSS reads aria-expanded to show or hide it.
// One function for both buttons, so a fix or change happens in one place (DRY)
function setupToggle(button) {
    button.hidden = false;
    button.setAttribute("aria-expanded", "false");

    button.addEventListener("click", () => {
        // Attributes are always strings, so compare with "true", not true
        const isOpen = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", String(!isOpen));
    });
}

document.querySelectorAll(".menu-toggle, .submenu-toggle").forEach(setupToggle);
