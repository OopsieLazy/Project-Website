// CAD page sections (task 2.5): one entry per project from data/projects.json (D26),
// plus a row of jump links (the index). Each entry has the project's JSON id, so
// projects.html#bridge-guitar opens straight at that project (the home page links here).
// Loaded with `defer` after js/datacript.js (loadProjects, make, makeImage, twoDigits).
// The carousel (projcript.js) is separate and doesn't change; it moves to the JSON in 3.2.

// Ids become part of a URL, so only plain lowercase-kebab-case is allowed (bridge-guitar)
const SAFE_ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// An id is usable if it's well formed AND not already on the page. A project called
// "content" would steal the skip link's target, so the second copy would never be reached
function usableId(id) {
    if (!SAFE_ID.test(id || "")) {
        console.warn(`Project id "${id}" isn't lowercase-kebab-case, so it gets no anchor link.`);
        return false;
    }
    if (document.getElementById(id)) {
        console.warn(`Project id "${id}" is already used on this page, so it gets no anchor link.`);
        return false;
    }
    return true;
}

// The stats as a description list: <dt> is the label, <dd> the value. Screen readers
// announce it as a list of pairs. Missing stats are left out instead of showing a dash
function buildStats(stats = {}) {
    const list = make("dl", "cad-stats");
    const add = (label, value) => {
        if (value === undefined || value === null) return;
        list.append(make("div", "", make("dt", "", label), make("dd", "", value)));
    };
    add("Iterations", stats.iterations);
    add("Parts", stats.parts);
    add("Print", stats.printHours != null ? `${stats.printHours} h` : null);
    if (stats.difficulty != null) {
        const level = Math.min(5, Math.max(0, stats.difficulty)); // keep it within 0–5
        // Stars are for the eyes; a screen reader would say "black star, black star…",
        // so it gets the plain words instead
        add("Difficulty", make("span", "",
            make("span", "cad-stars", "★".repeat(level) + "☆".repeat(5 - level)),
            make("span", "screen-reader-text", `${level} out of 5`)
        ));
    }
    return list;
}

// One entry: square image box on the left, text on the right (layout C, owner's pick)
function buildEntry(project, index, id) {
    const number = twoDigits(index + 1);
    const titleId = id ? `${id}-title` : "";

    const image = makeImage(project.image, project.alt || ""); // here the image IS the content, so it gets real alt text
    image.loading = "lazy"; // below the fold: the browser fetches it only when it's close to the screen

    const title = make("h3", "cad-title", project.name);
    if (titleId) title.id = titleId;

    // "writeup" is optional: a list of paragraphs. [].concat() also accepts a single string
    const writeup = [].concat(project.writeup ?? []).map((text) => make("p", "", text));

    const body = make("div", "cad-body",
        // joinMeta (datacript.js): a "·" never starts a line
        make("p", "cad-kicker", joinMeta([number, project.type, project.year, project.tool])),
        title,
        make("p", "", project.description || ""),
        ...writeup,
        buildStats(project.stats)
    );

    const back = make("a", "cad-back", "↑ All projects");
    back.href = "#cad-sections";
    body.append(back);

    // <article>: a self-contained piece that makes sense on its own, like a catalog entry
    const entry = make("article", "cad-entry", make("div", "cad-art", image), body);
    if (id) {
        entry.id = id;
        entry.setAttribute("aria-labelledby", titleId); // the article is named by its heading
    }
    return entry;
}

function buildIndexLink(project, index, id) {
    const link = make("a", "", `${twoDigits(index + 1)} ${project.name}`);
    link.href = `#${id}`;
    return make("li", "", link);
}

// The browser jumps to #bridge-guitar while the page loads, but the entry doesn't exist
// until the JSON arrives, so there's nothing to jump to. Once it's built, jump ourselves
function scrollToHash() {
    const id = decodeURIComponent(location.hash.slice(1));
    const target = id && document.getElementById(id);
    if (target && target.classList.contains("cad-entry")) {
        target.scrollIntoView();
    }
}

async function initSections() {
    const index = document.querySelector("#cad-index");
    const entries = document.querySelector("#cad-entries");
    if (!index || !entries) return;

    let projects;
    try {
        projects = await loadProjects();
    } catch (error) {
        console.error(`CAD sections not built: check ${PROJECTS_URL} for a typo, and serve the site with "python -m http.server" (fetch is blocked on file://).`, error);
        entries.append(make("p", "cad-note", "Projects couldn't load. Please try again later."));
        return;
    }

    projects.forEach((project, i) => {
        // Check the id BEFORE adding the entry: once it's on the page, it would clash with itself
        const id = usableId(project.id) ? project.id : "";
        entries.append(buildEntry(project, i, id));
        if (id) index.append(buildIndexLink(project, i, id));
    });

    scrollToHash();
}

initSections();
