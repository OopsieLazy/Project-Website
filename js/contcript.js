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

setUpEmail();
