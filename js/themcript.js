// Theme picker: the paper drum under the logo (task 1.14, D35)
// Loaded in <head> WITHOUT defer on purpose: part 1 must run before the page is drawn,
// or a visitor who picked a night theme would see a white flash first.
// It's an external file, not inline, so a strict Content Security Policy won't need a hash for it later

// The themes in the order a tap steps through them, which is also their order on the drum.
// "auto" = no choice: the CSS follows the visitor's OS setting (Day or Night).
// The night theme's code name stays "lantern" (the CSS uses data-theme="lantern"); visitors see "Night"
const THEMES = ["day", "auto", "lantern"];
const THEME_NAMES = { day: "Day", auto: "Auto", lantern: "Night" };
// The drum turns like a volume knob between two ends, with a click-stop for each theme (in degrees).
// The sun is printed at 0 on the drum and the moon a quarter turn round, at 90, so: 0 = sun in front (Day),
// 90 = moon in front (Night), 45 = halfway, both showing, one each side (Auto)
const STOP_AT = { day: 0, auto: 45, lantern: 90 };
const SUN_ON_DRUM = 0, MOON_ON_DRUM = 90;
const STORAGE_KEY = "theme";

// localStorage can throw (private mode, blocked storage), so every use is wrapped in try/catch.
// Anyone can edit storage in DevTools, so only an exact known name is trusted; anything else means "auto"
function readSavedTheme() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return THEMES.includes(saved) ? saved : "auto";
    } catch {
        return "auto";
    }
}

// "auto" is the ABSENCE of a choice, so it removes the attribute and the saved value
// instead of storing "auto". Then the CSS's light-dark() follows the OS live, with no JS
function applyTheme(theme) {
    if (theme === "auto") {
        delete document.documentElement.dataset.theme;   // removes data-theme from <html>
    } else {
        document.documentElement.dataset.theme = theme;  // sets <html data-theme="lantern">
    }
}

function saveTheme(theme) {
    try {
        if (theme === "auto") {
            localStorage.removeItem(STORAGE_KEY);
        } else {
            localStorage.setItem(STORAGE_KEY, theme);
        }
    } catch {
        // Storage blocked: the theme still changes, it just isn't remembered
    }
}

// Part 1: runs right now, while <head> is still loading
applyTheme(readSavedTheme());

// Part 2: the drum. The button doesn't exist yet (the <body> hasn't been read), so wait for it
document.addEventListener("DOMContentLoaded", () => {
    const button = document.querySelector(".theme-drum");
    if (!button) return;   // a page without the drum (e.g. thelab.html) still gets part 1

    const drum = button.querySelector(".drum");
    const ridgeGroup = button.querySelector(".drum-ridges");
    const sun = button.querySelector(".drum-sun");
    const moon = button.querySelector(".drum-moon");
    const name = button.querySelector(".theme-name");
    const lessMotion = matchMedia("(prefers-reduced-motion: reduce)");

    const FIRST = STOP_AT.day, LAST = STOP_AT.lantern;   // the two ends of the knob's range
    let current = readSavedTheme();
    let turn = STOP_AT[current];   // how far the drum is turned: the ONE number the picture comes from
    let frame = 0;                 // the landing animation's frame id (0 = not running)
    let landingAt = null;          // where a running landing will stop

    /* ---------- Drawing ---------- */
    // The face is 144 x 40 units (1 unit = 1px). A point printed at angle a on the drum shows at
    // x = middle + radius * sin(a - turn); cos(a - turn) says how much it faces you (1 = straight on,
    // below 0 = round the back). Plain 2D maths, no CSS 3D, so pixel sprites stay crisp later
    const MID = 72, RADIUS = 70, RIDGE_STEP = 12;
    const NS = "http://www.w3.org/2000/svg";
    const ridges = [];
    for (let a = 0; a < 360; a += RIDGE_STEP) {
        const line = document.createElementNS(NS, "line");   // createElementNS: SVG lives in its own "namespace"
        line.setAttribute("y1", 4);
        line.setAttribute("y2", 36);
        ridgeGroup.append(line);
        ridges.push({ line, a });
    }

    const facing = (a) => {
        const r = (a - turn) * Math.PI / 180;
        return { x: MID + RADIUS * Math.sin(r), front: Math.cos(r) };
    };

    function draw() {
        for (const { line, a } of ridges) {
            const { x, front } = facing(a);
            line.setAttribute("x1", x);
            line.setAttribute("x2", x);
            line.setAttribute("stroke-opacity", front > 0 ? (0.08 + 0.22 * front).toFixed(2) : 0);
        }
        // The sun and moon squash sideways as they turn away (scale x by how much they face you)
        for (const [body, a] of [[sun, SUN_ON_DRUM], [moon, MOON_ON_DRUM]]) {
            const { x, front } = facing(a);
            const squash = Math.max(0.01, front);
            body.setAttribute("transform", `translate(${x.toFixed(2)} 20) scale(${squash.toFixed(3)} 1)`);
            body.setAttribute("opacity", front > 0 ? Math.sqrt(front).toFixed(2) : 0);
        }
    }

    // textContent, never innerHTML: it can only ever insert plain text (no XSS)
    function showName() {
        name.textContent = THEME_NAMES[current];
    }

    function setTheme(theme) {
        current = theme;
        applyTheme(theme);
        saveTheme(theme);
        showName();
    }

    /* ---------- Haptics: a tiny tick per ridge, like a knob's clicks ---------- */
    // navigator.vibrate exists on Android browsers; iPhones and desktops don't have it,
    // so check first and simply skip it there
    const canBuzz = "vibrate" in navigator;
    let lastRidge = Math.round(turn / RIDGE_STEP);
    function tick(strength = 4) {
        const ridge = Math.round(turn / RIDGE_STEP);
        if (ridge !== lastRidge && canBuzz) navigator.vibrate(strength);
        lastRidge = ridge;
    }

    /* ---------- Where it may stop ---------- */
    function nearestStop(t) {
        let best = null;
        for (const theme of THEMES) {
            const d = Math.abs(STOP_AT[theme] - t);
            if (!best || d < best.d) best = { theme, target: STOP_AT[theme], d };
        }
        return best;
    }

    // Past either end the knob resists: only 30% of the extra turn shows, and it springs back on release
    const resist = (t) => (t < FIRST ? FIRST + (t - FIRST) * 0.3 : t > LAST ? LAST + (t - LAST) * 0.3 : t);

    /* ---------- Landing: ease to a stop with a small overshoot ---------- */
    const easeOutBack = (t) => 1 + 2.3 * Math.pow(t - 1, 3) + 1.3 * Math.pow(t - 1, 2);

    function landOn(stop) {
        cancelAnimationFrame(frame);
        landingAt = stop;
        const from = turn, to = stop.target;
        const finish = () => {
            frame = 0; landingAt = null;
            if (canBuzz) navigator.vibrate(10);   // the click as it settles into the stop
            setTheme(stop.theme);                 // the theme changes when it lands, not on the way
        };
        if (lessMotion.matches || from === to) {  // less motion asked for, or already there: no animation
            turn = to; draw(); finish();
            return;
        }
        const duration = Math.min(900, 350 + Math.abs(to - from) * 3);   // farther = a little longer
        const start = performance.now();
        const step = (now) => {
            const t = Math.min(1, (now - start) / duration);
            turn = from + (to - from) * easeOutBack(t);
            draw();
            tick(2);
            if (t < 1) frame = requestAnimationFrame(step); else finish();
        };
        frame = requestAnimationFrame(step);
    }

    // The stop it is at, or heading to
    const settled = () => landingAt || nearestStop(turn);

    /* ---------- Input ---------- */
    // Tap, click, Enter and Space all arrive here: that's what a <button> gives for free.
    // Day -> Auto -> Night, then back round to Day
    let wasDragged = false;
    button.addEventListener("click", () => {
        if (wasDragged) {                  // a drag also ends in a click: that one isn't a tap
            wasDragged = false;
            return;
        }
        const next = THEMES[(THEMES.indexOf(settled().theme) + 1) % THEMES.length];
        landOn({ theme: next, target: STOP_AT[next] });
    });

    // Drag or flick: pointer events cover mouse, finger and pen with one set of code
    let dragging = false, moved = 0, lastX = 0, lastTime = 0, speed = 0, raw = 0;   // speed in degrees per ms

    button.addEventListener("pointerdown", (event) => {
        if (event.button !== 0) return;    // main button / a finger only
        wasDragged = false;                // a click that never came (touch) mustn't eat the next tap
        dragging = true; moved = 0; speed = 0; raw = turn;
        lastX = event.clientX; lastTime = event.timeStamp;
        button.setPointerCapture(event.pointerId);   // keep the moves coming even off the button
        cancelAnimationFrame(frame); frame = 0; landingAt = null;   // grabbing it stops a landing
    });

    button.addEventListener("pointermove", (event) => {
        if (!dragging) return;
        const dx = event.clientX - lastX;
        const dt = Math.max(1, event.timeStamp - lastTime);
        // The front of the drum follows the pointer: dx pixels along a radius of RADIUS units.
        // Minus, because dragging right brings what's on the left (toward Day) to the front
        const unit = drum.getBoundingClientRect().width / 144;
        const degrees = -(dx / (RADIUS * unit)) * 180 / Math.PI;
        raw += degrees;
        turn = resist(raw);
        moved += Math.abs(dx);
        speed = 0.7 * speed + 0.3 * (degrees / dt);   // smoothed, so one jittery move doesn't fling it
        lastX = event.clientX; lastTime = event.timeStamp;
        draw();
        tick();
    });

    function release(event) {
        if (!dragging) return;
        dragging = false;
        if (moved < 4) return;             // barely moved: it's a tap, the click handler takes it
        wasDragged = true;
        // Held still before letting go? Then it was a placing, not a flick: no coasting
        if (event.timeStamp - lastTime > 80) speed = 0;
        // A flick coasts on a little, then it clicks into the nearest stop (the ends are the limits)
        const coast = Math.max(-45, Math.min(45, speed * 200));   // at most one stop
        landOn(nearestStop(Math.min(LAST, Math.max(FIRST, turn + coast))));
    }
    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);

    // Arrow keys move the surface the same way a drag would: right = toward Day, left = toward Night.
    // preventDefault stops them scrolling the page
    button.addEventListener("keydown", (event) => {
        const dir = { ArrowRight: -1, ArrowLeft: 1 }[event.key];
        if (!dir) return;
        event.preventDefault();
        const i = THEMES.indexOf(settled().theme) + dir;
        if (i < 0 || i >= THEMES.length) return;   // already at that end of the knob
        landOn({ theme: THEMES[i], target: STOP_AT[THEMES[i]] });
    });

    draw();
    showName();
    button.hidden = false;   // no JS = no drum, and the site simply follows the OS
});
