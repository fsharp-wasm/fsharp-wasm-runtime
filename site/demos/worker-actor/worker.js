// The actor: receives a message, "works" on it for a moment, answers.
self.onmessage = (e) => {
  const text = String(e.data);
  setTimeout(() => self.postMessage(`${text.toUpperCase()} (${text.length} chars)`), 150);
};
