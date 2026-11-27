/**
 * runtime/files.js — hand a text to the person as a file.
 *
 * `download(fileName, mimeType, text)` saves `text` under `fileName`: a Blob, an object URL and a click on an anchor that is not in the page.
 * The browser asks or saves by its own rules; nothing is read back.
 */

/**
 * @param {string} fileName  the name the file is saved under
 * @param {string} mimeType  e.g. "text/html"; an empty one is "text/plain"
 * @param {string} text
 */
export const download = (fileName, mimeType, text) => {
    const url = URL.createObjectURL(new Blob([text], { type: mimeType || "text/plain" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: fileName });
    a.click();
    URL.revokeObjectURL(url);
};
