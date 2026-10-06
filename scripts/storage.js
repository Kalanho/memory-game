const KEY = 'memory-game-leaders';

export function saveResult(moves) {
  const results = getResults();
  results.push({ moves, date: new Date().toISOString() });
  results.sort((a, b) => {
    if (a.moves !== b.moves) return a.moves - b.moves;
    return new Date(a.date) - new Date(b.date);
  });
  localStorage.setItem(KEY, JSON.stringify(results.slice(0, 10)));
}

export function getResults() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export function formatDate(iso) {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}