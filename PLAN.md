# PLAN.md

Roadmap, task breakdown, and architecture decisions for the portfolio site.
Rule: each task should be small enough to review in one sitting and gets its own commit.
Each feature (1–3 tasks) is a branch plus a pull request into `main` (GitHub flow; see CLAUDE.md).
Keep this file under ~300 lines. When a phase is done, collapse it to a one-line summary.

Status key: `[ ]` todo · `[~]` in progress · `[x]` done

---

## Vision

A minimalist, sleek portfolio that works on phones, desktops, and resized windows.
Its signature feature is a pixel-art **Renaissance museum** (Leonardo / Michelangelo style) that you walk through to reach each section.
The museum is an *extra layer*: every page can also be reached through normal nav links. This keeps the site usable by recruiters, screen readers, and search engines.
**Now:** a clean, working skeleton that's decent to hand out and easy to drop content into. The owner gathers the content separately; the look will change a lot once the museum arrives.
**Design identity** (the test for new ideas): a retro curiosity cabinet. Vintage Japanese colors, 70s stripes, pixel-art scientific objects (the orrery, the Da Vinci clock), and a museum to walk through.

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

## Order of work

1. **Finish the skeleton:** PR F1, F2, F3 (CAD page works on phones, popup, motion and keyboard), then the Phase 1 close.
2. **Content-ready templates** (Phase 2): every page has its layout and clear slots, so adding content is filling in, not building.
3. **Early launch** (5.1–5.3): put the skeleton online so it can be handed out.
4. **Orrery lamp** (PR E2): the owner draws the art in parallel with steps 1–3; the build comes after.
5. **Project displays** (Phase 3), then **the museum** (Phase 4), then the rest of Phase 5.

**Guardrail:** no new roadmap items until step 3 is done. New ideas go into Experiments, undated.

**Where does a refinement go?** Ask "which task is this about?"
- About the feature in the **current or next PR** → add it to that task now (e.g. the popup's slide and fade → 1.16).
- About a **finished** feature → note it under the phase's *Polish* line; it's done in one pass at the phase close, not mid-feature.
- A **new idea** → Experiments, undated.
Each feature goes in three steps: **works → right** (layout, keyboard, phones) **→ nice** (motion, polish).

## Phase 0: Foundation cleanup ✅

Done. Organized folders, URL-safe image names, `index.html`, relative links, a valid header, `.gitignore`, and 0 W3C errors.
Info notes left on purpose: the empty popup `<h2>` (JS fills it), the carousel `<section>` with no heading, and the `/>` in `thelab.html`.

## Phase 1: Responsive shell

Goal: one shared look and layout that adapts from phone to wide desktop, built feature by feature, with one PR per feature.
Every PR ends with the **QA checklist**: DevTools device mode at 320 / 375 / 768 / 1024 / 1440 px, drag-resize the window, tab through with the keyboard, W3C validator.

### ▶ Where we left off (update at the end of every session)

*Last session: 2026-11-03*
- **Branch:** `fix/projects-mobile` (PR F1). Both tasks done (1.15, 1.17). Next: the owner checks the CAD page on a phone width, commits, pushes, and opens the PR.
- **Next task:** PR F2 `fix/projects-popup` (1.16). F1 is done on `fix/projects-mobile`. Owner, in parallel: orrery art direction (1.14b). See *Order of work*.
- **Owner to-dos on GitHub:** re-create the ruleset (1.0b), turn on secret scanning and push protection, set Actions to read-only, turn off the wiki, turn on "Automatically delete head branches". Delete the old backup bundle once happy.
- **Merged so far:** #1 public-repo hygiene, #2 design tokens (PR B), #3 page skeleton (PR C), #4 layout and footer (PR C2), #5 header nav (PR D), #6 restyle (PR D2), #7 themes and picker (PR E).
- **Design reference:** https://dazprojects.com/collections/all (white, hairlines, centered logo, catalog grid). We kept our own fonts (Cinzel, Instrument Sans). It feeds 3.3b.
- **Known issue:** the project popup overlaps the carousel on every screen size. PR F2 (1.16) fixes it.
- **Open ideas:** page titles still say "Personal Portfolio" (home) / placeholder names; footer links are `#` placeholders (email waits for 2.2). PR F (6 tasks) should be split before starting it.

**PR 0 · `docs/phase-1-roadmap`**
- [x] Adopt GitHub flow (D11) and write this breakdown.

**PR A · `chore/workflow`**: how we work
- [x] **1.0a** PR template (`.github/pull_request_template.md`) with a what / why / tested checklist.
- [ ] **1.0b** *(Owner, on GitHub)* Branch protection on `main`: changes arrive only through PRs. ⚠ Free private repos don't enforce rulesets. **Decision: make the repo public** (also needed for free GitHub Pages), then re-create the ruleset.
- [x] **1.0c** GitHub Actions check that runs the HTML validator on every PR (automated QA, as companies do).

**PR B · `feat/design-tokens`**: the look and one shared stylesheet
- [x] **1.1** Picked: **Codex colors** (parchment, iron-gall ink, sanguine red) with **Fresco highlights** (lapis blue, ochre), and **Fresco fonts** (Cinzel display, Instrument Sans body). Shared: JetBrains Mono (code), Silkscreen (pixel museum).
- [x] **1.2** Tokens in `:root` in `styles.css`: colors, fonts, spacing, and fluid type with `clamp()`. Self-host the fonts (D12).
- [x] **1.3** Modern CSS reset: `box-sizing`, `img { max-width: 100% }`, base typography (body, headings, links, `:focus-visible`).
- [x] **1.4** Every page (except `thelab.html`, D13) loads `styles.css`. Remove the duplicated header rules from `projyles.css`. (`aboutme.html` is empty, so it gets the link in 1.9.)
- [x] **1.4b** Cleanup in `projyles.css`: remove the unused `.sub-heading-*` and `.slideshow-title` (the font was never loaded), and the dead `:hover` animation pause (the real pause is 1.15b). The `nth-child` rules stay (owner's choice).

**PR C · `feat/page-skeleton`**: the same frame on every page (split from the layout, D17)
- [x] **1.5** Landmarks on every page: `<header>`, `<main id="content">`, `<footer>`, all inside the owner's `#page` wrapper (projects' `<article>` moves in). The skip link now lands on `<main>`, not the carousel.
- [x] **1.6** Skip link hidden until it receives keyboard focus (`.screen-reader-text` + `.skip-link:focus` in `styles.css`).
- [x] **1.9** `aboutme.html` gets the shell. Rename `projects.html`'s body class `thehomepage` → `theprojectspage`.

**PR C2 · `feat/layout-footer`**: the minimal column
- [x] **1.7** Reusable `.wrapper` class (D17): `--content-max` cap, `clamp()` side padding, two mobile-first breakpoints (`40rem`, `64rem`).
- [x] **1.8** Footer: name, ©, and placeholder links (GitHub, LinkedIn, email, résumé, plus the nav) that all share one markup pattern, so filling one in is a one-line edit.

**PR D · `feat/header-nav`**: the adaptive header
- [x] **1.10** Desktop: grid `1fr auto 1fr` with a centered logo (the Home link). Links are split around it (D18).
- [x] **1.11** Phones: a Menu button opens the links. First shared JS, `js/script.js`. Without JS, the links just show.
- [x] **1.12** Lab dropdown: on desktop it opens on hover or keyboard focus, and on phones a ▸ button folds it.

**PR D2 · `feat/restyle-tokens`**: the dazprojects look (D19). Runs before PR E, so the night colors are made from the new day colors only once.
- [x] **1.12a** White palette with the owner's vintage Japanese greens: pine `#385850` (links, headings), jade `#59877D` (hover underline), sage and sand for decoration, `#303030` ink.
- [x] **1.12b** Fonts: decided to **keep** Cinzel (headings) and Instrument Sans (body). No change needed.
- [x] **1.12c** Color blocks (D20): a full-width sand header band, a pine footer band with white text, sage hairlines. On hover and Tab, menu links (header, dropdown, phone menu) turn a muted deep jade and bold. Footer links turn pale kamenozoki blue, and other links turn gunjō blue. Five straight 70s stripes run down the right edge, from the header to the footer, on every screen size (D21). The dropdown is a cleaner panel without underlines.

**PR E · `feat/theme-toggle`**: day and night
- [x] **1.13** Three themes (D22). **Day** (unchanged). **Lantern**, the default night (rainy Japanese street): wet-asphalt blue-black, rain-blue links, chōchin red-orange active words with a soft neon glow, an akabeni red footer. **Moss**, an opt-in calm night: sage-scale greens, Cinnamon Buff highlights, pine footer, no glow. The OS setting picks Day or Lantern via `light-dark()`; `data-theme` on `<html>` forces any of the three. `projyles.css` popup grays now use tokens.
- [x] **1.14** Theme picker (D23): a paper lantern hanging from the header in front of the stripes. Each click loops Auto → Day → Lantern → Moss → Auto, and the lantern's light shows the theme. A name tag shows on hover or focus. `js/themcript.js` loads in `<head>` without `defer` (no flash), saves the choice in `localStorage`, and only trusts the three known names.

**PR F1 · `fix/projects-mobile`**: no more sideways scroll on phones
- [x] **1.15** `projcript.js` calculates the figure size and ring radius from the slideshow width (`ResizeObserver`), capped at the original 190px / 300px, and sets `--figure-size` for the CSS.
- [x] **1.17** The fixed 600px `#slideshow` height follows `--figure-size` instead (still 600px on desktop).

**PR F2 · `fix/projects-popup`**: the popup stops covering the carousel
- [ ] **1.16** Desktop: the popup sits beside the carousel. Phones (owner's spec): on tap, the carousel stops facing the pick and **slides smoothly down**, and the popup **fades in** above it. The stopped carousel stays visible, so the selector never disappears. Close reverses it. The popup image scales with the screen. Reduced motion: no slide or fade, it just appears.

**PR F3 · `feat/carousel-controls`**: motion and keyboard access (WCAG 2.2.2)
- [ ] **1.15b** Hovering pauses the spin, and leaving resumes it.
- [ ] **1.15c** A pause/play button. `prefers-reduced-motion` starts it paused.
- [ ] **1.15d** Each figure can be reached with Tab and opened with Enter.

**PR E2 · `feat/orrery-lamp`**: the theme picker becomes a pixel-art orrery (owner's pick, replaces the lantern; D23 keeps the logic). Sits in the gap between the page content and the stripes. **Art (1.14b, 1.14c) runs in parallel with PR F and Phase 2; the build (1.14d, 1.14e) comes after the early launch.**
- [ ] **1.14b** Art direction: concept sketch of the lamp, which body shows each theme (sun = Day, moon = night…), size (e.g. 48×48 px, shown at 2×), palette from the theme tokens. Owner approves before any sprite work.
- [ ] **1.14c** Pixel sprites: Claude drafts a base sprite; the owner refines it in Pixelorama or Aseprite (owner-made art for the public repo). Export PNG or SVG, metadata stripped.
- [ ] **1.14d** Build: swap the lantern `<svg>` and CSS section for the orrery in all 3 pages. Planets orbit in wrappers turned by `rotate` at different speeds; `image-rendering: pixelated`, integer scaling only, `steps()` for frame animation. On/off transition when the theme changes. `themcript.js` stays the same.
- [ ] **1.14e** Check: reduced motion (planets stand still), keyboard and name tag, every theme, phone to desktop. Make sure it never covers page text (on phones it reaches into the column, so a page starting with a long line needs room, e.g. a float on the first heading).

**Polish** (done at the phase close): *(add refinements to finished features here)*

**Phase close:** real-phone test over Wi-Fi (`python -m http.server 8000 --bind 0.0.0.0`), Lighthouse accessibility run.

## Phase 2: Content-ready templates

Goal: each page gets its final structure with clearly marked placeholder slots (`<!-- CONTENT: … -->`), so the owner can add real content later without touching layout code. Real content comes when the owner has gathered it.

- [ ] **2.1 About Me.** Bio, photo, the tools and years you've used them (joeydanna pattern).
- [ ] **2.2 Contact & Résumé.** Info page with a résumé PDF download. Email is shown in a spam-resistant way.
- [ ] **2.3 Code Portfolio.** Project cards with a status badge and tech chips (ashanand pattern).
- [ ] **2.4 Browse Art.** Responsive CSS-grid gallery for the art journals and photography.
- [ ] **2.5 CAD page sections.** Renders with captions plus a write-up link per project.
- [ ] **2.6 Bold bands** (D20): full-width page sections that alternate white, sand and pine, like a woodblock print. Same pattern as the header and footer: the band is the outer element, and `.wrapper` sits inside. Build them section by section as pages get content.
- [ ] **2.8 How to add content** (README): add a project, a photo, an art piece; image size, naming and metadata rules.
- [ ] **2.7 Retro labels.** Small uppercase labels with wider `letter-spacing` (the daz "ALL PROJECTS" look), plus a few early-web details (visible borders, monospace captions). Pick which ones then.

## Phase 3: Project display system (pluggable)

Goal: cool, unique ways to show the projects (carousel, film strip, spin reel), always next to one **streamlined** way for quick, accessible browsing. New displays are added without touching old ones.

Pattern: each display is a self-contained JS file that sets itself up on any container marked with `data-display="..."`.
```html
<div data-display="carousel"> <figure ...>...</figure> </div>
<div data-display="slideshow"> <figure ...>...</figure> </div>
```
- [ ] **3.1 Display loader.** A small script that finds `[data-display]` elements and calls the matching module.
- [ ] **3.2 Register the carousel.** Wrap the existing `projcript.js` logic as the first display, with minimal edits.
- [ ] **3.3 Slideshow display.**
- [ ] **3.3b Grid display: the streamlined version** (dazprojects pattern). The fast, plain, accessible way in, and the default for `prefers-reduced-motion`. Classic catalog grid: each project is an image on a pale tile, then its title and one short line of info (tools, year). CSS grid `repeat(auto-fill, minmax(…, 1fr))`: about 5 columns on desktop, 2 on phones, no media queries. Optional: a density toggle (big/small tiles) like daz's two icons. Each card is a real link (to the write-up from 2.5).
- [ ] **3.4 Lightbox/popup display** (reuses the sidebar popup idea).
- [ ] **3.5 Doc: "How to add a display"** in README.
- [ ] **3.6 Film strip display.** Projects are frames on a vertical strip of film (sprocket holes down both sides), drifting slowly up or down. Hover or focus pauses it, and clicking a frame opens it. Medium difficulty: CSS sprocket holes (`repeating-linear-gradient`), a seamless loop (the frames are duplicated once and `@keyframes` moves the strip by exactly one copy), and the duplicates are `aria-hidden` so screen readers don't hear each project twice. Fits the Filmography theme.
- [ ] **3.7 Spin reel display** ("pick a project"). Project cards stand in a ring around a vertical axis, each card's left vertical edge on the center, like a book opened all the way round (360°, a "star book" or "carousel book"). The selected card is the one pointing closest to the camera. Cards' images read best about 90° around the ring, so the chosen one's info pops up beside the reel. You spin it by hand, it ticks like a prize wheel as cards pass, and when it settles the chosen card's info pops up (image above, text below, like a bibliography entry). Medium-hard, so it is split up:
  - [ ] **3.7a Ring layout.** CSS 3D: `perspective` on the stage, each card `rotateY(angle)` with `transform-origin` on its inner edge (the spine), not `translateZ` like the carousel. Angles come from the card count.
  - [ ] **3.7b Spin by hand.** Pointer events (drag or swipe) set the speed, `requestAnimationFrame` slows it with friction, then it snaps to the nearest card. Arrow keys and Prev/Next buttons step one card, so it works without a mouse.
  - [ ] **3.7c Tick sound.** A short click from the Web Audio API (no audio file) each time a card passes the pointer. It starts only after the visitor touches the reel (browsers block autoplay), with a mute button that's remembered.
  - [ ] **3.7d Info card.** On settle, show the image above the title and description, read from the same `data-*` attributes as the carousel. Announce it with `aria-live`. Reduced motion: no spin, just step and show.
  *Inspired by the owner's memory of the Chaotic game's match-select wheel. Our own design and art, not a copy of the game's look. Sketch the camera angle before 3.7a.*
- [ ] **3.9 Phone mini-player** (was 1.16b, D16): tapping a figure shrinks the carousel and docks it to the left, like YouTube's mini-player, while the project info slides up. On phones the carousel **keeps spinning** (desktop still stops and faces the pick). Tapping the mini carousel or Close restores it. CSS `transform: scale()` + `transition`, and JS picks the behavior with `matchMedia`. Reduced motion (1.15c) keeps it paused. *Open question: can you pick another project from the mini carousel, or only restore it?*
- [ ] **3.8 Display switcher.** A small toolbar (Carousel · Film · Reel · Grid) above the projects. Each button swaps the `data-display` value and re-runs the loader from 3.1. The choice is remembered in `localStorage`, and the grid is the default.

## Phase 4: The museum

Design doc first (art style, room ↔ section map, controls), then build in small steps.

- [ ] **4.1 Design doc.** Rooms, layout sketch, palette, who draws the pixel art (you?).
- [ ] **4.2 One static room.** Small pixel-art images (found or drawn) scaled up with `image-rendering: pixelated` and placed with CSS. Doors are real `<a>` links, so the room works without JS. (ashanand.dev draws its room on a 480×270 `<canvas>` scaled up the same way, with SVG animations for the flames. We use images and HTML because they're simpler and more accessible.)
- [ ] **4.3 Movement.** A character that moves with keyboard, tap, or click, walks to a door, and enters it.
- [ ] **4.4 Room-to-room transitions.**
- [ ] **4.5 Grand clock.** A Da Vinci–style clock that uses `Intl.DateTimeFormat`. The city/time zone is a single setting the owner can change. Hands are rotated by CSS transforms.
- [ ] **4.6 Day/night lighting.** The museum lighting follows the theme picker (1.13, 1.14).
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

**🎨 Theme Studio**: a page where you pick fonts and colors from dropdowns (or drop in a theme file) and watch the site restyle live.
- **Step 1, easy (1–2 sessions).** `<select>` and `<input type="color">` controls call `document.documentElement.style.setProperty("--color-accent", value)`. Every page already reads the tokens, so it all updates at once. Fonts are limited to the self-hosted ones.
- **Step 2, easy.** Remember the theme in `localStorage`, and have `script.js` re-apply it on every page (same no-flash issue as 1.14). Changes are **per visitor**, not global.
- **Step 3, medium.** "Download my theme" (a `.css` file built with a `Blob`), and **drag and drop** a theme file back in (`dragover`/`drop` + `FileReader`). Security: never inject the dropped file as raw CSS. CSS can load outside URLs (`url()`, `@import`) and leak data. Read only `--color-*`/`--font-*` lines and check each value (`CSS.supports("color", value)`).
- **Global for everyone, hard, not planned.** That needs a server, a database and a login, or any visitor could restyle (deface) the site for everyone. GitHub Pages is static (D1). The simple global route: export the theme, paste it into `:root`, commit.
- **When.** After Phase 1, in The Laboratory. Pairs with the Code Lens experiment.

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
| D16 | On phones, a picked project docks the carousel as a spinning mini-player | Small screens can't fit the carousel and the info side by side; a familiar pattern keeps the gallery in view while you read |
| D18 | Header links split three and three around a centered logo; the logo is the Home link; "Project Finder" leaves the header until Filmography exists | Seven links on one side wrapped onto three rows even at 1440px; balanced sides make centering honest (same model as dazprojects.com) |
| D19 | Restyle toward dazprojects: white with cool highlights, replacing parchment as the site's day look | The owner prefers a sleek, white, catalog-style look; tokens make it a `:root` swap, not a rewrite. The museum (Phase 4) can keep a Renaissance palette inside its rooms |
| D20 | Color as full-width bands (header sand, footer pine, later page sections); the band is the outer element, `.wrapper` sits inside. Active words only change color plus fake bold, with no background: muted deep jade `#496962` in the light menu (the step from resting pine is about the same size as the footer's step from white to pale blue), kamenozoki `#A5DEE4` on the pine footer, gunjō `#3B5BA5` elsewhere. One color can't be readable on both light and pine. The owner wanted it subtle but noticeable, like the footer | "Vintage Japanese" needs more color than highlights. Bands reach the screen edge while text stays in the column. The owner disliked the box. A color change plus weight change is still visible to keyboard users (WCAG 2.4.7), and fake bold avoids shoving the neighboring links |
| D21 | 70s stripes as a striped `linear-gradient` background on `.site`, scaled with `clamp()`, inset from the window edge, on every screen. `.site-main` gets just enough right padding to keep text clear | The header and footer bands cover the background, so the stripes join both bands with no positioning code. No image or extra HTML. The `max()` padding only grows on screens with no empty margin |
| D22 | Three themes. `color-scheme: light dark` plus `light-dark(Day, Lantern)` on each role token; `:root[data-theme]` forces `color-scheme`, and Moss is one override block. Tokens split into a fixed **palette** (named colors, same in every theme) and **roles** (bg, accent, active…). Night palettes come from a rainy Japanese city at night and Sanzo Wada's *A Dictionary of Color Combinations* (owner's picks after comparing previews) | Each Day/Lantern color is written once, next to its twin, and only Moss repeats values. Role names stay true in every theme (a token called "gunjo" holding orange would mislead). Stripes use palette colors, so they never change. The neon glow is a night-only third shadow in `--faux-bold`. Very old browsers (pre-2024) ignore `light-dark()` and fall back to browser defaults |
| D23 | Theme picker = one `<button>` that cycles 4 states (Auto, Day, Lantern, Moss). Auto removes `data-theme` and the saved value. `js/themcript.js` is external and blocking in `<head>`. The lantern art is only the `<svg>` plus one CSS section | A cycling control is one honest button, so keyboard and screen readers work for free. "Auto" as the absence of a choice lets the OS take over live. External, not inline, so a strict CSP needs no hash. The art is swappable, so the orrery lamp can replace it without touching the logic |
| D17 | Skeleton and layout are separate PRs; keep the `#page` wrapper; the width cap is a reusable `.wrapper` class; two `rem` breakpoints | Smaller reviews; respects the owner's structure; a class can be reused, and the carousel can skip it when it needs more width; breakpoints give more control than fluid sizing alone |

## Open questions

- Pixel art source: which asset packs? Check licenses (CC0 is safest) at Phase 4.1.
- Which pixel font, accent color, and Renaissance palette?
- "Old school" = **both** (owner, 2026-11-03): the plain daz catalog as the base, plus retro details. 1.12c added the bands and 70s stripes. More details (monospace labels and so on) are 2.7.
