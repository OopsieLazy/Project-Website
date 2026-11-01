# PLAN.md

Roadmap, task breakdown, and architecture decisions for the portfolio site.
Rule: each task should be small enough to review in one sitting and gets its own commit.
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

## Phase 0: Foundation cleanup

Goal: a clean, valid, organized base before adding anything new.

- [x] **0.1 Folders.** Create `css/`, `js/`, `assets/images/`. Move files into them and update every `href`/`src`.
- [x] **0.2 Image names.** Rename to lowercase-kebab (`Bridge Guitar v8.png` → `bridge-guitar-v8.png`). Spaces and `--_` break URLs on some hosts.
- [x] **0.3 Entry page.** Renamed `homepage.html` → `index.html` (hosts serve `index.html` by default). Made the root-absolute links (`/projects.html`) relative.
- [x] **0.4 Header validity.** Fixed the viewport comma, removed the DevTools/extension leftovers, made ids unique, wrapped the nav in a `<ul>`, trimmed the unused WordPress classes and fake `aria-expanded`, and changed the placeholder links to `#`.
- [x] **0.5 Housekeeping.** Deleted `TEST CODE/` and the empty `script.js`, and added a `.gitignore`.
- [x] **0.6 Validate.** Every page has 0 errors on https://validator.w3.org/. Added alt text, a real `<h1>`, and fixed the heading order. Info notes left on purpose: the empty popup `<h2>` (JS fills it), the carousel `<section>` with no heading, and the `/>` in `thelab.html`.

**Phase 0 complete.**

## Phase 1: Responsive shell

Goal: one shared look and layout that adapts from phone to wide desktop.

- [ ] **1.1 Design tokens.** Put `:root` CSS variables in shared `styles.css` (colors, fonts, spacing). These give one place to restyle the whole site.
- [ ] **1.2 Mobile-first layout.** Write base styles for phones, then use `min-width` media queries to widen the layout.
- [ ] **1.3 Mobile nav.** A hamburger `<button aria-expanded>` that toggles the left nav on small screens.
- [ ] **1.4 Footer.** Name, links, ©, the same on every page.
- [ ] **1.5 Day/night toggle.** `data-theme` on `<html>`. The default follows the OS setting (`prefers-color-scheme`) and the choice is remembered in `localStorage`. A tiny inline script in `<head>` prevents a white flash on page load.
- [ ] **1.6 Carousel sizing.** Make the radius and figure size scale with screen width. *Only the sizing changes; the carousel and popup logic stay as written (needs owner OK).*
- [ ] **1.7 Spread the shell.** Copy the final header and footer into every page (decision D3).

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
- [ ] **5.4 Images.** Compress to WebP, add `loading="lazy"`, `alt` text.
- [ ] **5.5 Audit.** Lighthouse plus a real-phone test.
- [ ] **5.6 Custom domain** (`.dev` requires HTTPS, which GitHub Pages provides).

## Later (planned, not scheduled)

- The Laboratory: real design based on the `thelab.html` experiment.
- Contact form: a form service (e.g. Formspree) plus a honeypot field against spam bots.
- Filmography: lazy-loaded video embeds (`youtube-nocookie.com`).
- Shared header injected by JS instead of copied (D3 step b).

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

## Open questions

- Pixel art source: which asset packs? Check licenses (CC0 is safest) at Phase 4.1.
- Which pixel font, accent color, and Renaissance palette?
