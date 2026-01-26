import { WASTE_TYPES } from "../domain/wasteTypes";
import { RowState, WasteType } from "../domain/types";
import { normalizeKg } from "./normalizeKg";

export function validateWasteReport(input: {
  locationId: string;
  rows: Record<WasteType, RowState>;
}): { ok: true; items: Array<{ waste_type: WasteType; kg: number }> } | { ok: false; message: string } {
  const { locationId, rows } = input;

  if (!locationId) return { ok: false, message: "Select a location." };

  const anySelected = WASTE_TYPES.some((w) => rows[w.type].selected);
  if (!anySelected) return { ok: false, message: "Select at least one waste type." };

  const items: Array<{ waste_type: WasteType; kg: number }> = [];
  for (const { type, label } of WASTE_TYPES) {
    const r = rows[type];
    if (!r.selected) continue;
    const kg = normalizeKg(r.kgText);
    if (kg === null || kg <= 0) {
      return { ok: false, message: `Enter the amount in kilograms (kg > 0) for waste type "${label}".` };
    }
    items.push({ waste_type: type, kg });
  }

  return { ok: true, items };
}
