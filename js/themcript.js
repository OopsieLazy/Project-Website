// Theme picker: the paper lantern hanging from the header (task 1.14)
// Loaded in <head> WITHOUT defer on purpose: part 1 must run before the page is drawn,
// or a visitor who picked a night theme would see a white flash first.
// It's an external file, not inline, so a strict Content Security Policy won't need a hash for it later

// The picker loops through these, back to the start after the last one
// "auto" = no choice: the CSS follows the visitor's OS setting (Day or Lantern)
const THEMES = ["auto", "day", "lantern", "moss"];
const THEME_NAMES = {
    auto: { kanji: "自動", name: "Auto" },
    day: { kanji: "昼", name: "Day" },
    lantern: { kanji: "提灯", name: "Lantern" },
    moss: { kanji: "苔", name: "Moss" },
};
const STORAGE_KEY = "theme";

// localStorage can throw (private mode, blocked storage), so every use is wrapped in try/catch.
// Anyone can edit storage in DevTools, so only an exact known name is trusted; anything else means "auto"
function readSavedTheme() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return THEMES.includes(saved) ? saved : "auto";
    } catch {
        return "auto";
    }
}

// "auto" is the ABSENCE of a choice, so it removes the attribute and the saved value
// instead of storing "auto". Then the CSS's light-dark() follows the OS live, with no JS
function applyTheme(theme) {
    if (theme === "auto") {
        delete document.documentElement.dataset.theme;   // removes data-theme from <html>
    } else {
        document.documentElement.dataset.theme = theme;  // sets <html data-theme="moss">
    }
}

function saveTheme(theme) {
    try {
        if (theme === "auto") {
            localStorage.removeItem(STORAGE_KEY);
        } else {
            localStorage.setItem(STORAGE_KEY, theme);
        }
    } catch {
        // Storage blocked: the theme still changes, it just isn't remembered
    }
}

// Part 1: runs right now, while <head> is still loading
applyTheme(readSavedTheme());

// Part 2: the button doesn't exist yet (the <body> hasn't been read), so wait for it
document.addEventListener("DOMContentLoaded", () => {
    const button = document.querySelector(".theme-lantern");
    if (!button) return;   // a page without the lantern (e.g. thelab.html) still gets part 1

    const kanji = button.querySelector(".theme-kanji");
    const name = button.querySelector(".theme-name");
    let current = readSavedTheme();

    // textContent, never innerHTML: it can only ever insert plain text (no XSS)
    function showName() {
        kanji.textContent = THEME_NAMES[current].kanji;
        name.textContent = THEME_NAMES[current].name;
    }

    button.addEventListener("click", () => {
        // % (remainder) wraps the index: after the last theme, 4 % 4 = 0, back to "auto"
        current = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
        applyTheme(current);
        saveTheme(current);
        showName();

        // Replay the sway animation, even on quick repeat clicks: remove the class,
        // read offsetWidth (forces the browser to notice the removal), then add it back
        button.classList.remove("is-tugged");
        void button.offsetWidth;
        button.classList.add("is-tugged");
    });

    showName();
    button.hidden = false;   // no JS = no lantern, and the site simply follows the OS
});
