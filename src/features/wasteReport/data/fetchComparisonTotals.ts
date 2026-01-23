import { fetchTotals } from "./fetchTotals";

export type TotalsRow = { waste_type: string; total_kg: number };

export type ComparisonResult = {
  a: Record<string, number>;
  b: Record<string, number>;
  diff: Record<string, number>;
};

type DateRange = {
  dayFrom: string;
  dayTo: string;
  fromTs?: string;
  toTs?: string;
};

function initTotals(wasteTypes: string[]) {
  const x: Record<string, number> = {};
  for (const wt of wasteTypes) x[wt] = 0;
  return x;
}

function addRows(target: Record<string, number>, rows: TotalsRow[], allowed: Set<string>) {
  for (const r of rows) {
    const wt = String(r.waste_type ?? "").toUpperCase();
    if (!allowed.has(wt)) continue;
    target[wt] = (target[wt] ?? 0) + Number(r.total_kg ?? 0);
  }
}

export async function fetchComparisonTotals(params: {
  locationIds: string[];
  wasteTypes: string[];
  rangeA: DateRange;
  rangeB: DateRange;
}): Promise<ComparisonResult> {
  const { locationIds, wasteTypes, rangeA, rangeB } = params;
  const allowed = new Set(wasteTypes);
  const fromA = rangeA.fromTs ?? rangeA.dayFrom;
  const toA = rangeA.toTs ?? rangeA.dayTo;

  const fromB = rangeB.fromTs ?? rangeB.dayFrom;
  const toB = rangeB.toTs ?? rangeB.dayTo;

  const [rowsA, rowsB] = await Promise.all([
    fetchTotals({ locationIds, wasteTypes, dayFrom: fromA, dayTo: toA }),
    fetchTotals({ locationIds, wasteTypes, dayFrom: fromB, dayTo: toB }),
  ]);

  const a = initTotals(wasteTypes);
  const b = initTotals(wasteTypes);

  addRows(a, rowsA as any, allowed);
  addRows(b, rowsB as any, allowed);

  const diff: Record<string, number> = {};
  for (const wt of wasteTypes) diff[wt] = (b[wt] ?? 0) - (a[wt] ?? 0);

  return { a, b, diff };
}

