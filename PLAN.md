# PLAN.md

Roadmap, task breakdown, and architecture decisions for the portfolio site.
Rule: each task should be small enough to review in one sitting and gets its own commit.
Each feature (1–3 tasks) is a branch plus a pull request into `main` (GitHub flow; see CLAUDE.md).
Keep this file under ~300 lines. When a phase is done, collapse it to a one-line summary.

Status key: `[ ]` todo · `[~]` in progress · `[x]` done · 🎲 = rolled "you code it"

---

## Vision

A minimalist, sleek portfolio that works on phones, desktops, and resized windows.
Its signature feature is a pixel-art **Renaissance museum** (Leonardo / Michelangelo style) that you walk through to reach each section.
The museum is an *extra layer*: every page can also be reached through normal nav links. This keeps the site usable by recruiters, screen readers, and search engines.

## Site map

| Page | File (planned) | Phase |
|---|---|---|
| Home / museum entrance | `index.html` | 0, 4 |
| CAD Portfolio | `projects.html` | 1–3 |
| Code Portfolio | `code.html` | 2 |
| Browse Art (art journals + photography) | `art.html` | 2 |
| Filmography (replaces "Project Finder") | `film.html` | Later |
| About Me | `aboutme.html` | 2 |
| Contact & Résumé (info page) | `contact.html` | 2 |
| Contact form | inside `contact.html` | Later |
| The Laboratory | `thelab.html` (experiment for now) | Later |

---

## Phase 0: Foundation cleanup ✅

Done. Organized folders, URL-safe image names, `index.html`, relative links, a valid header, `.gitignore`, and 0 W3C errors.
Info notes left on purpose: the empty popup `<h2>` (JS fills it), the carousel `<section>` with no heading, and the `/>` in `thelab.html`.

## Phase 1: Responsive shell

Goal: one shared look and layout that adapts from phone to wide desktop, built feature by feature, with one PR per feature.
Every PR ends with the **QA checklist**: DevTools device mode at 320 / 375 / 768 / 1024 / 1440 px, drag-resize the window, tab through with the keyboard, W3C validator.

### ▶ Where we left off (update at the end of every session)

*Last session: 2026-11-01*
- **Branch:** `feat/design-tokens` (PR B). **1.1 and 1.2 are done and committed locally, not pushed yet.**
- **Owner's homework:** read through the tokens and `@font-face` rules at the top of `css/styles.css`, and ask about anything unclear.
- **Next task:** 1.3 (CSS reset and base typography: the first time the tokens show on the page), then 1.4 and 1.4b, then push and open PR B.
- **Owner to-dos on GitHub (new repo):** re-create the ruleset (1.0b), turn on secret scanning and push protection, set Actions to read-only, turn off the wiki, run `git push origin --delete chore/public-repo-hygiene`. Delete the old backup bundle once happy.
- **Merged so far:** docs/roadmap, chore/workflow (PR template and CI), chore/public-repo-hygiene (placeholder SVG and license). History rewritten to the noreply email; repo recreated public.

**PR 0 · `docs/phase-1-roadmap`**
- [x] Adopt GitHub flow (D11) and write this breakdown.

**PR A · `chore/workflow`**: how we work
- [x] **1.0a** PR template (`.github/pull_request_template.md`) with a what / why / tested checklist.
- [ ] **1.0b** *(Owner, on GitHub)* Branch protection on `main`: changes arrive only through PRs. ⚠ Free private repos don't enforce rulesets. **Decision: make the repo public** (also needed for free GitHub Pages), then re-create the ruleset.
- [x] **1.0c** GitHub Actions check that runs the HTML validator on every PR (automated QA, as companies do).

**PR B · `feat/design-tokens`**: the look and one shared stylesheet
- [x] **1.1** Picked: **Codex colors** (parchment, iron-gall ink, sanguine red) with **Fresco highlights** (lapis blue, ochre), and **Fresco fonts** (Cinzel display, Instrument Sans body). Shared: JetBrains Mono (code), Silkscreen (pixel museum).
- [x] **1.2** Tokens in `:root` in `styles.css`: colors, fonts, spacing, and fluid type with `clamp()`. Self-host the fonts (D12).
- [ ] **1.3** Modern CSS reset: `box-sizing`, `img { max-width: 100% }`, base typography.
- [ ] **1.4** Every page (except `thelab.html`, D13) loads `styles.css`. Remove the duplicated header rules from `projyles.css`.
- [ ] **1.4b** Cleanup in `projyles.css`: remove the unused `.sub-heading-*` and `.slideshow-title` (the font was never loaded), and the dead `:hover` animation pause (the real pause is 1.15b). The `nth-child` rules stay (owner's choice).

**PR C · `feat/page-skeleton`**: the same frame on every page
- [ ] **1.5** Landmarks on every page: `<header>`, `<main id="content">`, `<footer>`. This fixes the home page's skip link.
- [ ] **1.6** Skip link hidden until it receives keyboard focus.
- [ ] **1.7** Layout container: a max content width, fluid padding, mobile-first breakpoints.
- [ ] **1.8** Footer: name, links, ©.
- [ ] **1.9** `aboutme.html` gets the shell. Rename `projects.html`'s body class `thehomepage` → `theprojectspage`.

**PR D · `feat/header-nav`**: the adaptive header
- [ ] **1.10** Desktop: a three-column CSS grid (nav | logo | Lab menu), with the logo sized.
- [ ] **1.11** Mobile: hamburger `<button aria-expanded>`. First shared JS file: `js/script.js`.
- [ ] **1.12** Lab dropdown: opens on hover and `:focus-within` on desktop, and folds into the mobile menu.

**PR E · `feat/theme-toggle`**: day and night
- [ ] **1.13** Dark-mode token values. The default follows the OS setting (`prefers-color-scheme`).
- [ ] **1.14** Toggle button that remembers the choice in `localStorage`, plus a no-flash script in `<head>` (note: CSP needs a hash for inline scripts in Phase 5).

**PR F · `feat/responsive-projects`**: the CAD page on any screen
- [ ] **1.15** Carousel radius and figure size scale with the screen (one JS value goes from fixed to calculated).
- [ ] **1.15b** Hovering pauses the spin, and leaving resumes it (JS `mouseenter`/`mouseleave`).
- [ ] **1.15c** Motion controls: a pause/play toggle plus a speed slider (`<input type="range">`). If the system asks for reduced motion (`prefers-reduced-motion`), the carousel starts paused.
- [ ] **1.16** On phones the popup becomes a bottom sheet instead of sitting to the right.
- [ ] **1.17** Remove the fixed `#slideshow` height, and make the other sections wrap on small screens.

**Phase close:** real-phone test over Wi-Fi (`python -m http.server 8000 --bind 0.0.0.0`), Lighthouse accessibility run.

## Phase 2: Content pages

- [ ] **2.1 About Me.** Bio, photo, the tools and years you've used them (joeydanna pattern).
- [ ] **2.2 Contact & Résumé.** Info page with a résumé PDF download. Email is shown in a spam-resistant way.
- [ ] **2.3 Code Portfolio.** Project cards with a status badge and tech chips (ashanand pattern).
- [ ] **2.4 Browse Art.** Responsive CSS-grid gallery for the art journals and photography.
- [ ] **2.5 CAD page sections.** Renders with captions plus a write-up link per project.

## Phase 3: Project display system (pluggable)

Goal: many ways to show projects, and new ways can be added without touching old ones.

Pattern: each display is a self-contained JS file that sets itself up on any container marked with `data-display="..."`.
```html
<div data-display="carousel"> <figure ...>...</figure> </div>
<div data-display="slideshow"> <figure ...>...</figure> </div>
```
- [ ] **3.1 Display loader.** A small script that finds `[data-display]` elements and calls the matching module.
- [ ] **3.2 Register the carousel.** Wrap the existing `projcript.js` logic as the first display, with minimal edits.
- [ ] **3.3 Slideshow display.**
- [ ] **3.4 Lightbox/popup display** (reuses the sidebar popup idea).
- [ ] **3.5 Doc: "How to add a display"** in README.

## Phase 4: The museum

Design doc first (art style, room ↔ section map, controls), then build in small steps.

- [ ] **4.1 Design doc.** Rooms, layout sketch, palette, who draws the pixel art (you?).
- [ ] **4.2 One static room.** Small pixel-art images (found or drawn) scaled up with `image-rendering: pixelated` and placed with CSS. Doors are real `<a>` links, so the room works without JS. (ashanand.dev draws its room on a 480×270 `<canvas>` scaled up the same way, with SVG animations for the flames. We use images and HTML because they're simpler and more accessible.)
- [ ] **4.3 Movement.** A character that moves with keyboard, tap, or click, walks to a door, and enters it.
- [ ] **4.4 Room-to-room transitions.**
- [ ] **4.5 Grand clock.** A Da Vinci–style clock that uses `Intl.DateTimeFormat`. The city/time zone is a single setting the owner can change. Hands are rotated by CSS transforms.
- [ ] **4.6 Day/night lighting.** The museum lighting follows the theme toggle from 1.5.
- [ ] **4.7 Accessibility.** "Skip the museum" link, `prefers-reduced-motion`, focusable doors.

## Phase 5: Launch

- [ ] **5.1 Hosting.** GitHub Pages.
- [ ] **5.2 Security.** CSP via `<meta>` (GitHub Pages can't set headers), `rel="noopener noreferrer"` on external links, audit any `innerHTML`.
- [ ] **5.3 Basics.** Favicon, page descriptions, Open Graph preview tags.
- [ ] **5.4 Images.** Compress to WebP, add `loading="lazy"`, `alt` text. **Strip metadata from every photo** (phone photos carry GPS location).
- [ ] **5.5 Audit.** Lighthouse plus a real-phone test.
- [ ] **5.6 Custom domain** (`.dev` requires HTTPS, which GitHub Pages provides).

## Later (planned, not scheduled)

- The Laboratory: real design based on the `thelab.html` experiment.
- Contact form: a form service (e.g. Formspree) plus a honeypot field against spam bots.
- Filmography: lazy-loaded video embeds (`youtube-nocookie.com`).
- Shared header injected by JS instead of copied (D3 step b).

## Experiments

**🔍 Code Lens**: a magnifying-glass toggle. A circular lens follows the cursor (or a finger on touch screens) and shows the page's *own source code* "underneath" the rendered page, as if seeing through it.
- **Live, not screenshots.** The page fetches its own source (`fetch(location.href)`, plus its CSS/JS files), so the lens is always up to date. Screenshots would go stale after every change.
- **How it's drawn.** A full-page `<pre>` code layer sits on top, and a CSS `clip-path: circle()` that follows the pointer shows only the lens area. Translucency comes from `opacity` / `backdrop-filter`.
- **Security.** The code is inserted with `textContent` (D7), so it's displayed and never run. Same-origin fetch only, which fits CSP `connect-src 'self'`.
- **Accessibility.** Off by default, toggled by a `<button aria-pressed>`, decorative layer `aria-hidden`, respects `prefers-reduced-motion`.
- **Ideas.** Tabs for HTML / CSS / JS. Syntax colors. Style it as a Renaissance brass loupe so it matches the museum. Possibly a museum exhibit in its own right.
- **When.** After Phase 1, once the header has a spot for the toggle. Could live in The Laboratory first.

---

## Architecture decisions

| # | Decision | Why |
|---|---|---|
| D1 | Plain HTML/CSS/JS, no framework or build step | Learn the fundamentals first, and nothing to install |
| D2 | One shared `styles.css` plus a per-page file only when needed, named in the owner's style (`projyles.css`, `projcript.js`) | Consistency without one giant file |
| D3 | Header copied into each page now, JS include later | Simplest first; upgrade once JS is comfortable |
| D4 | Pages stay at the repo root; assets go in folders | Short, clean URLs (`/art.html`) |
| D5 | The museum is progressive enhancement over normal pages | Recruiters, screen readers, and SEO still work |
| D6 | Project displays are pluggable via `data-display` | New display types are added without editing old ones |
| D7 | Use `textContent`, never `innerHTML`, for dynamic text | Prevents XSS (script injection) |
| D8 | Owner makes all commits; no AI attribution | The repo history is the owner's, and committing doubles as the review step |
| D9 | Pixel art from found or drawn images, not a canvas | Easier to learn and edit, and doors stay real links |
| D10 | Relative links only, no leading `/` | Work locally, from a subfolder, and on any host |
| D11 | GitHub flow: feature branches, Conventional Commits, PRs into `main` | Industry practice; `main` always works and goes live; PRs are the review step |
| D12 | Self-host fonts (no Google Fonts link) | Faster, no third-party tracking, simpler CSP |
| D13 | `thelab.html` stays standalone for now | It's an experiment and gets its own design later |
| D14 | MIT license for code; `assets/` and written content all rights reserved | Code is open to learn from, and the art and designs stay the owner's |
| D15 | Only self-made or properly licensed images in the repo; metadata stripped | The repo is public: no one else's copyrighted files, and no hidden GPS or personal data |

## Open questions

- Pixel art source: which asset packs? Check licenses (CC0 is safest) at Phase 4.1.
- Which pixel font, accent color, and Renaissance palette?
