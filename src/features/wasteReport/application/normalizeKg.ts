export function normalizeKg(input: string): number | null {
  const normalized = input.trim().replace(",", ".");
  if (!normalized) return null;
  const num = Number(normalized);
  if (!Number.isFinite(num)) return null;
  return num;
}
