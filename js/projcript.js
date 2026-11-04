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

            carousel.style.transition = "transform 1s ease";
            currentRotation += diff;
            carousel.style.transform = `rotateY(${currentRotation}deg)`;

            setTimeout(() => {
                carousel.style.transition = "";
            }, 1000);
        });
    });

    function animate() {
        if (spinning) {
            currentRotation += autoSpinSpeed;
            carousel.style.transform = `rotateY(${currentRotation}deg)`;
        }
        requestAnimationFrame(animate);
    }

    animate();

    // ResizeObserver runs layoutCarousel once now, then again whenever the slideshow's
    // size changes (window resize, phone rotation), so the ring always fits
    new ResizeObserver(layoutCarousel).observe(slideshow);

    document.getElementById("close-sidebar").addEventListener("click", closeSidebar); 
});
