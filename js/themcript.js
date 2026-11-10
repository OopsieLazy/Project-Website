// Theme picker: the dimmer under the logo (task 1.14, D35, D38)
// Loaded in <head> WITHOUT defer on purpose: part 1 must run before the page is drawn,
// or a visitor who picked a night theme would see a white flash first.
// It's an external file, not inline, so a strict Content Security Policy won't need a hash for it later

// Two numbers describe the choice:
// - the LEVEL, 0 (full Day) to 1 (full Night): the CSS reads it as --dim and blends the
//   stripes, stars, footer and the dimmer itself (D38)
// - the THEME the page and header use: "day" below halfway, "lantern" (shown as Night) from halfway,
//   so text always stays readable (D37). "auto" = no choice: everything follows the OS
const THEME_NAMES = { day: "Day", lantern: "Night", auto: "Auto" };
const THEME_KEY = "theme";
const LEVEL_KEY = "theme-level";

// localStorage can throw (private mode, blocked storage), so every use is wrapped in try/catch.
// Anyone can edit storage in DevTools, so only values we recognise are trusted
function readSaved() {
    try {
        const theme = localStorage.getItem(THEME_KEY);
        if (theme !== "day" && theme !== "lantern") return { theme: "auto", level: null };
        const level = parseFloat(localStorage.getItem(LEVEL_KEY));
        // A choice saved before the dimmer existed has no level yet: use its end
        return { theme, level: level >= 0 && level <= 1 ? level : (theme === "day" ? 0 : 1) };
    } catch {
        return { theme: "auto", level: null };
    }
}

const themeFor = (level) => (level < 0.5 ? "day" : "lantern");

// "auto" is the ABSENCE of a choice: no data-theme and no --dim on <html>, so the CSS
// follows the OS live, with no JS. Otherwise both are written on <html>.
// style.setProperty is allowed even under a strict CSP: it changes the style through
// JavaScript (the CSSOM), not through an inline style="" attribute in the HTML
function apply(theme, level) {
    const root = document.documentElement;
    if (theme === "auto") {
        delete root.dataset.theme;
        root.style.removeProperty("--dim");
    } else {
        root.dataset.theme = theme;
        root.style.setProperty("--dim", level.toFixed(3));
    }
}

function save(theme, level) {
    try {
        if (theme === "auto") {
            localStorage.removeItem(THEME_KEY);
            localStorage.removeItem(LEVEL_KEY);
        } else {
            localStorage.setItem(THEME_KEY, theme);
            localStorage.setItem(LEVEL_KEY, level.toFixed(3));
        }
    } catch {
        // Storage blocked: the theme still changes, it just isn't remembered
    }
}

// Part 1: runs right now, while <head> is still loading
const saved = readSaved();
apply(saved.theme, saved.level);

// Part 2: the dimmer. The button doesn't exist yet (the <body> hasn't been read), so wait for it
document.addEventListener("DOMContentLoaded", () => {
    const button = document.querySelector(".theme-drum");
    if (!button) return;   // a page without the dimmer (e.g. thelab.html) still gets part 1

    const drum = button.querySelector(".drum");
    const face = button.querySelector(".drum-face");
    const ridgeGroup = button.querySelector(".drum-ridges");
    const sun = button.querySelector(".drum-sun");
    const moon = button.querySelector(".drum-moon");
    const name = button.querySelector(".theme-name");
    const lessMotion = matchMedia("(prefers-reduced-motion: reduce)");
    const osDark = matchMedia("(prefers-color-scheme: dark)");

    let theme = saved.theme;
    // The drum's turn in degrees: the sun is printed at 0 and the moon at 90, so the turn
    // is just the level times 90. Auto shows the OS's end
    const autoLevel = () => (osDark.matches ? 1 : 0);
    let turn = (saved.level ?? autoLevel()) * 90;
    let frame = 0;                 // the animation's frame id (0 = not running)

    /* ---------- Drawing ---------- */
    // The face is redrawn to the drum's real width (it's at least a third of the screen),
    // in px units, so nothing stretches. A point printed at angle a shows at
    // x = middle + radius * sin(a - turn); cos(a - turn) says how much it faces you
    // (1 = straight on, below 0 = round the back). Plain 2D maths, no CSS 3D
    const NS = "http://www.w3.org/2000/svg";
    let width = 144, mid = 72, radius = 70, ridges = [];

    function buildRidges() {
        width = drum.clientWidth || 144;
        mid = width / 2;
        radius = mid - 2;
        face.setAttribute("viewBox", `0 0 ${width} 40`);
        // A ridge about every 10px across the front, however wide the drum is
        const step = (10 / radius) * 180 / Math.PI;
        ridgeGroup.replaceChildren();
        ridges = [];
        for (let a = 0; a < 360; a += step) {
            const line = document.createElementNS(NS, "line");   // SVG lives in its own "namespace"
            line.setAttribute("y1", 4);
            line.setAttribute("y2", 36);
            ridgeGroup.append(line);
            ridges.push({ line, a });
        }
        draw();
    }

    const facing = (a) => {
        const r = (a - turn) * Math.PI / 180;
        return { x: mid + radius * Math.sin(r), front: Math.cos(r) };
    };

    function draw() {
        for (const { line, a } of ridges) {
            const { x, front } = facing(a);
            line.setAttribute("x1", x);
            line.setAttribute("x2", x);
            line.setAttribute("stroke-opacity", front > 0 ? (0.05 + 0.15 * front).toFixed(2) : 0);
        }
        // The sun and moon squash sideways as they turn away (scale x by how much they face you)
        for (const [body, a] of [[sun, 0], [moon, 90]]) {
            const { x, front } = facing(a);
            body.setAttribute("transform", `translate(${x.toFixed(1)} 20) scale(${Math.max(0.01, front).toFixed(3)} 1)`);
            body.setAttribute("opacity", front > 0 ? Math.sqrt(front).toFixed(2) : 0);
        }
    }

    // The label: Auto, or a word for where the dimmer is
    function showName(level) {
        name.textContent = theme === "auto" ? THEME_NAMES.auto
            : level <= 0.1 ? "Day" : level >= 0.9 ? "Night" : level < 0.5 ? "Dusk" : "Evening";
    }

    // Everything that follows the turn, live: the face, --dim (the stripes, stars and footer),
    // and the page theme, which switches at halfway
    const levelOf = (t) => Math.min(1, Math.max(0, t / 90));
    function follow() {
        const level = levelOf(turn);
        draw();
        if (theme !== "auto") {
            theme = themeFor(level);
            apply(theme, level);
        }
        showName(level);
    }

    /* ---------- Haptics: a tiny tick per few degrees, like a dimmer's grain ---------- */
    // navigator.vibrate exists on Android browsers; iPhones and desktops don't have it,
    // so check first and simply skip it there
    const canBuzz = "vibrate" in navigator;
    let lastTick = Math.round(turn / 6);
    function tick() {
        const now = Math.round(turn / 6);
        if (now !== lastTick && canBuzz) navigator.vibrate(3);
        lastTick = now;
    }

    /* ---------- Moving smoothly to a turn ---------- */
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    // Ease to a turn, then run done(). It never overshoots: a dimmer just stops
    function glideTo(target, done) {
        cancelAnimationFrame(frame);
        const from = turn;
        if (lessMotion.matches || Math.abs(target - from) < 0.5) {   // less motion asked for, or already there
            turn = target; frame = 0; follow(); done();
            return;
        }
        const duration = Math.min(700, 250 + Math.abs(target - from) * 5);
        const start = performance.now();
        const step = (now) => {
            const t = Math.min(1, (now - start) / duration);
            turn = from + (target - from) * easeOut(t);
            follow();
            if (t < 1) frame = requestAnimationFrame(step);
            else { frame = 0; done(); }
        };
        frame = requestAnimationFrame(step);
    }

    // Remember a level the visitor chose (from a drag, a key or a tap on Day / Night)
    function settle() {
        const level = levelOf(turn);
        theme = themeFor(level);
        apply(theme, level);
        save(theme, level);
        showName(level);
    }

    /* ---------- Input ---------- */
    // Tap, click, Enter and Space all arrive here: that's what a <button> gives for free.
    // A tap jumps between the presets: Auto -> Day -> Night -> Auto
    let wasDragged = false;
    button.addEventListener("click", () => {
        if (wasDragged) {                  // a drag also ends in a click: that one isn't a tap
            wasDragged = false;
            return;
        }
        if (theme === "auto") {
            theme = "day";
            glideTo(0, settle);
        } else if (levelOf(turn) < 0.5) {
            glideTo(90, settle);
        } else {
            // Back to Auto: glide to the OS's end, then forget the choice
            glideTo(autoLevel() * 90, () => {
                theme = "auto";
                apply("auto");
                save("auto");
                showName();
            });
        }
    });

    // Drag or flick: pointer events cover mouse, finger and pen with one set of code
    let dragging = false, moved = 0, lastX = 0, lastTime = 0, speed = 0, raw = 0;   // speed in degrees per ms

    // Past either end it resists: only 30% of the extra turn shows, and it springs back on release
    const resist = (t) => (t < 0 ? t * 0.3 : t > 90 ? 90 + (t - 90) * 0.3 : t);

    button.addEventListener("pointerdown", (event) => {
        if (event.button !== 0) return;    // main button / a finger only
        wasDragged = false;                // a click that never came (touch) mustn't eat the next tap
        dragging = true; moved = 0; speed = 0; raw = turn;
        lastX = event.clientX; lastTime = event.timeStamp;
        button.setPointerCapture(event.pointerId);   // keep the moves coming even off the button
        cancelAnimationFrame(frame); frame = 0;      // grabbing it stops a glide
    });

    button.addEventListener("pointermove", (event) => {
        if (!dragging) return;
        const dx = event.clientX - lastX;
        const dt = Math.max(1, event.timeStamp - lastTime);
        // The front of the drum follows the pointer: dx pixels along a radius of `radius` px.
        // Minus, because dragging right brings what's on the left (the sun, toward Day) to the front
        const degrees = -(dx / radius) * 180 / Math.PI;
        raw += degrees;
        turn = resist(raw);
        moved += Math.abs(dx);
        speed = 0.7 * speed + 0.3 * (degrees / dt);   // smoothed, so one jittery move doesn't fling it
        lastX = event.clientX; lastTime = event.timeStamp;
        if (moved >= 4 && theme === "auto") theme = themeFor(levelOf(turn));   // turning it is a choice
        follow();
        tick();
    });

    function release(event) {
        if (!dragging) return;
        dragging = false;
        if (moved < 4) return;             // barely moved: it's a tap, the click handler takes it
        wasDragged = true;
        // Held still before letting go? Then it was a placing, not a flick: no coasting
        if (event.timeStamp - lastTime > 80) speed = 0;
        const coast = Math.max(-30, Math.min(30, speed * 200));
        glideTo(Math.min(90, Math.max(0, turn + coast)), settle);   // coasts a little, then stays where it stops
    }
    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);

    // Arrow keys move it a tenth at a time, the same way a drag would (right = toward Day);
    // Home and End go to the ends. preventDefault stops them scrolling the page
    button.addEventListener("keydown", (event) => {
        const target = { ArrowRight: turn - 9, ArrowLeft: turn + 9, Home: 0, End: 90 }[event.key];
        if (target === undefined) return;
        event.preventDefault();
        if (theme === "auto") theme = themeFor(levelOf(turn));
        glideTo(Math.min(90, Math.max(0, target)), settle);
    });

    // In Auto, follow the OS if it switches between light and dark while the page is open
    osDark.addEventListener("change", () => {
        if (theme === "auto") glideTo(autoLevel() * 90, () => {});
    });

    // The drum's width follows the screen: redraw the face whenever it changes
    new ResizeObserver(buildRidges).observe(drum);

    showName(levelOf(turn));
    button.hidden = false;   // no JS = no dimmer, and the site simply follows the OS
});
