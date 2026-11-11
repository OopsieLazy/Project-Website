// Shared project-data helpers (D26), used by the home page (homcript.js), the
// CAD page (projcript.js, sectcript.js) and the Code page (codcript.js). Load this FIRST, before the page script:
// scripts with `defer` run in the order they appear in the HTML.
//
// Plain (non-module) scripts on one page share one global scope, so the page
// scripts can call these functions directly. (ES modules with import/export are
// the modern alternative; we stay with plain scripts, like the rest of the site.)

const PROJECTS_URL = "data/projects.json";

// Fetch a JSON file and turn it into JavaScript (an array, for our data files).
// `async` lets us write `await` instead of chaining .then() calls.
// Takes the URL so every data file shares it: projects.json (CAD) and code.json (Code page, D40)
async function fetchJson(url) {
    const response = await fetch(url);
    // fetch() only fails on network errors; a missing file (404) still "succeeds", so check it
    if (!response.ok) {
        throw new Error(`${url} answered ${response.status}`);
    }
    // .json() throws a SyntaxError if the file has a typo (missing comma, trailing comma, comment)
    return response.json();
}

// The CAD page asks twice (the carousel and the entries). Keeping the first PROMISE means
// both get the same answer from one download. This is called memoizing: remember a result
// instead of working it out again. ??= only assigns when the left side is still empty
let projectsPromise = null;
function loadProjects() {
    projectsPromise ??= fetchJson(PROJECTS_URL);
    return projectsPromise;
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

/* ---------- Drag a project out (R2, D32) ----------
   The whole box drags as one piece and drops a real file on the desktop (Chrome and Edge),
   the same "DownloadURL" trick as the contact card (contcript.js, PLAN "Drag it out").
   Until a project has a kit (R2c), it drops its cover image */

// The file's type, from its extension. The drop needs it to name the file correctly
const DRAG_TYPES = {
    png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp",
    svg: "image/svg+xml", pdf: "application/pdf", zip: "application/zip"
};

function dragOutProject(element, project) {
    const file = project.kit || project.image;
    if (!file) return;
    const url = new URL(file, location.href);   // DownloadURL needs a full address, not a relative path
    const fileName = url.pathname.split("/").pop();
    const type = DRAG_TYPES[fileName.split(".").pop().toLowerCase()] || "application/octet-stream";

    element.draggable = true;
    // Images and links drag THEMSELVES by default (the picture alone, or a shortcut to the page).
    // Switched off, a drag that starts on them goes to the nearest draggable ancestor: the whole box.
    // A click on the link still works; only dragging changes
    element.querySelectorAll("img, a").forEach((child) => {
        if (child !== element) child.draggable = false;
    });
    element.title = `Drag to your desktop to save ${fileName}`;

    element.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("DownloadURL", `${type}:${fileName}:${url.href}`);
        event.dataTransfer.setData("text/uri-list", url.href);  // other browsers: dropping on a tab opens the file
        event.dataTransfer.setData("text/plain", url.href);
    });
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