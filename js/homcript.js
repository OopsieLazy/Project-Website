// Home page: builds the catalog and the featured card stack from data/projects.json (D26).
// Each project is typed once in the JSON; this script turns it into HTML.
// Loaded with `defer`, so the page's HTML is already parsed when this runs.
// loadProjects(), make() and makeImage() come from js/datacript.js, which loads first.

const MAX_FEATURED = 3; // the stack's CSS has a place for 3 cards (data-pos 0, 1, 2)

/* ---------- Catalog: one tile per project ---------- */

// One retro box per project (R1b): a full-width row while there are few, a tile in the grid
// from 6 (the CSS decides, not this script).
// Only the NAME is a link. Its ::after stretches over the whole box (css/homyles.css), so the
// box is clickable, but a screen reader hears a short link name ("Bridge Guitar") instead of
// the whole description. The name is an <h3> under the "All projects" <h2>, so screen-reader
// users can jump from project to project
function buildTile(project) {
    const link = make("a", "", project.name);
    link.href = projectHref(project); // opens the project's entry on the CAD page
    const more = make("span", "tile-more", "View project →");
    more.setAttribute("aria-hidden", "true"); // decoration: the link already says where it goes
    return make("li", "catalog-item",
        make("article", "catalog-tile",
            make("div", "tile-art", makeImage(project.image)),
            make("div", "tile-body",
                make("h3", "tile-name", link),
                // joinMeta skips missing parts instead of printing "undefined"
                make("p", "tile-meta", joinMeta([project.type, project.year])),
                make("p", "tile-desc", project.description || ""),
                more
            )
        )
    );
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
    card.href = projectHref(project);
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
