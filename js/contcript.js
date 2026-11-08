// Contact page (task 2.2): rebuilds the email address and powers the Copy button.
// Loaded with `defer`, so the page's HTML is already parsed when this runs.
// Without JS, visitors still read "you [at] example [dot] com" and the button stays hidden.

const emailSlot = document.querySelector("#email-address");
const copyButton = document.querySelector("#copy-email");
const copyStatus = document.querySelector("#copy-status");

function setUpEmail() {
    if (!emailSlot || !copyButton || !copyStatus) return;

    // The address is stored in three data-* parts in the HTML (see contact.html)
    const { user, domain, tld } = emailSlot.dataset;
    if (!user || !domain || !tld) {
        console.error("Contact page: #email-address needs data-user, data-domain and data-tld.");
        return;
    }
    const address = `${user}@${domain}.${tld}`;

    // Show it as a real mailto: link. textContent, never innerHTML (D7)
    const link = document.createElement("a");
    link.href = `mailto:${address}`;
    link.textContent = address;
    emailSlot.replaceChildren(link);

    let clearTimer;
    function say(message) {
        copyStatus.textContent = message;   // aria-live: screen readers announce it
        clearTimeout(clearTimer);
        clearTimer = setTimeout(() => { copyStatus.textContent = ""; }, 4000);
    }

    copyButton.addEventListener("click", async () => {
        try {
            // The Clipboard API only exists in a "secure context": https, or localhost while testing.
            // On plain http navigator.clipboard is undefined, so this line throws and we land in catch
            await navigator.clipboard.writeText(address);
            say("Copied to the clipboard.");
        } catch {
            // Plan B: select the address so the visitor can copy it themselves
            const range = document.createRange();
            range.selectNodeContents(link);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            say("Couldn't copy automatically. The address is selected: press Ctrl+C (⌘C on a Mac).");
        }
    });

    copyButton.hidden = false;
}

/* ---------- Drag-out: drop the real file, not a shortcut (PLAN.md Experiments) ----------
   Dragging an ordinary link onto the desktop only makes a shortcut (.url / .webloc).
   Chrome and Edge also read a non-standard drag type, "DownloadURL", in the format
   "mime-type:file-name:absolute-url". Dropped on the desktop or a folder, they download
   the file there. Firefox and Safari ignore it, so every file also has a normal link */

function allowDragOut(element, href, mimeType) {
    element.addEventListener("dragstart", (event) => {
        // Drags that start on a link INSIDE the element (email, GitHub…) bubble up to here:
        // leave those alone, they are ordinary link drags
        if (event.target !== element) return;
        const url = new URL(href, location.href);  // DownloadURL needs a full address, not a relative path
        const fileName = url.pathname.split("/").pop();
        event.dataTransfer.setData("DownloadURL", `${mimeType}:${fileName}:${url.href}`);
        event.dataTransfer.setData("text/uri-list", url.href); // other browsers: dropping on a tab opens the file
        event.dataTransfer.setData("text/plain", url.href);
    });
}

function setUpDragOut() {
    // 1. The whole contact card drags out as its own PDF (owner's pick).
    //    draggable is set here, not in the HTML, so without JS the card behaves like normal text
    const sheet = document.querySelector("#contact-sheet");
    if (sheet && sheet.dataset.pdf) {
        sheet.draggable = true;
        sheet.title = "Drag this card to your desktop to save it as a PDF";
        allowDragOut(sheet, sheet.dataset.pdf, "application/pdf");
    }

    // 2. The resume button, once it points at a real PDF (it's "#" until you add one)
    const resumeLink = document.querySelector("#resume .tb-button");
    const resumeHref = resumeLink && resumeLink.getAttribute("href");
    if (resumeHref && resumeHref.endsWith(".pdf")) {
        allowDragOut(resumeLink, resumeHref, "application/pdf");
    }
}

setUpEmail();
setUpDragOut();
