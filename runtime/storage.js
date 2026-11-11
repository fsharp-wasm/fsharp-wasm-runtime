export const getLocal    = (key)        => localStorage.getItem(key);
export const setLocal    = (key, value) => localStorage.setItem(key, value);
export const removeLocal = (key)        => localStorage.removeItem(key);
export const clearLocal  = ()           => localStorage.clear();

export const getSession    = (key)        => sessionStorage.getItem(key);
export const setSession    = (key, value) => sessionStorage.setItem(key, value);
export const removeSession = (key)        => sessionStorage.removeItem(key);
export const clearSession  = ()           => sessionStorage.clear();
