/**
 * runtime/cookies.js — document.cookie read/write/delete helpers.
 *
 * Cookies are stored as key=value pairs in document.cookie.
 * Each export is a thin wrapper that handles the string encoding.
 */

/**
 * Read a single cookie value by name.  Returns an empty string if not found.
 * @param {string} name
 * @returns {string}
 */
export const getCookie = (name) => {
    const prefix = encodeURIComponent(name) + "=";
    const cookies = document.cookie.split(";");
    for (let raw of cookies) {
        const c = raw.trimStart();
        if (c.startsWith(prefix)) {
            return decodeURIComponent(c.slice(prefix.length));
        }
    }
    return "";
};

/**
 * Set a cookie.
 * @param {string} name
 * @param {string} value
 * @param {number} days  - Expiry in days (0 = session cookie)
 * @param {string} path  - Cookie path (default "/")
 */
export const setCookie = (name, value, days, path) => {
    let expires = "";
    if (days > 0) {
        const d = new Date();
        d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + d.toUTCString();
    }
    document.cookie =
        encodeURIComponent(name) + "=" +
        encodeURIComponent(value) +
        expires +
        "; path=" + (path || "/");
};

/**
 * Delete a cookie by name.
 * @param {string} name
 * @param {string} path - Must match the path used when setting (default "/")
 */
export const deleteCookie = (name, path) => {
    document.cookie =
        encodeURIComponent(name) +
        "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=" +
        (path || "/");
};

/**
 * Check whether a cookie with the given name exists.
 * @param {string} name
 * @returns {boolean}
 */
export const hasCookie = (name) => getCookie(name) !== "";

/**
 * Return all cookie names as a newline-separated string
 * (suitable for splitting in F#).
 * @returns {string}
 */
export const getAllCookieNames = () =>
    document.cookie
        .split(";")
        .map((c) => decodeURIComponent(c.trimStart().split("=")[0]))
        .filter(Boolean)
        .join("\n");
