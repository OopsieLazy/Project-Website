// Shared project-data helpers (D26), used by the home page (homcript.js) and the
// CAD page sections (sectcript.js). Load this FIRST, before the page script:
// scripts with `defer` run in the order they appear in the HTML.
//
// Plain (non-module) scripts on one page share one global scope, so the page
// scripts can call these functions directly. (ES modules with import/export are
// the modern alternative; we stay with plain scripts, like the rest of the site.)

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

// Small helper: make an element with a class and children.
// append() turns plain strings into TEXT nodes, so it's as safe as textContent (D7):
// a "<" in a project name shows as text and can never run as code. Never innerHTML
function make(tag, className, ...children) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.append(...children);
    return element;
}

// Where a project's write-up lives: its entry on the CAD page (task 2.5).
// encodeURIComponent turns anything odd in an id (spaces, "#", "?") into safe URL text
function projectHref(project) {
    return project.id ? `projects.html#${encodeURIComponent(project.id)}` : "projects.html";
}

// Joins short facts with " · " (R1b). The space BEFORE each dot is a no-break space ( ),
// so a dot stays at the end of its line and never starts the next one.
// A part that already holds dots ("Instrument · Hardware") is split first, so its dots get the same treatment
function joinMeta(parts) {
    return parts.filter(Boolean).flatMap((part) => String(part).split(" · ")).join(" · ");
}

// "1" -> "01", so numbers line up like a printed set (card 01/03, section 01)
const twoDigits = (n) => String(n).padStart(2, "0");

// alt defaults to "" (decorative): use that when a link or heading next to the image
// already names the project, so a screen reader doesn't read the name twice
function makeImage(src, alt = "") {
    const image = document.createElement("img");
    image.src = src;
    image.alt = alt;
    return image;
}
