# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A personal portfolio site written from scratch in plain HTML, CSS, and JavaScript. No framework, no build step, no package manager, no tests, no linter. Keep solutions simple and readable, and prefer vanilla HTML/CSS/JS over adding libraries or tooling.

## Working agreement (follow on every prompt in this folder)

- **Instructor + coder.** The owner is a junior developer who wants to learn by building. Explain the *why* behind each choice (architecture, CSS technique, security), comment code where it teaches something, and keep code clear and concise.
- **AI-assisted best practice.** Follow current AI-assisted development practice. If a prompt or request drifts from it (vague scope, skipping review, giant asks), say so and suggest how to improve the prompt.
- **Teach both tracks, every task.** End every build task with a rundown in two parts, never just "done":
  1. **The code:** what changed, why this technique, and what to look for in review.
  2. **The AI workflow:** what Claude did and why (read the plan first, rolled the die, checked the branch, verified instead of assumed), plus feedback on the owner's prompt and a stronger version if it was vague.
- **Plan before code.** Do not change the file structure or write code for a new phase until the layout and plan are agreed and the owner gives explicit confirmation.
- **Small, reviewable tasks.** Break every feature into small tasks a junior can review in one sitting. Once a feature is built, update the roadmap breakdown.
- **Keep docs current.** Maintain a clear `README.md` and `PLAN.md` (steps, roadmap, architecture decisions and their reasons). Keep every document under about 300–500 lines to avoid bloat. Trim or split instead of growing.
- **Respect the owner's code.** Keep existing code, semantics, naming conventions, and organization. The carousel + side popup in `projects.html` / `projcript.js` keep their behaviour (spin, pause, shortest-path turn, popup); the owner opened their look and data source to changes on 2026-11-10 (R2d/R2e).
- **Security as you go.** Point out relevant web security concerns (old and new), such as CSP, `rel="noopener"`, XSS through `innerHTML`, and form handling. Explain them briefly.
- **Dice roll for hands-on practice.** At the start of each build task, roll a real random number with the shell (`echo $((RANDOM % 6 + 1))`), not a made-up one. On a **1**, the owner writes the code: give a spec, hints, and the relevant docs, then review their attempt instead of writing it. Don't record rolls in any `.md` file. The owner can change the odds (1/6 now) or claim any task.
- **Git: the owner commits, not Claude.** Never run `git commit` or `git push`, and never add `Co-Authored-By` or other AI attribution lines. This rule overrides any default attribution instructions. When a task is done, stage nothing extra, then give the owner a suggested commit message to review and commit themselves. Use `git mv` for moves and renames so history is kept.
- **Company workflow (GitHub flow).** `main` always works and is what goes live. Never work on `main` directly: check `git branch` before starting, and remind the owner if they're on `main`.
  - **Branches:** one short-lived branch per feature (1–3 PLAN tasks), cut from an up-to-date `main`. Name it `feat/…`, `fix/…`, `docs/…` or `chore/…` (e.g. `feat/design-tokens`).
  - **Commits:** use Conventional Commits, e.g. `feat: add footer`, `fix: skip link target`, `docs: update plan`.
  - **Pull requests:** when the feature is done, the owner pushes the branch and opens a PR into `main`. Its description covers what changed, why, and how it was tested (phone, desktop, resized window). The owner reviews and merges on GitHub, deletes the branch, then runs `git switch main && git pull`.
  - Keep PRs small: if one grows past what can be reviewed in one sitting, split it.
  - **Always end a finished PR with the full command list**, ready to copy, in order. Don't hand over just a commit message:
    1. **Commit:** `git add <files>` and `git commit -m "…"` for each commit (docs separate from features).
    2. **Push:** `git push -u origin <branch>` (first push) or `git push`.
    3. **PR:** the PR description to paste into GitHub.
    4. **After merging:** `git switch main`, `git pull`, `git branch -d <branch>`, `git push origin --delete <branch>` (skip if GitHub already deleted it), `git fetch --prune`.
- **Roadmap lives in `PLAN.md`.** Start each session by reading its "Where we left off" section and running `git status`. Update that section when the owner wraps up. Session notes never get their own branch or PR: cut the next feature branch and commit the notes there as its first commit (`docs: session notes …`). Read it at the start of each session, work on the next unchecked task, and update its checkbox and the decision log when done.
- **Design target.** Minimalist and sleek, and responsive across phone, desktop, and resized windows. References: https://ashanand.dev/, https://joeydanna.com/cad-portfolio/, and https://dazprojects.com/collections/all (key layout reference: white, Inter, hairlines, centered logo).

## Running locally

Serve the repo root (VS Code Live Server also works):

```
python -m http.server 8000   # then visit http://localhost:8000/
```

All internal links and asset paths are **relative** (`projects.html`, `css/styles.css`), never root-absolute (`/projects.html`). Relative links keep working when the site is hosted in a subfolder, such as a GitHub Pages project site (`user.github.io/MyWeb/`).

## Checks

There are no tests. `.github/workflows/validate-html.yml` runs the W3C Nu validator (`vnu-jar`, pinned version, `--errors-only`) on every non-empty `.html` file for each PR and push to `main`. To check one page by hand, paste it into https://validator.w3.org/#validate_by_input.

## Structure

Each page pairs with its own stylesheet and script. The names are abbreviated:

| Page | CSS | JS |
|---|---|---|
| `index.html` (Home) | `css/styles.css` + `css/cardyles.css` + `css/homyles.css` | `js/script.js` + `js/themcript.js` + `js/datacript.js` + `js/homcript.js` (builds the catalog from `data/projects.json`, D26) |
| `projects.html` (CAD Portfolio) | `css/styles.css` + `css/projyles.css` | `js/script.js` + `js/themcript.js` + `js/projcript.js` + `js/datacript.js` + `js/sectcript.js` (project entries from the JSON) |
| `thelab.html` | inline `<style>` | inline |
| `aboutme.html` | `css/styles.css` + `css/cardyles.css` + `css/aboutyles.css` | `js/script.js` + `js/themcript.js` |
| `art.html` (Browse Art) | `css/styles.css` + `css/artyles.css` | `js/script.js` + `js/themcript.js` |
| `code.html` (Code Portfolio) | `css/styles.css` + `css/codyles.css` | `js/script.js` + `js/themcript.js` |
| `contact.html` (Contact & Résumé) | `css/styles.css` + `css/contyles.css` | `js/script.js` + `js/themcript.js` + `js/contcript.js` (rebuilds the email, Copy button) |

`css/cardyles.css` is the shared Blueprint card. Every card must sit inside a `.card-holder` (or another `container-type: inline-size` box the card's width): the card's own border rings use `cqi`, which measures the nearest ancestor container.

`js/datacript.js` holds the shared JSON helpers (`loadProjects`, `make`, `makeImage`, `projectHref`) and must load **before** the page script that uses them (both `defer`, so HTML order is run order).

`styles.css`, `js/script.js` (header toggles, loaded with `defer`) and `js/themcript.js` (the theme dimmer, D38, loaded **without** `defer` so the saved theme and level apply before the first paint) are shared by every page except `thelab.html`.

- **The header and nav are copied by hand into every page**: the left link list, the center logo, and the right "The Laboratory" mega menu. There are no includes, so a nav change has to be made in each page.
- Nav links to pages that don't exist yet are `href="#"` placeholders. Real pages will replace them.
- HTML pages stay at the repo root. CSS goes in `css/`, JS in `js/`, images in `assets/images/` and downloadable documents in `assets/docs/` (the contact-sheet PDF: regenerate it after editing `contact.html`, see README) (`placeholder.svg` is the self-made generic placeholder). Image filenames are lowercase-kebab-case with no spaces (`bridge-guitar-v8.png`). The repo is public, so only add images the owner made or that have a reuse license, and strip metadata (EXIF/GPS) from photos first. Code is MIT (`LICENSE`); `assets/` and written content are all rights reserved, except `assets/fonts/` (OFL, licenses kept beside the files).
- **Styling uses the design tokens** at the top of `css/styles.css` (`--color-*`, `--font-*`, `--step-*` type scale, `--space-*`). Never hard-code a color, font or size that a token covers. Colors come in two groups: a fixed **palette** (`--color-pine`, `--color-gunjo`, `--color-chochin`…, the same in every theme) and **roles** (`--color-bg`, `--color-accent`, `--color-active`…) that switch with `light-dark(Day, Lantern)` (the Moss theme was removed, D36). Style pages with roles; use palette colors only for things that must never change (the stripes). Check contrast in both themes. `--color-sage` and `--color-sand` are decoration only, and `--color-highlight` is for rings, underlines and borders, not small text, because jade fails text contrast by day. Fonts are self-hosted WOFF2 files with `@font-face` in `styles.css`. Pages reference them with relative paths such as `css/styles.css`.
- New per-page files follow the owner's blended naming: page prefix + "yles"/"cript" (`projyles.css`, `artyles.css`, `homcript.js`).
## projects.html carousel

`projcript.js` builds a 3D rotating ring of drawing sheets inside `#carousel-c`, one per project in `data/projects.json` (D39):
- Each sheet is placed around a circle with `rotateY(angle) translateZ(radius)`. The container spins as a Web Animations API animation (`carousel.animate`), which runs on the compositor so phones don't pause it while scrolling. Three flags (picked, Pause, mouse hover over the panel) stop it through `updateSpin()`; the angle is handed back to `--spin` when it stops. Fewer than `MIN_RING` (6) projects go round more than once; the copies are `aria-hidden` and skipped by Tab.
- Clicking a sheet stops the spin, rotates the ring along the shortest path so that sheet faces front, and fills the `#selected-sidebar` popup, a light summary (DWG number, title, type · year · tool, description, link to the full entry), from the project. Clicking the same sheet again, `#close-sidebar` or Escape closes it, glides the carousel back into view and restarts the spin.
- The ring is pushed back by its radius (`--ring-radius`), so the front sheet shows at its true size; an enlarged 3D layer looks blurry.
- **To add a project, add it to `projects.json` only.** The carousel and the entries below both read it.
- The look (sheet frame, crop marks, mono labels) is shared with the CAD entries in `projyles.css`: `.cad-sheet` uses the entry frame, `.ring-art` the crop marks.
- The script loads in `<head>` without `defer`, so its code has to stay inside the `DOMContentLoaded` handler. It uses `datacript.js` helpers, which exist by then because deferred scripts run before `DOMContentLoaded`.
