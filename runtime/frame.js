// frame.js — what a page of the platform starts with: the look of the site (theme.css) and its bar, so that a demo, an editor or a server page does not read as another place.
//
//   <script src="…/runtime/frame.js"></script>                           a page of its own: the bar, the look
//   <script src="…/runtime/frame.js" data-compact data-here="Widget Editor"></script>   an application: a slim bar that names it
//   <script src="…/runtime/frame.js" data-footer></script>                a document: the site's closing lines as well
//
// Inside an <iframe> (the demos embedded in a page, `?embed`) only the look is applied: the page around it has the bar.  The links are the ones in the header of the site
// (src/navigation.ts of fsharp-wasm.github.io); the site is where they lead, and the one place that says what the platform is.
(() => {
    const script = document.currentScript;
    const site = "https://fsharp-wasm.github.io";
    const own = new URL(".", script.src);
    const el = (tag, attrs = {}, ...kids) => {
        const node = Object.assign(document.createElement(tag), attrs);
        node.append(...kids);
        return node;
    };

    document.head.append(el("link", { rel: "stylesheet", href: new URL("theme.css", own).href }));
    if (new URLSearchParams(location.search).has("embed") || window.top !== window.self) return;

    const links = [["Projects", "/projects"], ["Docs", "/docs"], ["Demos", "/demos"], ["Benchmarks", "/benchmarks"], ["Backend", "/backend"], ["Roadmap", "/docs/roadmap"]];
    const here = script.dataset.here;
    const bar = el("div", { className: "fw-bar" + ("compact" in script.dataset ? " fw-compact" : "") },
        el("a", { className: "fw-brand", href: site + "/", title: "fsharp-wasm.github.io" },
            el("img", { src: new URL("logo.png", own).href, alt: "", width: 28, height: 28 }),
            el("span", {}, el("b", {}, "F#"), el("i", {}, "⚡"), "WasmGC")),
        ...(here ? [el("span", { className: "fw-here" }, here)] : []),
        el("nav", { className: "fw-links", "aria-label": "fsharp-wasm" }, ...links.map(([text, path]) => el("a", { href: site + path }, text))),
        el("a", { className: "fw-gh", href: "https://github.com/fsharp-wasm", target: "_blank", rel: "noopener" }, "GitHub"));

    const foot = el("footer", { className: "fw-foot" },
        "Brought to you by the ", el("a", { href: "https://github.com/fsharp-wasm" }, "fsharp-wasm organization"), ". Apache-2.0. ",
        el("a", { href: site + "/" }, "fsharp-wasm.github.io"));

    const mount = () => {
        document.body.prepend(bar);
        if ("footer" in script.dataset) document.body.append(foot);
    };
    if (document.body) mount(); else addEventListener("DOMContentLoaded", mount, { once: true });
})();
