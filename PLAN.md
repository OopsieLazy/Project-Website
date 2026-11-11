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

## Roadmap at a glance (rebuilt 2026-11-07, D27)

The order we follow. Each step finishes before the next starts; only the drum's sprite art runs alongside.

| Step | Phase | What it gets you | Status |
|---|---|---|---|
| 1 | 0–1: Foundation, responsive shell | Clean repo, tokens, header, themes, carousel on phones | ✅ |
| 2 | 2: Content-ready templates | Every page exists, with its layout and `CONTENT` slots | ✅ |
| 3 | **R: Refinement** | Each page, from Home down, made to look like the finished portfolio; every leftover finished, filled or removed | ▶ now |
| 4 | L: Launch | Live on GitHub Pages, ready to send to recruiters | next |
| 5 | 3: Project displays | Film strip, spin reel, grid, display switcher | after launch |
| 6 | 4: The museum | The walk-through signature feature | after launch |
| ∥ | Theme drum (1.14b–e) | Built 2026-11-08 (D35); only the sun and moon sprites (1.14c) remain | built |

**Guardrail:** Phase R refines what exists; it doesn't add features. New ideas go into Experiments, undated. A Phase 3 or 4 item moves forward only when a page can't be finished without it (e.g. 3.10 for the CAD page) and the owner says so.

**Where does a note go?** Ask "which page is it about?"
- A page **not yet refined** → that page's R task, for its audit.
- A page **already refined** → Phase R's *Polish* line, done in one pass before launch.
- A **new idea** → Experiments, undated.
Each change still goes **works → right** (layout, keyboard, phones) **→ nice** (motion, polish).

## ▶ Where we left off (update at the end of every session)

*Last session: 2026-11-11*
- **Branch:** `feat/sleek-catalogs` (the Sleek pass). Phase R (refinement) still comes before Phase L (launch). Collect 3–4 commits per PR (owner, 2026-11-09). Dice rolls are paused at the owner's request (2026-11-10) until they say to roll.
- **Merged:** #33 R3 Code catalog (D40), the "you are here" nav marker, `--step--2`, Home stack fix.
- **Built 2026-11-11 (uncommitted):** the Sleek pass, owner's picks after the dazprojects comparison: Home tiles (C), Code quiet paper (B), CAD tidy (B). Tested in Day and Night at 320 / 360 / 800 / 1000 / 1440, no JS errors, validator 0.
- **Next:** owner commits and opens the PR. Then R4 Browse Art (audit first). `data/code.json` is still Claude's wording, with no `handWritten` set: owner to review when ready.
- **Polish rule (owner, 2026-11-10):** each polish item gets a done definition first and at most two preview rounds.
- **Recruiting readiness:** résumé and real email are live. Blocking: not hosted; End Stop Cap and Latch Hinge stats are made up; Art is 56 placeholders. Each R task lists its page's content.
- **Owner habits:** end every PR with the full git command list (CLAUDE.md). After editing `contact.html` text, regenerate the contact-sheet PDF (README).
- **Merged so far:** #1 hygiene, #2–#10 and #14–#15 Phase 1, #11–#21 Phase 2, #22 CAD sheets, #23–#25 R1, #26–#31 R2 prep, résumé, page-top, thumbwheel, gallery, #32 R2d/R2e carousel and popup.
- **Design reference:** https://dazprojects.com/collections/all (white, hairlines, centered logo, catalog grid), with our own fonts (Cinzel, Instrument Sans). Reference photos live in the git-ignored `references/` folder. Delete the old backup bundle once happy.

## Phase 0: Foundation cleanup ✅

Done. Organized folders, URL-safe image names, `index.html`, relative links, a valid header, `.gitignore`, and 0 W3C errors.
Info notes left on purpose: the empty popup `<h2>` (JS fills it), the carousel `<section>` with no heading, and the `/>` in `thelab.html`.

## Phase 1: Responsive shell ✅

Done, closed 2026-11-04 (real-phone test and a Lighthouse accessibility run, both clear). PRs #2–#10, plus #14 and #15: design tokens and self-hosted fonts, the page skeleton and `.wrapper`, the adaptive header and footer, the dazprojects restyle with color bands and 70s stripes, three themes with the lantern picker, and the CAD carousel fitted to phones (popup, pause button, keyboard, frame-rate-independent spin, tilted ring). The reasons live in the decision log (D11–D24) and the merged PRs.
**QA checklist for every PR:** DevTools 320 / 375 / 768 / 1024 / 1440 px, drag-resize the window, Tab through with the keyboard, W3C validator.

**Parked from Phase 1:**

**Theme thumbwheel ✅ (frozen 2026-11-10).** 1.14b–e done in #29 and #31: a ridged drum under the logo that works as a smooth dimmer. The why is in D35–D38 and the comments in `themcript.js` and the THEME DIMMER section of `styles.css`.
- [ ] **1.14c** Sprites: the owner draws the sun and moon (pixel art, about 22 × 22, PNG or SVG, metadata stripped). They replace the two `<g>` groups in the drum's `<svg>` (drawn around 0,0). Stand-in shapes until then. **The only theme work left before launch.**

**Polish** (done at the phase close): *(add refinements to finished features here)*
- [x] Theme lantern ran 8 px into the "CAD's Creations" `<h1>` between ~330 and 340 px wide (measured by sweeping every page 300–640 px; only this page). Fixed in `feat/cad-restyle`: on phones that heading keeps a lantern-sized gap.

## Phase 2: Content-ready templates ✅

Done 2026-11-06, PRs #11–#21. Every page now has its layout and `<!-- CONTENT -->` slots:
- **Home** (2.0a–c): the hero; projects written once in `data/projects.json` (D26); the card stack.
- **About** (2.1): an encyclopedia layout, with the card moved to the shared `cardyles.css`.
- **Contact** (2.2): a drawing title block. JS builds the email, adds a Copy button, and the card drags out as a PDF.
- **Code** (2.3): library catalog cards with status dots.
- **Art** (2.4): a salon hang, with the tilt tokens `--salon-tilt` / `--salon-nudge`.
- **CAD sections** (2.5): an index plus entries built from the JSON.

The reasons live in the merged PRs, D25–D26 and the code comments.

**Moved 2026-11-07:**
- 2.6 bold bands and 2.7 retro labels → R1 (site-wide decisions).
- 2.8 how to add content → R7.
- 2.9 CAD files → R2 (or after launch if the files aren't ready).
- The design pass became Phase R. Its first item, the CAD drawing sheets (#22), counts toward R2.

## Phase R: Refinement (before launch)

Goal (owner, 2026-11-07): go through the site page by page, from Home down, refining HTML, CSS and graphics until each page looks like the portfolio the owner needs. **Nothing ships untouched:** every placeholder, `#` link, test caption, made-up fact and parked block is **finished, filled or removed**.

**Every page goes through the same five steps:**
1. **Audit** (Claude). Screenshots in Day and Lantern at 320 / 768 / 1440 px, plus a list of every leftover on the page. Nothing changes yet.
2. **Owner's notes.** 3–5 things to change, and *finish / fill / remove* on each leftover.
3. **Previews.** Lettered options for each look change; the owner picks.
4. **Build.** Branch `feat/refine-<page>`, in PRs of 1–3 tasks (split a big page). Content the owner already has goes in now.
5. **Done** when the page meets the bar below. Tick it here.

**Page done bar:**
- No `#` links, placeholder images, test captions or made-up facts. Whatever isn't ready by launch is hidden or removed, not left visible.
- Every image has `alt` and `width` / `height`, and `loading="lazy"` below the fold. Each is compressed (WebP where it helps) and metadata-stripped (was 5.4). `width` / `height` let the browser reserve the space, so the page doesn't jump while loading, and phone photos carry GPS until stripped.
- The QA checklist (Phase 1) passes, contrast holds in all three themes, and the W3C validator shows 0 errors.
- `<!-- CONTENT -->` comments stay only where the owner fills in text later.

- [ ] **R1 Home + shared shell** (`index.html`). Built 2026-11-07/08 in R1a (shell: Lab hidden, footer, one spelling of "Contact and Resume"), the logo (S1, "ZN" in Sacramento as outlines), Home's first pass (H1, H4, H7, S5 `.retro-label`), the footer (D28) and R1b retro boxes (D29). Details: the merged PRs #23–#25 and the code comments. 2026-11-10: "you are here" nav marker (`aria-current`), and the card stack clears the theme wheel (`--stack-rise`).
  - **Owner content:** re-export the renders square on one background (biggest visual win); real stats for End Stop Cap and Latch Hinge, or the cards are trimmed to what's true.
- [ ] **R2 CAD Portfolio** (`projects.html`). Planned 2026-11-08 (owner), one PR each:
  - [x] **Contact card drags out as a PNG** (D30, `fix/contact-drag-png`). Sets up the picture method the kits reuse.
  - [x] **Whole boxes drag out** (2026-11-08, owner): Home boxes, featured cards and CAD entries, through `dragOutProject()` in `datacript.js`. Inner images and links get `draggable = false`, so a drag that starts on them moves the whole box. Drops the cover image until R2c adds kits. Trade-off: text inside a draggable box can't be selected with the mouse.
  - [x] **R2a Gallery** (D33, built 2026-11-09 in `feat/project-images`): `images[]` in `projects.json` (`src`, `alt`, `kind` "cad"/"photo", `caption`); sectcript's `buildGallery()` shows one big picture with its CAD/Photo tag and caption, plus 48px thumbnail buttons (`aria-pressed`) once there are two or more. `image` stays the cover for cards and boxes; a project without `images` falls back to it. New photos go in `assets/images/<id>/`.
  - [x] **Pictures fill their frames** (2026-11-09): `object-fit: cover` on Home and the CAD page (crops evenly, never stretches), and the picture sits 2px inside the dashed line (Home `padding: 2px`, CAD `calc(0.5rem + 2px)`), because at some widths the box lands between pixel rows and a picture filling it covered the top line. Best results: square 1600px exports with the part in the middle 75% (README).
  - [ ] **R2b Project pages** (D31; **after launch**, owner 2026-11-10): `sheet.html?id=<id>` + `sheetyles.css` / `sheetcript.js`, filled from the JSON, Wikipedia-style like About: infobox, Contents, Background · Design · Iterations · Printing · Result, Downloads, References. Home boxes and CAD entries link to it. Unknown id → "Project not found".
  - [ ] **R2c Kits** (D32; **after launch**, owner 2026-11-10): each project's box drags out as `<id>-kit.zip` (sheet PNG + PDF, manual, `files/`, `LICENSE.txt`), plus a "Download kit (.zip)" link for keyboards and other browsers. The drag code moves from `contcript.js` to `datacript.js`.
  - Done early (owner, in R1a): crop marks on **all four corners** of each entry image. One `::before` paints eight solid-gradient bars.
  - [x] **The owner's parked blocks** `.larger-projects` and `.item-image-block`: removed 2026-11-08 (find them with `git log -S larger-projects`), idea kept as 3.10 in Experiments (owner, 2026-11-08). The code stays in git history.
  - **Audit 2026-11-10** (Day and Night, 320 / 768 / 1440). Owner marks each *finish / fill / remove*. The owner opened the carousel and popup to changes (2026-11-10):
    - [x] **R2d Carousel look** (built 2026-11-10, D39; owner: "similar graphics/HUD as the projects below"). The ring is a sheet framed like the entries; each project is a small sheet with a crop-marked viewport and a DWG label; backs show blank paper; the phone fit math went from 68px to 104px sheets. Audit items, all fixed:
      - C1 6 of 9 figures are placeholders (one says "Coming soon"). Option: pull 3.2 forward so the ring shows only the real projects from `projects.json` (also fixes C2, and the titles stop living in two places).
      - C2 Bridge Guitar and Latch Hinge have no `data-title`, so their popup is only a picture.
      - C3 The back of the ring shows mirrored "Placeholder" text (`backface-visibility` is visible).
      - C4 Two looks mixed: grey render squares next to beige grid cards.
      - C5 Image zoom is tied to position (`nth-child(2–4)` scale 1.4 / 2.4): reorder or add a figure and the wrong picture zooms.
      - C6 About 150px empty above the ring and 200px below at 1440; Play spin floats alone at the top.
      - C7 At 320 the figures are 68px wide, too small to recognise a part.
    - [x] **R2e Popup** (built 2026-11-10; owner: "light summary, not the whole card"): DWG number, Close, title, type · year · tool, one sentence and "Full drawing ↓". The picture is on the front sheet and the stats in the full entry. Close and Escape glide the carousel back into view (on phones it used to land on "All projects"). Audit items, all fixed:
      - P1 Hard-coded Georgia and px sizes (20 / 14 / 13) instead of tokens; Close is a browser-default underlined serif.
      - P2 The slide animates `grid-template-rows`, which recalculates the layout every frame; `transition: all` on the figure images. Aim: `transform` + `opacity` only.
      - P3 Shows a title and one line, with no link to the project's full entry (or its R2b page later).
      - P4 Opening it doesn't move focus or tell a screen reader anything changed.
    - **Page:** ~~G1 tab title "Projects"~~ → "CAD Portfolio · Zach Nott". G2 the intro is 14 lines on a phone (**owner's text**). ~~G3 empty 4th index cell~~ (`auto-fit`). ~~G4 leftover comment after `</html>`~~.
  - **Owner content** (✱ blocks launch): ✱ real stats for End Stop Cap and Latch Hinge (made up 2026-11-05); ✱ the intro paragraph and tab title; ✱ one square render each (same angle, same background); photos (hero, in use, close-up, scale, iteration lineup), EXIF/GPS stripped; write-up notes (problem, what changed per version, print settings); files to share; MakerWorld links; references.
  - **Kit rules:** metadata stripped (STEP headers can hold your user name and folder paths, 3MF holds slicer profiles); each kit under ~20 MB, since git keeps every version forever; bigger models link to MakerWorld instead.
- [ ] **R3 Code Portfolio** (`code.html`). Audited 2026-11-10 (Day and Night, 320 / 768 / 1440); the owner's calls are below.
  - [x] **Cards from the owner's GitHub** (owner's pick): MyWeb, INV.OS, GEX Terminal, AUDA in place of the two placeholders. One-liners, tools and statuses were drafted by Claude from each README and are marked `CONTENT` until the owner rewrites them.
  - [x] **Fixed:** MyWeb's Source link was a 404 (the repo is now `Project-Website`). Cards go two per row from 18rem, so a 768px tablet no longer shows one wide, empty card.
  - [x] **"You are here" in the nav** (all six pages): the current page's header and footer links carry `aria-current="page"` and get the hover look (D20). Screen readers say "current page".
  - [x] **`--step--2` token** (CSS tidy; owner handed it to Claude): one size for chips and tags in place of 0.7 / 0.75 / 0.78rem.
  - [x] **Fix (Home):** the card stack's back cards reached up to the theme wheel at 1920px+ (`translate`/`rotate` take no layout space). `--stack-rise` in `homyles.css` now reserves the room.
  - **Code catalog** (owner, 2026-11-10; D40), built 2026-11-10 on this branch (owner: finish before committing), preview A. Tested: open/close, Esc, focus moves to the back and back again, the hidden face is `inert`, no JS errors; 320 / 768 / 1440, Day and Night:
    - [x] **K6** Status colours (live green filled, in progress amber half, archived grey empty ring) as tokens, and every `codyles.css` value as a named token at the top of the file.
    - [x] **K7** `data/code.json` + `js/codcript.js` build the cards (like D26), every local and public project the owner keeps. Private repos get no Source link ("Private repo").
    - [x] **K8** Flip cards: small fronts (title + one line); click flips the card and grows it to two columns with the full entry; click or Esc flips back; reduced motion skips the spin.
    - [x] **K9** Featured row: bigger cards first (TTask, YouScape, GooeyThang, Voice Assistant and more, via `"featured": true`), optional "hand-written" stamp for projects from before AI (`"handWritten": true`).
    - [x] **K10** (owner, same day) Every card flips, Featured included (just bigger); a click anywhere on an open back flips it over again (links still work). **Paper look A** after previews A/B/C: cream card stock in both themes (`--color-cardstock`, `color-scheme: light` on the card), SVG grain, layered desk shadows, a slight tilt that straightens when opened. Two `@property` colours keep the punched hole and focus ring in the PAGE's colours. All values are tokens at the top of `codyles.css`.
  - **Owner content:** ✱ rewrite the intro and the drafted one-liners in your words; ✱ confirm each status; ✱ which projects are featured and which were written before AI; which projects to leave out; a README for AUDA; the Live link for this site after L3.
- [ ] **R4 Browse Art** (`art.html`)
  - Replace the 56 placeholder pieces with the owner's images (EXIF/GPS stripped).
  - The intro line, and tune the tilt tokens.
  - If the art isn't ready by launch, the page leaves the nav.
- [ ] **R5 About Me** (`aboutme.html`)
  - The card photo.
  - [x] City, Background, Education and tools from the résumé (2026-11-08). **Owner to confirm the tool years** (6/6/5 are estimates from résumé dates) and the CAD-since year (2019, while university began 2020).
  - GitHub / LinkedIn.
- [ ] **R6 Contact & Résumé** (`contact.html`). The style stays (owner, 2026-11-06).
  - [x] The real email (owner, 2026-11-08, in `fix/contact-drag-png`).
  - [x] City (from the résumé). Status still to confirm: internships, or design and fabrication roles?
  - [x] The résumé (2026-11-08): `assets/docs/zachery-nott-resume.pdf`, a public copy rebuilt from the owner's master with no health detail, clickable links and clean metadata. The contact button downloads it (and drags out); the Home hero button opens it. **Owner:** make the same edits in the Google Doc master, so the next export matches.
  - GitHub / LinkedIn.
  - Regenerate the contact-sheet PNG and PDF after any text change (README).
- [ ] **R7 How to add content** (was 2.8, README). How to add a project, a photo and an art piece, plus image size, naming and metadata rules. Written last, once the patterns are final.

**Polish** (refinements to pages already done):
- [x] **Page-top gap** (2026-11-08, owner handed it back): every page's content starts `--page-top` below the header (D34): 60px on phones, 72 at 1280, 80 max. Measured on all six pages at 320–1440: identical, 0 lantern overlaps.
- [x] **CSS tidy** (2026-11-10, `feat/refine-code`). Checked 2026-11-10: no `transition: all` or stray font families are left; the only gap is 4 font sizes below the type scale, which `--step--2` covers (R3). Art's frame colours and the card's blueprint whites stay as local, named values (materials, not roles).
- [x] **Sleek pass** (owner, 2026-11-10, after comparing with dazprojects; mock-ups A/B/C per page). Built 2026-11-11 in `feat/sleek-catalogs`. What makes daz sleek: one picture style, nothing around each item, one font, a tight even grid.
  - **Home catalog: C.** Tiles (picture on a pale square, name, one meta line; no border, dashed frame or shadow), names in Instrument Sans, and a wider catalog on Home only (Code and CAD keep today's width). 3 tiles stretch to fill the row.
  - **Code: B "quiet paper".** Tilt tokens to 0, no grain, no red rule, one soft shadow, fainter ruled lines, the "Flip" hint only on hover. Mono titles stay.
  - **CAD: B "tidy".** Remove the repeated name row (`#cad-index`); stats as one line ("8 iterations · 5 parts · 6 h print · ★★★★"). Built with the dot after each stat, so a wrapped line never starts with one, and singular labels ("1 part"). Cinzel titles stay.
  - Biggest win is content, not CSS: renders in one style (same angle, background, square) and app screenshots for the Code cards.

## Phase L: Launch

**Launch bar** (all true before the link goes to anyone):
- Phase R is done: every nav link leads to a refined page, or the link is gone until it does.
- Real name, email, résumé, GitHub and LinkedIn. No made-up project facts.
- L1 and L2 are merged. The validator shows 0 errors. Lighthouse accessibility and a real-phone test pass on the live URL.

- [ ] **L1** `chore/launch-basics` (was 5.3):
  - Real page titles and the footer name.
  - Favicon (stripe A).
  - Open Graph preview tags.
  - `.nojekyll`.
- [ ] **L2** `feat/csp-404` (was 5.2):
  - A CSP via `<meta>`, because GitHub Pages can't set headers.
  - `rel="noopener noreferrer"` on external links.
  - An `innerHTML` audit.
  - A plain `404.html` with the site header (4.2 dresses it up later).
- [ ] **L3 Go live** (owner, was 5.1):
  - Turn on GitHub Pages.
  - GitHub settings: the ruleset is done ✅. Still to do: secret scanning and push protection, Actions read-only, wiki off, "Automatically delete head branches".
- [ ] **L4 Audit** (was 5.5): Lighthouse, plus a real-phone test on the live URL.
- [ ] **L5 Custom domain** (optional, was 5.6). `.dev` requires HTTPS, which GitHub Pages provides.

## Phase 3: Project display system (pluggable)

Goal: cool, unique ways to show the projects (carousel, film strip, spin reel), always next to one **streamlined** way for quick, accessible browsing. New displays are added without touching old ones.

Pattern: each display is a self-contained JS file that sets itself up on any container marked with `data-display="..."`.
```html
<div data-display="carousel"> <figure ...>...</figure> </div>
<div data-display="slideshow"> <figure ...>...</figure> </div>
```
- [ ] **3.1 Display loader.** A small script that finds `[data-display]` elements and calls the matching module.
- [ ] **3.2 Register the carousel.** Wrap the existing `projcript.js` logic as the first display, with minimal edits. ~~Its figures come from `projects.json`~~: done early in R2d (D39).
- ~~**3.3 Slideshow** and **3.4 Lightbox**~~: cut (2026-11-05). The popup and the grid already cover them.
- [ ] **3.3b Grid display: the streamlined version** (dazprojects pattern). The fast, plain, accessible way in, and the default for `prefers-reduced-motion`. Classic catalog grid: each project is an image on a pale tile, then its title and one short line of info (tools, year). CSS grid `repeat(auto-fill, minmax(…, 1fr))`: about 5 columns on desktop, 2 on phones, no media queries. Optional: a density toggle (big/small tiles) like daz's two icons. Each card is a real link (to the write-up from 2.5).
- [ ] **3.5 Doc: "How to add a display"** in README.
- [ ] **3.6 Film strip display.** Projects are frames on a vertical strip of film (sprocket holes down both sides), drifting slowly up or down. Hover or focus pauses it, and clicking a frame opens it. Medium difficulty: CSS sprocket holes (`repeating-linear-gradient`), a seamless loop (the frames are duplicated once and `@keyframes` moves the strip by exactly one copy), and the duplicates are `aria-hidden` so screen readers don't hear each project twice. Fits the Filmography theme.
- [ ] **3.7 Spin reel display** ("pick a project"). Project cards stand in a ring around a vertical axis, each card's left vertical edge on the center, like a book opened all the way round (360°, a "star book" or "carousel book"). The selected card is the one pointing closest to the camera. Cards' images read best about 90° around the ring, so the chosen one's info pops up beside the reel. You spin it by hand, it ticks like a prize wheel as cards pass, and when it settles the chosen card's info pops up (image above, text below, like a bibliography entry). Medium-hard, so it is split up:
  - [ ] **3.7a Ring layout.** CSS 3D: `perspective` on the stage, each card `rotateY(angle)` with `transform-origin` on its inner edge (the spine), not `translateZ` like the carousel. Angles come from the card count.
  - [ ] **3.7b Spin by hand.** Pointer events (drag or swipe) set the speed, `requestAnimationFrame` slows it with friction, then it snaps to the nearest card. Arrow keys and Prev/Next buttons step one card, so it works without a mouse.
  - [ ] **3.7c Tick sound.** A short click from the Web Audio API (no audio file) each time a card passes the pointer. It starts only after the visitor touches the reel (browsers block autoplay), with a mute button that's remembered.
  - [ ] **3.7d Info card.** On settle, show the image above the title and description, read from the same `data-*` attributes as the carousel. Announce it with `aria-live`. Reduced motion: no spin, just step and show.
  *Inspired by the owner's memory of the Chaotic game's match-select wheel. Our own design and art, not a copy of the game's look. Sketch the camera angle before 3.7a.*
- [ ] **3.9 Phone mini-player** (was 1.16b, D16): tapping a figure shrinks the carousel and docks it to the left, like YouTube's mini-player, while the project info slides up. On phones the carousel **keeps spinning** (desktop still stops and faces the pick). Tapping the mini carousel or Close restores it. CSS `transform: scale()` + `transition`, and JS picks the behavior with `matchMedia`. Reduced motion (1.15c) keeps it paused. *Open question: can you pick another project from the mini carousel, or only restore it?*
- [ ] **3.10 CAD featured area** (owner, 2026-11-07): the owner's two placeholder blocks above the CAD entries (`.larger-projects` "growing style, where you see part and expands to image or project view", and `.item-image-block`) become a featured area: projects with `"featured": true` in `projects.json` shown large, each showing a detail first and growing into the full image or the project entry on click. Built as a display (3.1 pattern), so it can be reused. **R2 decides:** built during refinement, or the blocks are removed and this waits.
- [ ] **3.8 Display switcher.** A small toolbar (Carousel · Film · Reel · Grid) above the projects. Each button swaps the `data-display` value and re-runs the loader from 3.1. The choice is remembered in `localStorage`, and the grid is the default.

## Phase 4: The museum

Design doc first (art style, room ↔ section map, controls), then build in small steps.

- [ ] **4.1 Design doc.** Rooms, layout sketch, palette, who draws the pixel art (you?).
- [ ] **4.2 One static room**, first used as `404.html` ("lost in the archives"): a low-stakes place to try the art. Small pixel-art images (found or drawn) scaled up with `image-rendering: pixelated` and placed with CSS. Doors are real `<a>` links, so the room works without JS. (ashanand.dev draws its room on a 480×270 `<canvas>` scaled up the same way, with SVG animations for the flames. We use images and HTML because they're simpler and more accessible.)
- [ ] **4.3 Movement.** A character that moves with keyboard, tap, or click, walks to a door, and enters it.
- [ ] **4.4 Room-to-room transitions.**
- [ ] **4.5 Grand clock.** A Da Vinci–style clock that uses `Intl.DateTimeFormat`. The city/time zone is a single setting the owner can change. Hands are rotated by CSS transforms.
- [ ] **4.6 Day/night lighting.** The museum lighting follows the theme picker (1.13, 1.14).
- [ ] **4.7 Accessibility.** "Skip the museum" link, `prefers-reduced-motion`, focusable doors.

## Later (planned, not scheduled)

- The Laboratory: real design based on the `thelab.html` experiment.
- Contact form: a form service (e.g. Formspree) plus a honeypot field against spam bots.
- Filmography: lazy-loaded video embeds (`youtube-nocookie.com`).
- Shared header injected by JS instead of copied (D3 step b).

## Experiments

**🃏 Card stack** (owner, 2026-11-04; **built in 2.0c**, left here as the design note): the home page's featured project as a stack of cards, with the other projects fanned out behind it and peeking at the top-right corner. Clicking a corner brings that card to the front; clicking the front card opens the project. Prototyped in a scratch preview during 2.0.
- **How.** Each card is a `<button>` with `data-pos` (0 = front); CSS places each position with `translate` + `rotate` and `z-index`, so JS only renumbers positions. Reduced motion: no transition. The caption is `aria-live` so screen readers hear the new title.
- **When.** Built in 2.0c as `setupStack(container)`; Phase 3 registers it as a display (`data-display="stack"`).
- **Look.** Trading-card style (owner's references kept in the git-ignored `references/` folder; copyrighted, never committed): name banner, art window, CAD stat column (iterations, parts, print hours, difficulty), type line, text box, version badge, year. Our own frame design, no copied symbols or art.
- **Featured = a JSON flag** (D26): projects with `"featured": true` become cards; the rest stay in the catalog, so the stack never overflows.

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

**🧲 Drag it out** (owner, 2026-11-06): drag a file straight off the site, onto the desktop or into an app. Inspired by blender.org/lab/mcp-server's "Drag and Drop into Blender" button.
- **How Blender's works.** The button is (as far as the page shows) a plain `<a href>` to the add-on's `.zip`, with extra query parameters: `?repository=https://lab.blender.org/&blender_version_min=5.1.0`. Browsers make every link draggable, and the drag carries the URL (`text/uri-list` / `text/plain`); no JS needed. Blender listens for URL drops: it reads `repository=` (first drop: "add this repository?"), then installs the `.zip` (second drop), and later checks that repository for updates. The magic is on Blender's side, not the web page's.
- **Link onto the desktop: no, not by itself.** Dropping an ordinary link on the desktop makes a *shortcut* to the URL (`.url` on Windows, `.webloc` on Mac), not the file.
- **The real file: `DownloadURL`** (Chrome and Edge only, non-standard). On `dragstart`: `event.dataTransfer.setData("DownloadURL", "application/pdf:resume.pdf:" + new URL(link.href, location.href))` (format `mime:filename:absolute-url`). Dropping on the desktop or a folder then downloads the actual file there. Firefox and Safari ignore it and fall back to a shortcut, so the link must still work as a normal click download (`download` attribute).
- **Built on the contact page** (`feat/contact-drag-out`): the whole title-block card drags out (as a PNG since D30); the résumé button joins in once it points at a real PDF; a keyboard-only link saves the PDF without dragging. **Project kits:** R2c (D32).
- **Security.** Only our own same-site files; build the URL from our JSON paths, never from visitor input; set the right MIME type; strip metadata from anything offered (D15).
- **Testing.** The drag data is checked by script; the actual drop onto a desktop has to be tried by hand (a real mouse drag can't be automated headlessly).

**🧵 MakerWorld import** (owner, 2026-11-07; a separate tool, later): copy your own models from MakerWorld (titles, descriptions, images, print counts) into `projects.json` once, instead of retyping them.
- **Why not live on the site:** MakerWorld has no public API, refused an automated fetch (HTTP 403), and our static site can't read another site's pages anyway (cross-origin rules). So the site keeps a hand-written `makerworld` link per project.
- **Safest way: run it inside your own browser.** A small script you paste into DevTools while logged in on your profile page. It reads what the page already shows and copies JSON. No cookies leave the browser, and there's no bot to block. Rule: only paste code you've read (pasting unknown code is how "self-XSS" scams work).
- **Not recommended:** a standalone app that reads Firefox's cookie file. That file holds your logged-in session: anything that copies it can act as you, and it must never touch the repo. If a separate app is ever needed, use browser automation (e.g. Playwright) where you log in by hand in a visible window.
- **Either way:** it's a one-off, at a gentle pace, and only for your own models. Check MakerWorld's terms first. The output is a draft you review; images get metadata stripped like any photo (D15).

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
| D24 | Carousel keyboard access: a `<button>` inside each `<figure>` (owner's pick over `tabindex` + `role`). The spin has three separate stop flags (picked figure, Pause button, hover) that `animate()` checks together. The pause button's label changes ("Pause spin" / "Play spin") with no `aria-pressed` | A native button gives Tab, Enter, Space and the "button" role for free (first rule of ARIA). Separate flags stop one reason from cancelling another (leaving with the mouse can't undo the Pause button). A label plus `aria-pressed` would read "Play spin, pressed", which contradicts itself |
| D25 | Home: B split hero + catalog, Blueprint trading cards. The card's paper is a local `--card-paper: light-dark(pine, blueprint blue)`, so it matches the footer by day and is blue in both night themes. Catalog tiles get a retro hard border | Owner's picks after comparing previews. Pine by day ties the card to the footer and the primary button; blue reads as a real blueprint at night. One local variable keeps the choice in one place. Linework passes on both (6.9 / 9.1) |
| D26 | Projects live once in `data/projects.json`; page scripts `fetch()` it and build the HTML with `createElement` + `textContent`. Derived values (card number, `v` badge, stars) are computed, not typed. The carousel moves over in 3.2 | One source of truth: a project typed in three places drifts apart. Building with `textContent` keeps it XSS-safe (D7). Trade-off: content needs JS (a `<noscript>` link covers it) and a local server (`file://` blocks `fetch`) |
| D27 | Refinement (Phase R) before launch: page by page from Home down, five fixed steps per page, and nothing ships untouched (finish, fill or remove). A written launch bar opens Phase L. Phase 3 and 4 wait until after launch | Owner, 2026-11-07, with recruiting as the goal. Recruiters judge a dead link or a grey placeholder more harshly than a page that isn't there. One page at a time keeps each PR reviewable, the same steps each time make progress easy to see, and the launch bar gives the launch postponed on 2026-11-05 a finish line |
| D28 | Footer: one set of markup with two layouts. Phones get labelled groups on a 2-column grid (preview A); from 40rem everything is centered rows with the labels visually hidden (preview B). `display: contents` on `.footer-extras` lets the same wrapper be two grid cells on phones and one dotted row on wider screens | Owner's pick after comparing previews A/B/C. Labels help on a narrow stacked phone footer, where links would otherwise look scattered; on wide screens one centered column matches the dazprojects reference. One markup means the six copied footers stay identical |
| D29 | Home catalog: retro boxes in alternating full-width rows up to 5 projects, a tile grid from 6 (`:has(> li:nth-child(6))`). Each name is an `<h3>` link stretched over its box with `::after` | Owner's pick B after comparing A/B/C. Rows with descriptions read well while there are few projects; a grid keeps many from becoming a long scroll, and pure CSS means adding a project to the JSON is the only step. A stretched name link keeps the box clickable while screen readers hear a short link name, and `<h3>`s let them jump between projects |
| D30 | The contact card drags out as `contact-sheet.png`, a 2× screenshot of the card as it looks by day. The keyboard link keeps the PDF | A picture gets a thumbnail on the desktop; a PDF shows whatever app opens PDFs (Chrome's icon here). PNG, not JPEG: JPEG blurs text and thin lines. The PDF keeps clickable links for anyone who wants them |
| D31 | Project pages: one template, `sheet.html?id=<id>`, filled from `projects.json` | Each project is typed once and there's one more header copy, not one per project. The `id` only looks a project up and goes in with `textContent` (D7). Trade-off: shared links preview the site's title, not the project's; static pages can come later if that matters |
| D32 | Project kits: one `.zip` per project, as the drag payload and a download link. Licence CC BY-NC 4.0, in the kit (code stays MIT, the rest all rights reserved) | `DownloadURL` carries one file per drag, so several files need an archive. A zip can't show a preview: the desktop draws its own icon per file type. CC BY-NC is the common MakerWorld licence: people may print and remix with credit, but not sell |
| D33 | Several images per project in `images[]`, each tagged `cad` or `photo`, in `assets/images/<id>/` | "Modelled → printed and working" side by side is the strongest proof for a recruiter. A folder per project keeps dozens of photos findable; `image` stays the single cover |
| D34 | One `--page-top` token (`clamp(3.75rem, 2.5rem + 2.5vw, 5rem)`) sets where every page's content starts; page files add no top space of their own. The header ornament must fit inside it | Owner's pick B after comparing previews: about the lantern's length, but as a design value of its own. Before, CAD sat at 64px and the rest at 112–130px because each page added its own margin. Reversing the dependency (the lamp fits the gap, not the gap the lamp) means the orrery can replace the lantern without moving any page |
| D35 | The theme picker is a thumbwheel centred under the logo: a ridged drum with the sun and moon printed on it, turned like a volume knob between two ends with three click-stops (Day, Auto, Night). A `<button>` (tap, Enter, Space = next stop) plus drag/flick (pointer events) and ← →; the theme changes when it lands. Labels Auto / Day / Night; the night theme's code name stays `lantern` | Owner's design after previews A–F (an orbit, then a windowed drum, then this). A knob with ends is easy to understand: you can't get lost spinning. A native button keeps keyboard and screen readers working for free. Keeping the code name `lantern` avoids renaming every CSS selector for a label change |
| D36 | The Moss theme is removed: two themes (Day, Lantern) plus Auto. Its colour block is gone from `styles.css`; a visitor who had saved "moss" falls back to Auto, because `readSavedTheme()` only trusts known names | Owner, 2026-11-08. With the orrery holding only a sun and a moon, a third theme had no body of its own. Fewer themes also means half the contrast checks for every change. D22 and D23 stay as the history of why there were three |
| D37 | Brightness slider, option C: only decoration blends with the slider (stars, stripes, sun and moon, footer); the page and the header switch between Day and Night at the halfway point with a short crossfade | Owner's pick after mock-ups A–C with live contrast numbers. Blending everything drops text to 1.1:1 halfway; a safe blend can only dim the day page 12% before grey text fails. The header holds the menu links, so it switches with the page. Every word stays at 4.5:1 or more |
| D38 | The thumbwheel is a smooth dimmer: its position is `--dim` (0 Day to 1 Night) on `<html>`. The stripes (toward their inverted colours, mixed `in oklch`), the stars, the footer and the white drum (at least a third of the screen wide) follow it; the page and header switch at halfway (D37). Tap: Auto, Day, Night; drag: any level; arrows: a tenth. Saved as `theme` plus `theme-level` | Owner's pick after mock-ups C and D: keep the wheel, not a stripe slider, but make it a real dimmer with interpolated colours. One CSS variable keeps every blend in the stylesheet; the script only sets a number. OKLCH keeps the stripes colourful halfway (sRGB went grey). The CSSOM `style.setProperty` stays allowed under a strict CSP |
| D39 | The CAD carousel reads `projects.json` (3.2's data half, pulled forward) and is drawn as a drawing sheet like the entries: framed ring, small sheets with crop-marked viewports and DWG labels, blank paper backs, a light summary popup; the ring is pushed back by its radius so the front sheet shows at true size. Under 6 projects the list repeats (copies `aria-hidden`, out of the Tab order) | Owner, 2026-11-10: the carousel should match the projects below. One source of truth ends the placeholders and empty popups. Preview A (3 sheets) became a prism showing one sheet at a time and overflowed on phones; B keeps a ring (owner's pick). Frame and crop marks are shared selectors, not copies, so the two can't drift |
| D40 | The Code page becomes a catalog built from `data/code.json` (like D26): every project a flip card that grows to two columns when opened (preview A), bigger ones in a featured row first, private repos shown without a Source link. The cards are cream card stock in both themes (paper preview A) | Owner, 2026-11-10: "load all of em". 20+ projects as hand-copied HTML would drift and break; one JSON entry per project is easy to review. Small fronts keep a long list short; growing on open leaves room for the full entry (B's same-size back was too cramped). A link to a private repo is a 404 for visitors. Replaces the plain-HTML pick from 2.3 |
| D17 | Skeleton and layout are separate PRs; keep the `#page` wrapper; the width cap is a reusable `.wrapper` class; two `rem` breakpoints | Smaller reviews; respects the owner's structure; a class can be reused, and the carousel can skip it when it needs more width; breakpoints give more control than fluid sizing alone |

## Open questions

- Pixel art source: which asset packs? Check licenses (CC0 is safest) at Phase 4.1.
- Which pixel font, accent color, and Renaissance palette?
- "Old school" = **both** (owner, 2026-11-03): the plain daz catalog as the base, plus retro details. 1.12c added the bands and 70s stripes. More details (monospace labels and so on) are decided in R1 (was 2.7).
