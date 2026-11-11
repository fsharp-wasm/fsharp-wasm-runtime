/**
 * runtime/location.js — Browser location and history API.
 *
 * Thin wrappers around window.location and window.history so F# code can
 * read the current URL, navigate, and listen for popstate events.
 */

/** Return the full current URL string. */
export const getHref = () => window.location.href;

/** Return the current path component (e.g. "/about"). */
export const getPathname = () => window.location.pathname;

/** Return the hash fragment (e.g. "#section"). */
export const getHash = () => window.location.hash;

/** Return the search string (e.g. "?q=test"). */
export const getSearch = () => window.location.search;

/** Return the origin (e.g. "https://example.com"). */
export const getOrigin = () => window.location.origin;

/**
 * Navigate to a new URL (full page load).
 * @param {string} url
 */
export const navigateTo = (url) => { window.location.href = url; };

/**
 * Push a new entry onto the browser history stack without a page reload.
 * @param {string} path - The new path/URL to push
 * @param {string} title - Page title (most browsers ignore this)
 */
export const pushState = (path, title) => {
    window.history.pushState(null, title, path);
};

/**
 * Replace the current history entry without adding a new one.
 * @param {string} path
 * @param {string} title
 */
export const replaceState = (path, title) => {
    window.history.replaceState(null, title, path);
};

/** Navigate back one step in history. */
export const goBack = () => { window.history.back(); };

/** Navigate forward one step in history. */
export const goForward = () => { window.history.forward(); };

/**
 * Listen for popstate events (back/forward navigation).
 * The callback receives the new pathname as a string.
 * @param {function} cb - (pathname: string) => void
 */
export const onPopState = (cb) => {
    window.addEventListener("popstate", () => cb(window.location.pathname));
};

/** Reload the current page. */
export const reload = () => { window.location.reload(); };

/**
 * Parse a query-string value by key.
 * Returns an empty string if the key is not present.
 * @param {string} key
 * @returns {string}
 */
export const getQueryParam = (key) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(key) ?? "";
};
