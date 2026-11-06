# MyWeb: Personal Portfolio

A portfolio for CAD, code, art, and film work. It is planned around a pixel-art Renaissance museum you can walk through.
Plain HTML, CSS, and JavaScript, with no framework and no build step.

## Run it locally

From the project folder:

```
python -m http.server 8000
```

Then open http://localhost:8000/.
Use a local server rather than double-clicking the file, because JS modules (Phase 3) only load over `http://`.

## Project layout

| File | Purpose |
|---|---|
| `css/styles.css` | Shared header, footer, design tokens and base styles |
| `css/cardyles.css` | The Blueprint trading card, shared by Home and About. Wrap each card in a `.card-holder` |
| `contact.html` + `css/contyles.css` + `js/contcript.js` | Contact & Résumé as a drawing title block: email with a Copy button, résumé PDF download |
| `aboutme.html` + `css/aboutyles.css` | About page, laid out like an encyclopedia biography (fill in the `<!-- CONTENT -->` slots) |
| `index.html` + `css/homyles.css` + `js/homcript.js` | Home page: hero, featured Blueprint card, project catalog |
| `data/projects.json` | Every project, written once. The home catalog and the CAD page entries are built from it |
| `js/datacript.js` | Shared helpers that load the JSON and build elements safely (home and CAD page) |
| `projects.html` + `css/projyles.css` + `js/projcript.js` + `js/sectcript.js` | CAD portfolio: the 3D carousel and side popup, then one entry per project (`projects.html#<id>`) |
| `assets/images/` | All images |
| `thelab.html` | Laboratory experiment (notebook-on-desk design) |
| `PLAN.md` | Roadmap, task breakdown, architecture decisions |
| `CLAUDE.md` | Instructions for the AI assistant |

## Add a project

Add one object to `data/projects.json`: the home catalog builds its tile and the CAD page builds its entry:

- `id`: lowercase-kebab-case, unique. It's the link anchor, `projects.html#bridge-guitar`; a bad or clashing id still shows the entry but gets no link (the console says why)
- `name`, `image` (path in `assets/images/`), `alt`, `type` (e.g. `"Part · 3D print"`), `year`
- `featured`: `true` puts it in the home card stack
- Optional: `tool`, `description`, `flavor`, `stats` (`iterations`, `parts`, `printHours`, `difficulty` 1–5)
- Optional: `writeup`, the longer story on the CAD page, as a list of paragraphs: `"writeup": ["First paragraph.", "Second paragraph."]`

JSON is strict: double quotes only, a comma between items but **not after the last one**, and no comments. If the catalog goes blank, the browser console (F12) says why.

## How this project is built

I'm learning web development by building this site, working with Claude Code as both instructor and pair programmer.

Each task follows the same cycle:
plan → build (by Claude or by me) → review → commit.
As on a professional team, work happens on feature branches and reaches `main` only through a reviewed pull request.

- `PLAN.md`: the roadmap, task breakdown, and why each architecture decision was made.
- `CLAUDE.md`: the rules the AI follows in this project (teach as it goes, small tasks, I make all commits).

## License

- **Code** (HTML, CSS, JavaScript, config): [MIT](LICENSE). Feel free to learn from it and reuse it.
- **Content**: everything in `assets/` (CAD renders, artwork, photography, video) and the site's written text (bio, project descriptions) is © 2026 OopsieLazy, **all rights reserved**. Please don't reuse it without permission.
- **Fonts** in `assets/fonts/` (Cinzel, Instrument Sans, JetBrains Mono, Silkscreen) belong to their authors and are used under the [SIL Open Font License 1.1](https://openfontlicense.org). Each font's license is next to it.
