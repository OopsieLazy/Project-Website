# MyWeb: Personal Portfolio

A hand-built portfolio for CAD, code, art, and film work. It is planned around a pixel-art Renaissance museum you can walk through.
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
| `index.html` + `css/styles.css` | Home page and shared header styles |
| `projects.html` + `css/projyles.css` + `js/projcript.js` | CAD portfolio with the 3D carousel and side popup |
| `assets/images/` | All images |
| `thelab.html` | Laboratory experiment (notebook-on-desk design) |
| `PLAN.md` | Roadmap, task breakdown, architecture decisions |
| `CLAUDE.md` | Instructions for the AI assistant |

## How this project is built

I'm learning web development by building this site, and I use AI-assisted coding with Claude Code as both instructor and pair programmer.
I planned the site and wrote the first version myself. Since then the work has been shared, and I review and commit every change.

Each task follows the same cycle:
plan → build (by Claude, or by me when a dice roll says I write it) → review → commit.
As on a professional team, work happens on feature branches and reaches `main` only through a reviewed pull request.

- `PLAN.md`: the roadmap, task breakdown, and why each architecture decision was made.
- `CLAUDE.md`: the rules the AI follows in this project (teach as it goes, small tasks, I make all commits).
