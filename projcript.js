document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.getElementById("carousel-c");
    const figures = carousel.querySelectorAll("figure");
    const sidebar = document.getElementById("selected-sidebar");
    const total = figures.length;
    const radius = 300;

    let currentRotation = 0;
    let autoSpinSpeed = 0.1;
    let spinning = true;
    let selectedFigure = null; 

    function closeSidebar() {                                      // ← ADD THIS WHOLE FUNCTION
        sidebar.style.display = "none";
        selectedFigure = null;
        spinning = true;
    }

    figures.forEach((fig, i) => {
        const angle = (360 / total) * i;
        fig.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;

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

            document.getElementById("selected-sidebar").style.display = "block";

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
    
    document.getElementById("close-sidebar").addEventListener("click", closeSidebar); 
});
