// Code page (R3, D40): builds the Featured row and the catalog, all flip cards, from data/code.json.
// Each project is typed once in the JSON; this script turns it into HTML.
// Loaded with `defer`, so the page's HTML is already parsed when this runs.
// fetchJson(), make() and joinMeta() come from js/datacript.js, which loads first.

const CODE_URL = "data/code.json";

// The words for each status. An unknown status in the JSON falls back to "archived"
const STATUS_WORDS = { live: "Live", wip: "In progress", archived: "Archived" };

// The catalog number is worked out from the project's place in the JSON, never typed:
// reorder the file and every number follows. 0 -> "No. 001"
const catalogNumber = (index) => `No. ${String(index + 1).padStart(3, "0")}`;

/* ---------- Small parts every card shares ---------- */

// The dot is drawn by CSS (codyles.css); the hidden text gives screen readers the word
function statusDot(status) {
    const key = STATUS_WORDS[status] ? status : "archived";
    const word = STATUS_WORDS[key];
    const dot = make("span", `ic-status is-${key}`,
        make("span", "screen-reader-text", `Status: ${word.toLowerCase()}`));
    dot.title = word;                  // a tooltip for mouse users
    return dot;
}

// "No. 004 · 2026" on the left, the status dot on the right
function metaLine(project, number, withYear) {
    const label = make("span", "ic-no", withYear ? joinMeta([number, project.year]) : number);
    if (project.handWritten) label.append(make("span", "ic-stamp", "Hand-written"));
    return make("p", "ic-meta", label, " ", statusDot(project.status));
}

function toolChips(tools = []) {
    const list = make("ul", "ic-chips", ...tools.map((tool) => make("li", "", tool)));
    list.setAttribute("role", "list"); // list-style: none makes Safari drop the list meaning
    list.setAttribute("aria-label", "Built with");
    return list;
}

// SECURITY: an href can run code ("javascript:…"), so only a plain https:// address
// from the JSON becomes a link. A private repo (source: null) gets a note, not a 404 link
function sourceLink(project) {
    if (typeof project.source === "string" && project.source.startsWith("https://")) {
        const link = make("a", "", "Source");
        link.href = project.source;
        return link;
    }
    return make("span", "ic-private", "Private repo");
}

/* ---------- The full entry: the back of every flip card ---------- */

function fullCard(project, number) {
    return make("article", "index-card",
        metaLine(project, number, true),
        make("h3", "ic-title", project.title),
        make("p", "ic-desc", project.description || project.blurb || ""),
        toolChips(project.tools),
        make("p", "ic-links", sourceLink(project))
    );
}

/* ---------- Flip card: front (title + one line) and back (the full entry) ---------- */

function flipCard(project, number) {
    const backId = `code-${project.id}`;

    // The title is the button (see .flip-open in codyles.css). aria-expanded tells a
    // screen reader whether the card is open; aria-controls says which part it opens
    const open = make("button", "flip-open", project.title);
    open.type = "button";
    open.setAttribute("aria-expanded", "false");
    open.setAttribute("aria-controls", backId);

    const hint = make("span", "flip-hint", "Flip ↻");
    hint.setAttribute("aria-hidden", "true"); // decoration: the button already says what it does

    const front = make("article", "index-card flip-face flip-front",
        metaLine(project, number, false),
        make("h3", "ic-title", open),
        make("p", "ic-desc", project.blurb || ""),
        hint
    );

    const close = make("button", "flip-close", "Flip back");
    close.type = "button";

    const back = fullCard(project, number);
    back.classList.add("flip-face", "flip-back");
    back.id = backId;
    back.querySelector(".ic-links").append(close);
    back.querySelector(".ic-title").tabIndex = -1; // focusable by script only (not by Tab)
    // `inert` removes a whole subtree from Tab and from screen readers.
    // The back starts turned away, so it starts inert
    back.inert = true;

    return make("li", "flip-item", make("div", "flip-inner", front, back));
}

/* ---------- Opening and closing ---------- */

let openItem = null; // only one card is open at a time, so the grid stays tidy
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function setOpen(item, isOpen) {
    const front = item.querySelector(".flip-front");
    const back = item.querySelector(".flip-back");
    const button = item.querySelector(".flip-open");

    item.classList.toggle("is-open", isOpen); // the CSS turns and widens the card
    button.setAttribute("aria-expanded", String(isOpen));
    front.inert = isOpen;                      // the hidden face can't be tabbed into
    back.inert = !isOpen;
    openItem = isOpen ? item : null;

    // Focus follows the card. Without this, focus would stay on the now-inert front
    // and a keyboard user would be lost. preventScroll: we scroll just once, below
    if (isOpen) {
        back.querySelector(".ic-title").focus({ preventScroll: true });
    } else {
        button.focus({ preventScroll: true });
    }
    // The open card may have moved (it spans two columns now): keep it on screen
    item.scrollIntoView({ block: "nearest", behavior: reduceMotion.matches ? "auto" : "smooth" });
}

// EVENT DELEGATION: one listener on the whole list instead of two per card.
// A click anywhere bubbles up to the <ul>; closest() finds what was hit.
// It also keeps working for cards added later
function wireCatalog(list) {
    list.addEventListener("click", (event) => {
        const item = event.target.closest(".flip-item");
        if (!item) return;
        if (event.target.closest(".flip-open")) {
            // The front (its title button covers the whole card): turn it over
            if (openItem && openItem !== item) setOpen(openItem, false);
            setOpen(item, true);
        } else if (item.classList.contains("is-open") && !event.target.closest("a")) {
            // Anywhere on the open back turns it over again (owner, 2026-11-10), except a link:
            // "Source" still opens the repo. Keyboard users get the "Flip back" button,
            // which lands here too. Trade-off: a click to select text on the back flips it
            setOpen(item, false);
        }
    });

    // Escape closes the open card, from anywhere inside the catalog
    list.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && openItem) setOpen(openItem, false);
    });
}

/* ---------- Build the page ---------- */

function renderCode(projects) {
    const featuredList = document.querySelector("#code-featured");
    const catalog = document.querySelector("#code-catalog");
    if (!featuredList || !catalog) return;

    // The number comes from the project's place in the WHOLE file, so a project keeps
    // its number whether it shows in Featured or in All projects
    const numbered = projects.map((project, index) => ({ project, number: catalogNumber(index) }));

    // Both lists hold flip cards (owner, 2026-11-10: "all should be flip cards");
    // Featured ones are just bigger (codyles.css, .is-featured)
    featuredList.replaceChildren(...numbered
        .filter(({ project }) => project.featured)
        .map(({ project, number }) => flipCard(project, number)));

    catalog.replaceChildren(...numbered
        .filter(({ project }) => !project.featured)
        .map(({ project, number }) => flipCard(project, number)));

    // No featured projects: hide that whole section instead of showing an empty heading
    featuredList.closest(".code-section").hidden = featuredList.children.length === 0;
    // openItem is shared, so opening a card in one list closes the open card in the other
    wireCatalog(featuredList);
    wireCatalog(catalog);
}

// If code.json can't load (a typo in the file, or the page opened as file:// without a
// server), say so on the page, and still point at GitHub, instead of showing nothing
function showCodeNote(error) {
    console.error(error);
    const note = document.querySelector("#code-note");
    if (!note) return;
    const link = make("a", "", "GitHub");
    link.href = "https://github.com/OopsieLazy";
    note.replaceChildren("The project list didn't load. My public code is on ", link, ".");
}

fetchJson(CODE_URL).then(renderCode).catch(showCodeNote);
