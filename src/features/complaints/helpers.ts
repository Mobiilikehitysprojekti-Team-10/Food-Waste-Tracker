export const shortText = (s: string, n = 28) =>
  s.length > n ? s.slice(0, n).trim() + "…" : s;