// A demo page opened with `?embed` (inside an <iframe> on another page) drops its own header and status banner.
if (new URLSearchParams(location.search).has("embed")) {
    const style = document.createElement("style");
    style.textContent = "body > header.container, #status-banner { display: none } body > main.container { padding-top: .5rem } body { margin: 0 }";
    document.head.appendChild(style);
}
