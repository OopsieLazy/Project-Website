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

1. **Finish the skeleton:** PR F1, F2, F3 (CAD page works on phones, popup, motion and keyboard), then the Phase 1 close. ✅
2. **Home** (2.0b project data, 2.0c card stack) ✅. **Launch postponed** (owner, 2026-11-05) until the look is right: design pass (after step 3, once the skeleton is full), orrery, bug fixes, more features. Set a *launch bar* (a short list of must-haves) so it has a finish line. The launch plan is ready: PR L1 `chore/launch-basics` (titles, footer name, stripe favicon A, Open Graph, `.nojekyll`), PR L2 `feat/csp-404`, then the owner enables Pages.
3. **The other content-ready templates** (rest of Phase 2): every page has its layout and clear slots, so adding content is filling in, not building.
4. **Orrery lamp** (PR E2): the owner draws the art in parallel with steps 1–3; the build comes after.
5. **Project displays** (Phase 3), then **the museum** (Phase 4), then the rest of Phase 5.

**Guardrail:** no new roadmap items until step 3 is done. New ideas go into Experiments, undated.

**Where does a refinement go?** Ask "which task is this about?"
- About the feature in the **current or next PR** → add it to that task now (e.g. the popup's slide and fade → 1.16).
- About a **finished** feature → note it under the phase's *Polish* line; it's done in one pass at the phase close, not mid-feature.
- A **new idea** → Experiments, undated.
Each feature goes in three steps: **works → right** (layout, keyboard, phones) **→ nice** (motion, polish).

## ▶ Where we left off (update at the end of every session)

*Last session: 2026-11-07*
- **Branch:** `feat/cad-restyle` (design pass, first item), cut from `main` at #21. These notes are its first commit.
- **Merged since last notes:** #20 Browse Art (2.4, salon wall), #21 contact card drag-out (PDF). **All Phase 2 page templates exist.**
- **This PR:** design pass item 1, the CAD "All projects" area as **drawing sheets** (owner's pick A), plus the Phase 1 polish fix for the lantern touching the CAD heading (same page). The placeholder blocks stay and become the featured area, roadmap 3.10. More design-pass items: owner to list when ready.
- **Owner habit (new):** after editing `contact.html` text, regenerate the contact-sheet PDF (README, "Contact sheet PDF").
- **Owner to fill in (Art):** the `<!-- CONTENT -->` slots in `art.html`: the intro line and your images (copy an `<li>`, change both paths, the alt text and the caption; optional `is-wide` / `is-tall` / `is-big`). Strip EXIF/GPS from photos first. Tune the tilt with `--salon-tilt` / `--salon-nudge` in `styles.css`.
- **Next** (in order, owner's call 2026-11-05): after 2.4 the skeleton is full, so the **design pass** (first note: the CAD "All projects" restyle). Then 2.6–2.8. Orrery art (1.14b) runs alongside whenever the owner has time.
- **Owner to fill in (Code):** the `<!-- CONTENT -->` slots in `code.html`: the intro line, your real projects in place of No. 002 and No. 003 (copy an `<li>` for more), and a Live link for MyWeb once Pages is on.
- **Owner to fill in (Contact):** the `<!-- CONTENT -->` slots in `contact.html`: your real email (an alias is safest) as `data-user` / `data-domain` / `data-tld` plus the "[at]" text, status line, city, the résumé PDF at `assets/docs/resume.pdf` (then set the link's `href` and add `download`), GitHub and LinkedIn URLs.
- **Owner to fill in (About):** the `<!-- CONTENT -->` slots in `aboutme.html`: your photo for the card, your real tools and years (Tool B–E are placeholders), education, city, the Background and Education paragraphs, GitHub and LinkedIn URLs.
- **Owner to fill in (Home and projects):** End Stop Cap and Latch Hinge have **made-up stats, flavor text and Latch Hinge's description** in `data/projects.json` (temporary, 2026-11-05). Also the `<!-- CONTENT: … -->` slots in `index.html` (name line). Reference photos live in the git-ignored `references/` folder.
- **Owner habit:** end every PR with the full git command list (CLAUDE.md, Company workflow).
- **Owner to-dos on GitHub (before launch):** ruleset ✅ (active). Still: turn on secret scanning and push protection, set Actions to read-only, turn off the wiki, turn on "Automatically delete head branches". Delete the old backup bundle once happy.
- **Merged so far:** #1 public-repo hygiene, #2–#10 Phase 1 (tokens, skeleton, layout, header, restyle, themes, carousel fixes), #11–#13 Home (2.0a–c), #14 frame-rate spin (1.15e), #15 ring camera (1.15g), #16 CAD sections (2.5), #17 About (2.1), #18 Contact (2.2), #19 Code (2.3), #20 Art (2.4), #21 contact drag-out.
- **Design reference:** https://dazprojects.com/collections/all (white, hairlines, centered logo, catalog grid). We kept our own fonts (Cinzel, Instrument Sans). It feeds 3.3b.
- **Known issues:** card text is about 9 px on 320 px phones (the catalog repeats it). The CAD page's tab title is still "Projects" (L1 sets real titles).

## Phase 0: Foundation cleanup ✅

Done. Organized folders, URL-safe image names, `index.html`, relative links, a valid header, `.gitignore`, and 0 W3C errors.
Info notes left on purpose: the empty popup `<h2>` (JS fills it), the carousel `<section>` with no heading, and the `/>` in `thelab.html`.

## Phase 1: Responsive shell ✅

Done, closed 2026-11-04 (real-phone test and a Lighthouse accessibility run, both clear). PRs #2–#10, plus #14 and #15: design tokens and self-hosted fonts, the page skeleton and `.wrapper`, the adaptive header and footer, the dazprojects restyle with color bands and 70s stripes, three themes with the lantern picker, and the CAD carousel fitted to phones (popup, pause button, keyboard, frame-rate-independent spin, tilted ring). The reasons live in the decision log (D11–D24) and the merged PRs.
**QA checklist for every PR:** DevTools 320 / 375 / 768 / 1024 / 1440 px, drag-resize the window, Tab through with the keyboard, W3C validator.

**Parked from Phase 1:**

**PR E2 · `feat/orrery-lamp`**: the theme picker becomes a pixel-art orrery (owner's pick, replaces the lantern; D23 keeps the logic). Sits in the gap between the page content and the stripes. **Art (1.14b, 1.14c) runs in parallel with PR F and Phase 2; the build (1.14d, 1.14e) comes after the early launch.**
- [ ] **1.14b** Art direction: concept sketch of the lamp, which body shows each theme (sun = Day, moon = night…), size (e.g. 48×48 px, shown at 2×), palette from the theme tokens. Owner approves before any sprite work.
- [ ] **1.14c** Pixel sprites: Claude drafts a base sprite; the owner refines it in Pixelorama or Aseprite (owner-made art for the public repo). Export PNG or SVG, metadata stripped.
- [ ] **1.14d** Build: swap the lantern `<svg>` and CSS section for the orrery in all 3 pages. Planets orbit in wrappers turned by `rotate` at different speeds; `image-rendering: pixelated`, integer scaling only, `steps()` for frame animation. On/off transition when the theme changes. `themcript.js` stays the same.
- [ ] **1.14e** Check: reduced motion (planets stand still), keyboard and name tag, every theme, phone to desktop. Make sure it never covers page text (on phones it reaches into the column, so a page starting with a long line needs room, e.g. a float on the first heading).

**Polish** (done at the phase close): *(add refinements to finished features here)*
- [x] Theme lantern ran 8 px into the "CAD's Creations" `<h1>` between ~330 and 340 px wide (measured by sweeping every page 300–640 px; only this page). Fixed in `feat/cad-restyle`: on phones that heading keeps a lantern-sized gap.

## Phase 2: Content-ready templates

Goal: each page gets its final structure with clearly marked placeholder slots (`<!-- CONTENT: … -->`), so the owner can add real content later without touching layout code. Real content comes when the owner has gathered it.

- [x] **2.0 Home.** A first screen that answers "who, what, how to reach" in 5 seconds: name, role, one line, and **View projects** / **Résumé** buttons, plus a strip of selected work linking to `projects.html`. Real page title and meta description. Comes first because an empty home page is the biggest recruiter blocker. **Picked (owner, from previews):** B split hero + C's catalog below, **Blueprint** trading cards, clean page with two retro touches (monospace "Featured:" caption, hard-bordered catalog tiles). Split into two PRs:
  - [x] **2.0a** `feat/home-hero`: hero (label, name, one line, **View projects** / **Résumé** buttons), ONE static Blueprint card in the featured slot, the catalog grid (tiles are links), real `<title>` and meta description. New `css/homyles.css`. All text is `<!-- CONTENT: … -->` slots.
  - [x] **2.0b** `feat/project-data` (D26): every project written once in `data/projects.json`; `js/homcript.js` fetches it and builds the catalog tiles with `createElement` + `textContent`. A `<noscript>` link to `projects.html` for visitors without JS, and a clear console error if the JSON has a typo.
  - [x] **2.0c** `feat/home-card-stack`: the 3-card stack from projects with `"featured": true`, written as `setupStack(container)` so Phase 3 can register it as a display. Card number, `v` badge and stars are derived from the data. `aria-live` caption, reduced motion.
- [x] **2.1 About Me** (`feat/about-page`). Laid out like an encyclopedia biography (owner): title over a hairline, lead paragraph, an infobox (the Blueprint card + a facts table), a contents box, then Background, Education, Tools and years (year bars, owner), See also, External links. Plain HTML, no JS; every text slot is `<!-- CONTENT -->`. The card CSS moved to the shared `css/cardyles.css` (home pixel-identical before and after). Two additions there: `.card-holder`, because cqi in the card's own border rings measures the nearest *ancestor* container (without one, the viewport, so the rings turned ~30px thick), and footer labels from `data-label`. The card is `aria-hidden`, since all of it repeats page text. Bars come from `data-years` in CSS, not `style=""`, so a strict CSP (5.2) won't block them.
- [x] **2.2 Contact & Résumé** (`feat/contact-page`). New `contact.html` laid out as an engineering drawing's **title block** (owner, from previews): name, status, email + Copy, résumé download, elsewhere. The address sits in the HTML as `data-*` parts and "[at]" text; `js/contcript.js` joins it into a `mailto:` link and shows the **Copy** button (Clipboard API, secure contexts only; otherwise it selects the address and says "press Ctrl+C"; result announced with `aria-live`). Every Contact, Email and Résumé `#` link on the site now points here (`contact.html#email`, `#resume`). The PDF itself waits for the owner (`assets/docs/resume.pdf`: no phone or home address, metadata stripped).
- [x] **2.3 Code Portfolio** (`feat/code-page`). New `code.html`: each project is a **library catalog card** (owner, from previews): card number, a status **dot** top right (owner: filled = Live, half = In progress, ring = Archived; shape and colour both differ so colour is never the only clue, hidden text gives screen readers the word, a key sits under the intro), typed title, description on ruled lines, tech chips, Source/Live links, a punched hole. Plain HTML, no JS (owner: only one page shows them; copy an `<li>` to add one). Card colours are role tokens; the printed ink (ruled lines, red rule) is fixed palette like the stripes. Everything sits on one grid (`--ic-top` + n × `--ic-line`): the red rule is ruled line 1, the dot is centred in the band above it (owner), title and description start on lines (measured: 0px off at 1280 and 390 px). All card text ≥ 5.3:1 in every theme. Card 001 is this site (real repo link); 002–003 are placeholders. Every "Code Portfolio" `#` link now points here.
- [x] **2.4 Browse Art** (`feat/art-page`). New `art.html` as a **salon hang** (owner): framed pictures on the plain page background (white by day), packed by a `grid-auto-flow: dense` grid in 1×1 / wide / tall / big sizes, each a little crooked. Frames look real (owner: "not janky"): per-side border colours make a lit moulding with mitred corners (gilt, walnut, oak, thin black), an inner lip shadow, an off-white mat with a white bevel cut, a soft drop shadow. A straight **museum label** under each frame: title in ink, detail (page, year) in muted mono. Tilt and offset are fractions of two **design tokens** in `styles.css`, `--salon-tilt` (3°) and `--salon-nudge` (0.3rem) (owner: tunable; tried 6° and backed off). Mouldings and tilts come from overlapping `:nth-child` cycles, so adding a piece is copying one `<li>`. Hover or Tab straightens the frame; click opens the full image (plain link, no JS). Checked: no label covered, no sideways scroll at 320 / 390 / 768 / 1280 px. The owner passed this task to Claude.
- [x] **2.5 CAD page sections** (`feat/cad-sections`). Layout **C, index + entries** (owner, from previews): a row of numbered jump links, then one `<article id="bridge-guitar">` per project (square image box, kicker line, title, description, optional `writeup` paragraphs, stats as a `<dl>`). `js/sectcript.js` builds it; `js/datacript.js` now holds the helpers shared with home. Home tiles and cards link to `projects.html#<id>`. The script scrolls to the hash itself (the entry doesn't exist yet when the browser tries), and the fixed image box keeps the jump steady (scroll anchoring is off on this page). Bad or duplicate ids get no anchor and a console warning. The owner's placeholder blocks (`.larger-projects`, `.item-image-block`) stay above the entries for now (owner, 2026-11-05). No page per project while the header is copied by hand (D3).
- [ ] **2.6 Bold bands** (D20): full-width page sections that alternate white, sand and pine, like a woodblock print. Same pattern as the header and footer: the band is the outer element, and `.wrapper` sits inside. Build them section by section as pages get content.
- [ ] **2.8 How to add content** (README): add a project, a photo, an art piece; image size, naming and metadata rules.
- [ ] **2.9 CAD files** (when the owner has them; after the design pass): downloadable STL / STEP / 3MF files per project on the CAD page. A `files` list per project in `projects.json` (path, format, size), shown as download links in each 2.5 entry, each also draggable onto the desktop or a slicer with the drag-out code from `contcript.js` (move it to `datacript.js` then, as the second user). Strip file metadata; mind repo size (big files may need Git LFS or a release download instead).
- [ ] **2.7 Retro labels.** Small uppercase labels with wider `letter-spacing` (the daz "ALL PROJECTS" look), plus a few early-web details (visible borders, monospace captions). Pick which ones then.

**Design pass** (after 2.4, once the skeleton is full; owner lists what to change, Claude renders lettered previews). Collect look-and-feel notes here instead of fixing them mid-feature:
- [x] **CAD "All projects" area** (`feat/cad-restyle`): restyled as **A, drawing sheet** (owner, from previews): each project is an engineering drawing (ruled double frame with zone ticks, dashed viewport with crop marks, DWG numbers, stats as a title-block table), the index a ruled sheet list. All lines are `--color-accent`, so night turns it into a blueprint. CSS only (`projyles.css`); HTML, JS and anchors unchanged. Title block is 2 × 2 until its column is wide enough for 4 (container query on `.cad-body`); no label overflows from 320 to 1440 px. The owner's placeholder blocks stay; they become the featured area (3.10).

## Phase 3: Project display system (pluggable)

Goal: cool, unique ways to show the projects (carousel, film strip, spin reel), always next to one **streamlined** way for quick, accessible browsing. New displays are added without touching old ones.

Pattern: each display is a self-contained JS file that sets itself up on any container marked with `data-display="..."`.
```html
<div data-display="carousel"> <figure ...>...</figure> </div>
<div data-display="slideshow"> <figure ...>...</figure> </div>
```
- [ ] **3.1 Display loader.** A small script that finds `[data-display]` elements and calls the matching module.
- [ ] **3.2 Register the carousel.** Wrap the existing `projcript.js` logic as the first display, with minimal edits. Its figures come from `projects.json` (D26).
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
- [ ] **3.10 CAD featured area** (owner, 2026-11-07): the owner's two placeholder blocks above the CAD entries (`.larger-projects` "growing style, where you see part and expands to image or project view", and `.item-image-block`) become a featured area: projects with `"featured": true` in `projects.json` shown large, each showing a detail first and growing into the full image or the project entry on click. Built as a display (3.1 pattern), so it can be reused.
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

## Phase 5: Launch

- [ ] **5.1 Hosting.** GitHub Pages.
- [ ] **5.2 Security.** CSP via `<meta>` (GitHub Pages can't set headers), `rel="noopener noreferrer"` on external links, audit any `innerHTML`.
- [ ] **5.3 Basics.** Favicon, page descriptions, Open Graph preview tags, a plain `404.html` with the site header (GitHub Pages serves it for broken links; 4.2 dresses it up later).
- [ ] **5.4 Images.** Compress to WebP, add `loading="lazy"`, `alt` text, and `width`/`height` on every `<img>` (the browser reserves the space, so the page doesn't jump while loading). **Strip metadata from every photo** (phone photos carry GPS location).
- [ ] **5.5 Audit.** Lighthouse plus a real-phone test.
- [ ] **5.6 Custom domain** (`.dev` requires HTTPS, which GitHub Pages provides).

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
- **Built on the contact page** (`feat/contact-drag-out`): the whole title-block card drags out as `contact-sheet.pdf`; the résumé button joins in once it points at a real PDF; a keyboard-only link does the same without dragging. **CAD files:** task 2.9. A dropped STL can then go into Blender as a file (Blender's URL drop is for add-ons only).
- **Security.** Only our own same-site files; build the URL from our JSON paths, never from visitor input; set the right MIME type; strip metadata from anything offered (D15).
- **Testing.** The drag data is checked by script; the actual drop onto a desktop has to be tried by hand (a real mouse drag can't be automated headlessly).

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
| D17 | Skeleton and layout are separate PRs; keep the `#page` wrapper; the width cap is a reusable `.wrapper` class; two `rem` breakpoints | Smaller reviews; respects the owner's structure; a class can be reused, and the carousel can skip it when it needs more width; breakpoints give more control than fluid sizing alone |

## Open questions

- Pixel art source: which asset packs? Check licenses (CC0 is safest) at Phase 4.1.
- Which pixel font, accent color, and Renaissance palette?
- "Old school" = **both** (owner, 2026-11-03): the plain daz catalog as the base, plus retro details. 1.12c added the bands and 70s stripes. More details (monospace labels and so on) are 2.7.
