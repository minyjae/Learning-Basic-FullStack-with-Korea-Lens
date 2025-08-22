const HISTORY_KEY = "history";

export function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveHistory(arr) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(arr));
}

export function clearHistoryStorage() {
  localStorage.removeItem(HISTORY_KEY);
}
