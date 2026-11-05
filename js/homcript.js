// Home page: builds the "All projects" catalog from data/projects.json (D26).
// Each project is typed once in the JSON; this script turns it into HTML.
// Loaded with `defer`, so the page's HTML is already parsed when this runs.

const PROJECTS_URL = "data/projects.json";

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

// Small helper: make an element with a class and plain text.
// textContent, never innerHTML (D7): a "<" in a project name shows as text and can never run as code
function makeText(tag, className, text) {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = text;
    return element;
}

// One project -> one catalog tile. Same markup the page had by hand in 2.0a,
// so css/homyles.css styles it with no changes
function buildTile(project) {
    const item = document.createElement("li");

    const link = document.createElement("a");
    link.className = "catalog-tile";
    link.href = "projects.html"; // Task 2.5 points this at projects.html#<id>

    const image = document.createElement("img");
    image.src = project.image;
    image.alt = ""; // the link already says the project's name, so alt text would read it twice

    // Skip missing parts instead of printing "undefined"
    const meta = [project.type, project.year].filter(Boolean).join(" · ");

    link.append(image, makeText("span", "tile-name", project.name), makeText("span", "tile-meta", meta));
    item.append(link);
    return item;
}

async function renderCatalog() {
    const grid = document.querySelector("#catalog-grid");
    if (!grid) return; // not on this page

    try {
        const projects = await loadProjects();
        // replaceChildren swaps everything inside the list in one step
        grid.replaceChildren(...projects.map(buildTile));
    } catch (error) {
        // Tell the owner what to fix (console), and tell visitors where to go (page)
        console.error(`Catalog not built: check ${PROJECTS_URL} for a typo, and serve the site with "python -m http.server" (fetch is blocked on file://).`, error);
        const note = document.createElement("p");
        note.className = "catalog-note";
        note.append("Projects couldn't load. ");
        const link = document.createElement("a");
        link.href = "projects.html";
        link.textContent = "Open the CAD portfolio";
        note.append(link);
        grid.after(note);
    }
}

renderCatalog();
