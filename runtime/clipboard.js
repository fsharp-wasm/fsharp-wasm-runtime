/**
 * runtime/clipboard.js — Clipboard API (read/write text).
 *
 * The async Clipboard API requires a secure context (HTTPS or localhost)
 * and user gesture.  All exports return promises that resolve/reject silently.
 */

/**
 * Write text to the clipboard.
 * @param {string} text
 * @param {function} onSuccess - () => void
 * @param {function} onError   - (msg: string) => void
 */
export const writeText = (text, onSuccess, onError) => {
    navigator.clipboard.writeText(text)
        .then(() => onSuccess())
        .catch((e) => onError(String(e)));
};

/**
 * Read text from the clipboard.
 * @param {function} onSuccess - (text: string) => void
 * @param {function} onError   - (msg: string) => void
 */
export const readText = (onSuccess, onError) => {
    navigator.clipboard.readText()
        .then((t) => onSuccess(t))
        .catch((e) => onError(String(e)));
};
