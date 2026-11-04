document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.getElementById("carousel-c");
    const figures = carousel.querySelectorAll("figure");
    const slideshow = document.getElementById("slideshow");
    const total = figures.length;
    let radius = 300;   // recalculated by layoutCarousel() to fit the screen

    // Fit the ring to the screen (task 1.15). The ring is about 2 × radius + one figure wide.
    // A figure of width f fits on a circle of radius f / (2 · tan(180° / total));
    // RING_GAP leaves a little space between neighbours (1.15 gives the original 300px on desktop)
    const MAX_FIGURE = 190;
    const RING_GAP = 1.15;

    function layoutCarousel() {
        const radiusPerFigure = RING_GAP / (2 * Math.tan(Math.PI / total));
        const figureSize = Math.min(MAX_FIGURE, slideshow.clientWidth / (2 * radiusPerFigure + 1));
        radius = Math.round(figureSize * radiusPerFigure);

        // CSS reads --figure-size for the figure width and height (projyles.css)
        slideshow.style.setProperty("--figure-size", `${Math.round(figureSize)}px`);
        figures.forEach((fig, i) => {
            const angle = (360 / total) * i;
            fig.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
        });
    }

    let currentRotation = 0;
    let autoSpinSpeed = 0.1;
    let spinning = true;
    let selectedFigure = null;

    // Three separate reasons can stop the spin, so each has its own flag and animate()
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
    });
    showSpinLabel();
    spinToggle.hidden = false;   // only shown once JS runs, like the header toggles in script.js

    // pointerenter/leave, not mouseenter/leave: they cover mouse, pen and touch, and a tap
    // on a phone ends with pointerleave, so the spin doesn't get stuck in "hovering"
    carousel.addEventListener("pointerenter", () => { hovering = true; });
    carousel.addEventListener("pointerleave", () => { hovering = false; });

    // Hide the details sidebar, forget the selection, and let the carousel spin again
    function closeSidebar() {
        slideshow.classList.remove("is-open");   // the CSS animates the popup closed (projyles.css, POPUP)
        selectedFigure = null;
        spinning = true;
    }

    figures.forEach((fig, i) => {
        const angle = (360 / total) * i;

        fig.addEventListener("click", () => {
            if (selectedFigure === fig) {
                closeSidebar();
                return;
            }

            selectedFigure = fig;   

            spinning = false;

            const img = fig.querySelector("img");

            document.getElementById("popup-title").textContent = fig.dataset.title;
            document.getElementById("popup-desc").textContent = fig.dataset.description;
            document.getElementById("popup-image").src = img.src;

            slideshow.classList.add("is-open");

            const targetAngle = -angle;

            const normalizedCurrent = ((currentRotation % 360) + 360) % 360;
            const normalizedTarget = ((targetAngle % 360) + 360) % 360;

            let diff = normalizedTarget - normalizedCurrent;

            if (diff > 180) diff -= 360;
            if (diff < -180) diff += 360;

            // Reduced motion: jump straight to the figure instead of a 1s turn
            carousel.style.transition = reduceMotion ? "" : "transform 1s ease";
            currentRotation += diff;
            carousel.style.transform = `rotateY(${currentRotation}deg)`;

            setTimeout(() => {
                carousel.style.transition = "";
            }, 1000);
        });
    });

    function animate() {
        if (spinning && !userPaused && !hovering) {
            currentRotation += autoSpinSpeed;
            carousel.style.transform = `rotateY(${currentRotation}deg)`;
        }
        requestAnimationFrame(animate);
    }

    animate();

    // ResizeObserver runs layoutCarousel once now, then again whenever the slideshow's
    // size changes (window resize, phone rotation), so the ring always fits
    new ResizeObserver(layoutCarousel).observe(slideshow);

    // Closing with Close or Escape puts focus back on the figure that was open (task 1.15d).
    // Otherwise focus is left on the now-hidden Close button, and the next Tab starts
    // again from the top of the page
    function closeAndRefocus() {
        if (!selectedFigure) return;   // nothing open
        const button = selectedFigure.querySelector(".figure-button");
        closeSidebar();
        button.focus();
    }

    document.getElementById("close-sidebar").addEventListener("click", closeAndRefocus);

    // Escape closes the popup, as it does for most popups and dialogs
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeAndRefocus();
    });
});
