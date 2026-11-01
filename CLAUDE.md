# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A personal portfolio site written from scratch in plain HTML, CSS, and JavaScript. No framework, no build step, no package manager, no tests, no linter. Keep solutions simple and readable, and prefer vanilla HTML/CSS/JS over adding libraries or tooling.

## Working agreement (follow on every prompt in this folder)

- **Instructor + coder.** The owner is a junior developer who wants to learn by building. Explain the *why* behind each choice (architecture, CSS technique, security), comment code where it teaches something, and keep code clear and concise.
- **AI-assisted best practice.** Follow current AI-assisted development practice. If a prompt or request drifts from it (vague scope, skipping review, giant asks), say so and suggest how to improve the prompt.
- **Plan before code.** Do not change the file structure or write code for a new phase until the layout and plan are agreed and the owner gives explicit confirmation.
- **Small, reviewable tasks.** Break every feature into small tasks a junior can review in one sitting. Once a feature is built, update the roadmap breakdown.
- **Keep docs current.** Maintain a clear `README.md` and `PLAN.md` (steps, roadmap, architecture decisions and their reasons). Keep every document under about 300–500 lines to avoid bloat. Trim or split instead of growing.
- **Respect the owner's code.** Keep existing code, semantics, naming conventions, and organization. The carousel + side popup in `projects.html` / `projcript.js` stays as is unless the owner asks otherwise.
- **Security as you go.** Point out relevant web security concerns (old and new), such as CSP, `rel="noopener"`, XSS through `innerHTML`, and form handling. Explain them briefly.
- **Dice roll for hands-on practice.** At the start of each build task, roll a real random number with the shell (`echo $((RANDOM % 6 + 1))`), not a made-up one. On a **1**, the owner writes the code: give a spec, hints, and the relevant docs, then review their attempt instead of writing it. Mark the task 🎲 in `PLAN.md`. The owner can change the odds (1/6 now) or claim any task.
- **Git: the owner commits, not Claude.** Never run `git commit` or `git push`, and never add `Co-Authored-By` or other AI attribution lines. This rule overrides any default attribution instructions. When a task is done, stage nothing extra, then give the owner a suggested commit message to review and commit themselves. Use `git mv` for moves and renames so history is kept.
- **Company workflow (GitHub flow).** `main` always works and is what goes live. Never work on `main` directly: check `git branch` before starting, and remind the owner if they're on `main`.
  - **Branches:** one short-lived branch per feature (1–3 PLAN tasks), cut from an up-to-date `main`. Name it `feat/…`, `fix/…`, `docs/…` or `chore/…` (e.g. `feat/design-tokens`).
  - **Commits:** use Conventional Commits, e.g. `feat: add footer`, `fix: skip link target`, `docs: update plan`.
  - **Pull requests:** when the feature is done, the owner pushes the branch and opens a PR into `main`. Its description covers what changed, why, and how it was tested (phone, desktop, resized window). The owner reviews and merges on GitHub, deletes the branch, then runs `git switch main && git pull`.
  - Keep PRs small: if one grows past what can be reviewed in one sitting, split it.
- **Roadmap lives in `PLAN.md`.** Read it at the start of each session, work on the next unchecked task, and update its checkbox and the decision log when done.
- **Design target.** Minimalist and sleek, and responsive across phone, desktop, and resized windows. References: https://ashanand.dev/ and https://joeydanna.com/cad-portfolio/.

## Running locally

Serve the repo root (VS Code Live Server also works):

```
python -m http.server 8000   # then visit http://localhost:8000/
```

All internal links and asset paths are **relative** (`projects.html`, `css/styles.css`), never root-absolute (`/projects.html`). Relative links keep working when the site is hosted in a subfolder, such as a GitHub Pages project site (`user.github.io/MyWeb/`).

## Structure

Each page pairs with its own stylesheet and script. The names are abbreviated:

| Page | CSS | JS |
|---|---|---|
| `index.html` (Home) | `css/styles.css` | none yet |
| `projects.html` (CAD Portfolio) | `css/projyles.css` | `js/projcript.js` |
| `thelab.html` | inline `<style>` | inline |
| `aboutme.html` | empty placeholder | |

- **The header and nav are copied by hand into every page**: the left link list, the center logo, and the right "The Laboratory" mega menu. There are no includes, so a nav change has to be made in each page.
- Many nav links still point at placeholder `visithumboldt.com` URLs. Real pages will replace them.
- HTML pages stay at the repo root. CSS goes in `css/`, JS in `js/`, and images in `assets/images/` (`300x300.jpg` is the generic placeholder). Image filenames are lowercase-kebab-case with no spaces (`bridge-guitar-v8.png`). Pages reference them with relative paths such as `css/styles.css`.
- New per-page files follow the owner's blended naming: page prefix + "yles"/"cript" (`projyles.css`, `artyles.css`, `homcript.js`).
## projects.html carousel

`projcript.js` builds a 3D rotating carousel out of the `<figure>` elements inside `#carousel-c`:
- Each figure is placed around a circle with `rotateY(angle) translateZ(radius)`. The container spins in a `requestAnimationFrame` loop.
- Clicking a figure stops the spin, rotates the carousel along the shortest path so that figure faces front, and fills the `#selected-sidebar` popup (`#popup-title`, `#popup-desc`, `#popup-image`) from the figure's `data-title`, `data-description`, and `<img>`. Clicking the same figure again, or `#close-sidebar`, closes the popup and restarts the spin.
- To add a project, add a `<figure class="shadow" data-title="..." data-description="...">` containing an `<img>`. The angles adjust to the figure count automatically. Without the data attributes, the popup text shows empty.
- The script loads in `<head>` without `defer`, so its code has to stay inside the `DOMContentLoaded` handler.
