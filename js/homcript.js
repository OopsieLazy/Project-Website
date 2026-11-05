// Home page: builds the catalog and the featured card stack from data/projects.json (D26).
// Each project is typed once in the JSON; this script turns it into HTML.
// Loaded with `defer`, so the page's HTML is already parsed when this runs.

const PROJECTS_URL = "data/projects.json";
const MAX_FEATURED = 3; // the stack's CSS has a place for 3 cards (data-pos 0, 1, 2)

// Fetch the JSON and turn it into a JavaScript array.
// `async` lets us write `await` instead of chaining .then() calls.
async function loadProjects() {
    const response = await fetch(PROJECTS_URL);
    // fetch() only fails on network errors; a missing file (404) still "succeeds", so check it
    if (!response.ok) {
        throw new Error(`${PROJECTS_URL} answered ${response.status}`);
    }
    // .json() throws a SyntaxError if the file has a typo (missing comma, trailing comma, comment)
    return response.json();
}

// Small helper: make an element with a class and children.
// append() turns plain strings into TEXT nodes, so it's as safe as textContent (D7):
// a "<" in a project name shows as text and can never run as code. Never innerHTML
function make(tag, className, ...children) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.append(...children);
    return element;
}

function makeImage(src) {
    const image = document.createElement("img");
    image.src = src;
    image.alt = ""; // the link around it already names the project, so alt text would read it twice
    return image;
}

/* ---------- Catalog: one tile per project ---------- */

// Same markup the page had by hand in 2.0a, so css/homyles.css styles it with no changes
function buildTile(project) {
    const link = make("a", "catalog-tile",
        makeImage(project.image),
        make("span", "tile-name", project.name),
        // Skip missing parts instead of printing "undefined"
        make("span", "tile-meta", [project.type, project.year].filter(Boolean).join(" · "))
    );
    link.href = "projects.html"; // Task 2.5 points this at projects.html#<id>
    return make("li", "", link);
}

function renderCatalog(projects) {
    const grid = document.querySelector("#catalog-grid");
    if (grid) grid.replaceChildren(...projects.map(buildTile)); // swaps the list's contents in one step
}

function showCatalogNote() {
    const grid = document.querySelector("#catalog-grid");
    if (!grid) return;
    const link = make("a", "", "Open the CAD portfolio");
    link.href = "projects.html";
    grid.after(make("p", "catalog-note", "Projects couldn't load. ", link));
}

/* ---------- Featured card stack (2.0c) ---------- */

// "1" -> "01", so card numbers line up like a printed set (01/03)
const twoDigits = (n) => String(n).padStart(2, "0");

// One Blueprint card. The values in the corners are DERIVED, not typed:
// card number from its place, "v8" from iterations, stars from difficulty
function buildCard(project, index, total) {
    const stats = project.stats || {};
    // A missing stat shows a dash instead of "undefined"
    const show = (value, unit = "") => (value === undefined || value === null) ? "–" : `${value}${unit}`;
    const difficulty = Math.min(5, Math.max(0, stats.difficulty ?? 0)); // keep it within 0–5

    const stat = (icon, value, label) =>
        make("span", "card-stat", make("span", "card-icon", icon), make("b", "", value), make("small", "", label));

    const card = make("a", "bp-card",
        make("span", "card-top",
            make("span", "card-tool", project.tool || "CAD"),
            make("span", "card-name", project.name),
            make("span", "card-number", `${twoDigits(index + 1)}/${twoDigits(total)}`)
        ),
        make("span", "card-art",
            makeImage(project.image),
            make("span", "card-stats",
                stat("↻", show(stats.iterations), "Iter"),
                stat("⚙", show(stats.parts), "Parts"),
                stat("⏱", show(stats.printHours, "h"), "Print"),
                stat("◆", show(stats.difficulty), "Diff")
            )
        ),
        make("span", "card-type", project.type || ""),
        make("span", "card-text",
            make("span", "card-desc", project.description || ""),
            make("span", "card-flavor", project.flavor || "")
        ),
        make("span", "card-foot",
            make("span", "card-rev", show(stats.iterations && `v${stats.iterations}`)),
            // Empty stars get their own span so the CSS can fade them (tiny ☆ and ★ look alike)
            make("span", "card-difficulty",
                "★".repeat(difficulty),
                make("span", "star-empty", "☆".repeat(5 - difficulty))
            ),
            make("span", "card-date", show(project.year))
        )
    );
    // It's a link because it GOES somewhere (a <button> DOES something on the page).
    // aria-label gives it a short name; otherwise a screen reader would read every stat
    card.href = "projects.html";
    card.setAttribute("aria-label", `${project.name}, featured project`);
    card.dataset.name = project.name;
    return card;
}

// Reusable: give it a container (with .card-stack, .featured-name, .stack-next inside)
// and the projects to show. Phase 3 can register it as a display without a rewrite
function setupStack(container, projects) {
    if (projects.length === 0) return; // nothing featured: the slot stays hidden

    const stack = container.querySelector(".card-stack");
    const name = container.querySelector(".featured-name");
    const caption = container.querySelector(".featured-caption");
    const next = container.querySelector(".stack-next");

    // The ARRAY ORDER is the stack order: cards[0] is always the front card.
    // JS only reorders this array and renumbers data-pos; CSS does the placing and the motion
    const cards = projects.map((project, i) => buildCard(project, i, projects.length));
    stack.append(...cards);

    function update() {
        cards.forEach((card, pos) => {
            card.dataset.pos = pos;
            const isFront = pos === 0;
            // Back cards leave the Tab order and the screen-reader view: they are a mouse
            // shortcut only. Keyboard users get the same result from the "Next card" button
            card.tabIndex = isFront ? 0 : -1;
            if (isFront) card.removeAttribute("aria-hidden");
            else card.setAttribute("aria-hidden", "true");
        });
        name.textContent = cards[0].dataset.name;
    }

    // One listener on the stack instead of one per card ("event delegation")
    stack.addEventListener("click", (event) => {
        const card = event.target.closest(".bp-card");
        if (!card || card === cards[0]) return; // the front card is a normal link: let it navigate
        event.preventDefault();                 // a back card swaps to the front instead
        cards.splice(cards.indexOf(card), 1);   // take it out...
        cards.unshift(card);                    // ...and put it first
        update();
    });

    if (cards.length > 1) {
        next.hidden = false;
        next.addEventListener("click", () => {
            cards.push(cards.shift()); // the front card goes to the back, the next one comes forward
            update();
        });
    }

    update();
    // Only now: if aria-live were on from the start, the first fill would be announced on page load
    caption.setAttribute("aria-live", "polite");
    container.hidden = false;
}

/* ---------- Start ---------- */

async function initHome() {
    let projects;
    try {
        projects = await loadProjects();
    } catch (error) {
        // Tell the owner what to fix (console), and tell visitors where to go (page).
        // The stack slot stays hidden, so the hero is just its text column
        console.error(`Home not built: check ${PROJECTS_URL} for a typo, and serve the site with "python -m http.server" (fetch is blocked on file://).`, error);
        showCatalogNote();
        return;
    }

    renderCatalog(projects);

    const slot = document.querySelector(".featured-slot");
    if (slot) {
        setupStack(slot, projects.filter((project) => project.featured).slice(0, MAX_FEATURED));
    }
}

initHome();
