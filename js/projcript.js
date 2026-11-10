// The CAD carousel: a 3D ring of drawing sheets, one per project in data/projects.json
// (task 3.2, pulled forward in R2d). Click a sheet: the ring turns it to the front and the
// popup shows that project. This file loads in <head> WITHOUT defer, so it waits for
// DOMContentLoaded. datacript.js (loadProjects, make, makeImage, twoDigits, joinMeta) is deferred,
// and deferred scripts always run before DOMContentLoaded, so its helpers exist by then.

// Fewer than 6 sheets make a thin prism instead of a ring, so a short list goes round more
// than once. The copies are only for the eyes: hidden from screen readers and skipped by Tab
const MIN_RING = 6;

// One sheet: a button (keyboard and screen readers for free, task 1.15d) holding the
// render in a dashed viewport and a "DWG 01 Bridge Guitar" label.
// The image's alt is "": the label inside the same button already names it
function buildFigure(project, number, isCopy) {
    const button = make("button", "figure-button",
        // ring-window clips the picture INSIDE the dashed line, so the hover zoom can't spill over it
        make("span", "ring-art", make("span", "ring-window", makeImage(project.image))),
        make("span", "ring-label",
            make("span", "ring-num", number), " ",
            make("span", "ring-name", project.name)));
    button.type = "button";
    // aria-expanded: a screen reader says "collapsed" / "expanded", so it knows the popup opened
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", "selected-sidebar");

    const figure = make("figure", "ring-figure", button);
    if (isCopy) {
        figure.setAttribute("aria-hidden", "true");   // a screen reader hears each project once
        button.tabIndex = -1;                          // and Tab skips the copy
    }
    return figure;
}

document.addEventListener("DOMContentLoaded", async () => {
    const carousel = document.getElementById("carousel-c");
    const slideshow = document.getElementById("slideshow");
    if (!carousel || !slideshow) return;

    let projects;
    try {
        projects = await loadProjects();
    } catch (error) {
        // The slideshow stays hidden; the entries below show the "couldn't load" note
        console.error("Carousel not built: check data/projects.json and serve the site over http.", error);
        return;
    }
    if (!projects.length) return;

    // Which project (and its DWG number) each sheet stands for. A Map can use the
    // element itself as the key, so the click handler can look its project up
    const sheetInfo = new Map();
    const rounds = projects.length >= MIN_RING ? 1 : Math.ceil(MIN_RING / projects.length);
    for (let round = 0; round < rounds; round++) {
        projects.forEach((project, i) => {
            const number = twoDigits(i + 1);   // same numbers as the entries below
            const figure = buildFigure(project, number, round > 0);
            sheetInfo.set(figure, { project, number });
            carousel.append(figure);
        });
    }
    slideshow.hidden = false;   // hidden in the HTML, so without JS there's no empty frame

    const figures = carousel.querySelectorAll("figure");
    const total = figures.length;
    let radius = 300;   // recalculated by layoutCarousel() to fit the screen

    // Fit the ring to the screen (task 1.15). A figure of width f fits on a circle of radius
    // f / (2 · tan(180° / total)); RING_GAP leaves a little space between neighbours
    // The front sheet is shown at exactly this size: the CSS pushes the ring back by its radius
    // (--ring-radius), so the front sheet sits at the screen's own depth and is never stretched.
    // A stretched 3D layer is what looked hazy: the graphics card draws it once and enlarges it
    const MAX_FIGURE = 260;
    const RING_GAP = 1.15;
    // A little spare width, so the sheets never touch the padding
    const PERSPECTIVE_ROOM = 0.96;

    function layoutCarousel() {
        const radiusPerFigure = RING_GAP / (2 * Math.tan(Math.PI / total));
        // How wide the ring LOOKS, in figure widths. A sheet at angle a sits r·sin(a) from the
        // middle and shows half its width times cos(a): side-on sheets are thin. The widest
        // sheet sets the width. (The old fit, 2r + f, treated every sheet as facing you,
        // so on phones the ring was drawn much smaller than it needed to be)
        let halfWidth = 0;
        for (let i = 0; i < total; i++) {
            const a = (2 * Math.PI * i) / total;
            halfWidth = Math.max(halfWidth, radiusPerFigure * Math.abs(Math.sin(a)) + 0.5 * Math.abs(Math.cos(a)));
        }
        // The CONTENT width: clientWidth includes the sheet's padding, so fitting to it made the
        // ring touch the frame lines. Without the padding, the padding becomes breathing room
        const style = getComputedStyle(slideshow);
        const contentWidth = slideshow.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
        const figureSize = Math.min(MAX_FIGURE, (contentWidth * PERSPECTIVE_ROOM) / (2 * halfWidth));
        radius = Math.round(figureSize * radiusPerFigure);

        // CSS reads --figure-size for the figure width and height (projyles.css)
        slideshow.style.setProperty("--figure-size", `${Math.round(figureSize)}px`);
        slideshow.style.setProperty("--ring-radius", `${radius}px`);
        // Small sheets only have room for the number, not the name
        slideshow.classList.toggle("is-compact", figureSize < 130);
        figures.forEach((fig, i) => {
            const angle = (360 / total) * i;
            fig.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
        });
    }

    let currentRotation = 0;
    // Degrees per SECOND (task 1.15e). It used to be 0.1° per FRAME, so a 120 Hz screen
    // spun twice as fast as a 60 Hz one. 6°/s is the old speed on a 60 Hz screen
    const SPIN_DEG_PER_SEC = 6;
    // The turn to a picked sheet: fast at first, then settling gently (an "ease-out" curve)
    const TURN_MS = 900;
    const TURN_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
    let spinning = true;
    let selectedFigure = null;

    // Three separate reasons can stop the spin, so each has its own flag and updateSpin()
    // checks them together. With one shared flag, moving the mouse off the ring would
    // restart a spin the visitor had paused with the button.
    //   spinning   = false while a figure is picked (the original flag)
    //   userPaused = the Pause button (task 1.15c)
    //   hovering   = the pointer is over the ring (task 1.15b)
    // WCAG 2.2.2: anything that moves for more than 5 seconds needs a way to pause it.
    // Visitors who asked their OS for less motion start paused, and can still press Play
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let userPaused = reduceMotion;
    let hovering = false;

    const spinToggle = document.getElementById("spin-toggle");

    // The label says what pressing it WILL do. Use a changing label OR aria-pressed, never
    // both: a screen reader would read "Play spin, pressed", which contradicts itself
    function showSpinLabel() {
        spinToggle.textContent = userPaused ? "Play spin" : "Pause spin";
    }

    spinToggle.addEventListener("click", () => {
        userPaused = !userPaused;
        showSpinLabel();
        updateSpin();
    });
    showSpinLabel();

    // Hover pause (task 1.15b): the ring stops while the mouse is on a sheet's PICTURE (owner,
    // 2026-11-10), so it's easy to click. Resting in a gap, the ring keeps turning until a
    // picture arrives under the mouse, then holds it there.
    // Mouse only: touch has no hover, and a finger that starts a scroll on the ring shouldn't
    // stop it. (pointerType is "mouse", "pen" or "touch")
    carousel.querySelectorAll(".ring-art").forEach((picture) => {
        picture.addEventListener("pointerenter", (event) => {
            if (event.pointerType !== "mouse") return;
            hovering = true;
            updateSpin();
        });
        picture.addEventListener("pointerleave", (event) => {
            if (event.pointerType !== "mouse") return;
            hovering = false;
            updateSpin();
        });
    });

    // The popup's parts, filled from the picked project. textContent only, never innerHTML (D7)
    const popup = {
        kicker: document.getElementById("popup-kicker"),
        title: document.getElementById("popup-title"),
        meta: document.getElementById("popup-meta"),
        desc: document.getElementById("popup-desc"),
        link: document.getElementById("popup-link")
    };

    function fillPopup({ project, number }) {
        popup.kicker.textContent = number;   // CSS adds the "DWG" in front
        popup.title.textContent = project.name;
        // joinMeta (datacript.js) keeps a "·" from starting a line
        popup.meta.textContent = joinMeta([project.type, project.year, project.tool]);
        popup.desc.textContent = project.description || "";
        // To the full entry below. R2b points this at the project's own page instead
        popup.link.href = project.id ? `#${encodeURIComponent(project.id)}` : "#cad-sections";
    }

    function setExpanded(fig, open) {
        fig?.querySelector(".figure-button").setAttribute("aria-expanded", String(open));
    }

    const sidebar = document.getElementById("selected-sidebar");
    const scrollBehavior = reduceMotion ? "auto" : "smooth";
    // Phones: the popup sits ABOVE the ring and takes up room. Wide screens: it floats beside it
    const popupTakesRoom = () => getComputedStyle(sidebar).position !== "absolute";

    // Keep the carousel in view as the popup opens and closes (owner, 2026-11-10).
    // Closing on a phone folds the popup away, which pulls everything below it up while the
    // page stays where it was: you'd land on "All projects". So, BEFORE it folds, work out
    // where the sheet will be afterwards and glide there while it folds.
    // Only scrolls when the sheet wouldn't already be fully on screen
    function recenterAfterClose() {
        const sheet = slideshow.getBoundingClientRect();
        const closedHeight = sheet.height - (popupTakesRoom() ? sidebar.getBoundingClientRect().height : 0);
        if (sheet.top >= 0 && sheet.top + closedHeight <= innerHeight) return;   // already in view
        const sheetTop = scrollY + sheet.top;   // from the top of the PAGE, not the screen
        const target = closedHeight < innerHeight
            ? sheetTop + closedHeight / 2 - innerHeight / 2   // fits: centre it
            : sheetTop - 16;                                   // taller than the screen: show its top
        window.scrollTo({ top: Math.max(0, target), behavior: scrollBehavior });
    }

    // Opening: if the popup's top is above the screen (you scrolled down to the ring), glide up
    // so the summary is in view. On phones it starts at the top of the sheet (still 0px tall
    // while it opens, so measure the sheet); beside the ring it's already in place
    function revealPopup() {
        const top = popupTakesRoom()
            ? slideshow.getBoundingClientRect().top
            : sidebar.getBoundingClientRect().top;
        if (top < 0) {
            window.scrollTo({ top: scrollY + top - 16, behavior: scrollBehavior });
        }
    }

    // Hide the details sidebar, forget the selection, and let the carousel spin again
    function closeSidebar() {
        recenterAfterClose();                    // measure first, while the popup is still open
        slideshow.classList.remove("is-open");   // the CSS animates the popup closed (projyles.css, POPUP)
        setExpanded(selectedFigure, false);
        selectedFigure = null;
        spinning = true;
        updateSpin();
    }

    figures.forEach((fig, i) => {
        const angle = (360 / total) * i;

        fig.addEventListener("click", () => {
            if (selectedFigure === fig) {
                closeSidebar();
                return;
            }

            setExpanded(selectedFigure, false);
            selectedFigure = fig;
            setExpanded(fig, true);

            spinning = false;
            updateSpin();   // stops the animation and leaves the ring's angle in currentRotation

            fillPopup(sheetInfo.get(fig));

            slideshow.classList.add("is-open");
            revealPopup();

            // Move focus to the popup's title, so a screen reader reads what opened and the
            // next Tab reaches its link and Close. preventScroll: the page stays where it is.
            // The title has tabindex="-1": focusable by script, but not a Tab stop of its own
            popup.title.focus({ preventScroll: true });

            const targetAngle = -angle;

            const normalizedCurrent = ((currentRotation % 360) + 360) % 360;
            const normalizedTarget = ((targetAngle % 360) + 360) % 360;

            let diff = normalizedTarget - normalizedCurrent;

            if (diff > 180) diff -= 360;
            if (diff < -180) diff += 360;

            // Reading a computed style makes the browser apply the stopped angle NOW, so the
            // turn below starts from it (otherwise it could start from where the spin began)
            getComputedStyle(carousel).transform;
            // Reduced motion: jump straight to the figure instead of turning
            carousel.style.transition = reduceMotion ? "" : `transform ${TURN_MS}ms ${TURN_EASE}`;
            currentRotation += diff;
            // --spin, not transform: projyles.css combines it with the ring's tilt (task 1.15f)
            carousel.style.setProperty("--spin", `${currentRotation}deg`);

            setTimeout(() => {
                carousel.style.transition = "";
            }, TURN_MS);
        });
    });

    // THE SPIN (rebuilt 2026-11-10). It used to be a requestAnimationFrame loop: JavaScript
    // nudged the ring every frame. Phones pause or slow that work while you scroll or while
    // the page is busy, so the ring stopped and started by itself. Now the browser runs it as
    // an animation (the Web Animations API, element.animate). An animated transform runs on
    // the compositor, the graphics card's own thread, so it keeps turning while the page
    // scrolls, and it costs no JavaScript per frame. The speed is the same: 6°/s, the same
    // on 60 Hz and 120 Hz screens. The three stop flags are unchanged: updateSpin() plays or
    // stops the animation to match them
    const TURN_PERIOD_MS = (360 / SPIN_DEG_PER_SEC) * 1000;   // one full turn: 60 s
    let spinAnimation = null;   // the running animation, or null while stopped

    const shouldSpin = () => spinning && !userPaused && !hovering;

    // The ring's whole transform at one angle. It must match the CSS rule (projyles.css,
    // .content-carrousel): an animation replaces the whole transform, it can't fill in one var()
    function ringTransform(degrees) {
        const tilt = getComputedStyle(carousel).getPropertyValue("--ring-tilt").trim() || "0deg";
        return `translateZ(${-radius}px) rotateX(${tilt}) rotateY(${degrees}deg)`;
    }

    function startSpin() {
        if (spinAnimation) return;
        // One turn starting from where the ring is now, repeated forever
        spinAnimation = carousel.animate(
            [{ transform: ringTransform(currentRotation) }, { transform: ringTransform(currentRotation + 360) }],
            { duration: TURN_PERIOD_MS, iterations: Infinity }
        );
    }

    function stopSpin() {
        if (!spinAnimation) return;
        // How far it turned: the animation's clock, as a fraction of one turn
        currentRotation += ((spinAnimation.currentTime % TURN_PERIOD_MS) / TURN_PERIOD_MS) * 360;
        // Hand the angle back to the CSS (--spin) BEFORE removing the animation, so the ring
        // stays exactly where it stopped instead of jumping back to where it started
        carousel.style.setProperty("--spin", `${currentRotation}deg`);
        spinAnimation.cancel();
        spinAnimation = null;
    }

    // Call this after changing any stop flag. Safe to call any number of times
    function updateSpin() {
        if (shouldSpin()) startSpin();
        else stopSpin();
    }

    // ResizeObserver runs layoutCarousel whenever the slideshow's size changes (window resize,
    // phone rotation), so the ring always fits. A running spin was built with the old radius,
    // so it's rebuilt from the angle it had reached
    new ResizeObserver(() => {
        layoutCarousel();
        if (spinAnimation) {
            stopSpin();
            startSpin();
        }
    }).observe(slideshow);

    layoutCarousel();   // size the ring before the first spin, so it starts with the right radius
    updateSpin();

    // Closing with Close or Escape puts focus back on the figure that was open (task 1.15d).
    // Otherwise focus is left on the now-hidden Close button, and the next Tab starts
    // again from the top of the page
    function closeAndRefocus() {
        if (!selectedFigure) return;   // nothing open
        const button = selectedFigure.querySelector(".figure-button");
        closeSidebar();
        button.focus({ preventScroll: true });   // the glide above does the scrolling
    }

    document.getElementById("close-sidebar").addEventListener("click", closeAndRefocus);

    // Escape closes the popup, as it does for most popups and dialogs
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeAndRefocus();
    });
});
