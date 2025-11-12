// src/services/storage.js
const SESSION_KEY = "session";
const LAST_SESSION_KEY = "lastSession";

export async function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  localStorage.setItem(LAST_SESSION_KEY, JSON.stringify(session));
}

export async function getSession() {
  const stored = localStorage.getItem(SESSION_KEY) ||
    localStorage.getItem(LAST_SESSION_KEY);
  return stored ? JSON.parse(stored) : null;
}

export async function clearSession(full = false) {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(LAST_SESSION_KEY);
}
