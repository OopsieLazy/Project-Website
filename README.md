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
| `index.html` + `css/homyles.css` + `js/homcript.js` | Home page: hero, featured Blueprint card, project catalog |
| `data/projects.json` | Every project, written once. The home catalog is built from it |
| `projects.html` + `css/projyles.css` + `js/projcript.js` | CAD portfolio with the 3D carousel and side popup |
| `assets/images/` | All images |
| `thelab.html` | Laboratory experiment (notebook-on-desk design) |
| `PLAN.md` | Roadmap, task breakdown, architecture decisions |
| `CLAUDE.md` | Instructions for the AI assistant |

## Add a project

Add one object to `data/projects.json` and the home catalog builds its tile:

- `id`: lowercase-kebab-case, unique (becomes the link anchor later)
- `name`, `image` (path in `assets/images/`), `alt`, `type` (e.g. `"Part · 3D print"`), `year`
- `featured`: `true` puts it in the home card stack
- Optional: `tool`, `description`, `flavor`, `stats` (`iterations`, `parts`, `printHours`, `difficulty` 1–5)

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
