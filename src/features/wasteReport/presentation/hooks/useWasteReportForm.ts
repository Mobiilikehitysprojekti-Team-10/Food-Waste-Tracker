import { useMemo, useState } from "react";
import { WASTE_TYPES } from "../../domain/wasteTypes";
import { RowState, WasteType } from "../../domain/types";

function initialRows(): Record<WasteType, RowState> {
  const initial: Record<WasteType, RowState> = {} as any;
  for (const w of WASTE_TYPES) initial[w.type] = { selected: false, kgText: "" };
  return initial;
}

export function useWasteReportForm() {
  const [locationId, setLocationId] = useState("");
  const [rows, setRows] = useState<Record<WasteType, RowState>>(initialRows);

  const selectedCount = useMemo(
    () => WASTE_TYPES.filter((w) => rows[w.type].selected).length,
    [rows]
  );

  function toggleType(type: WasteType) {
    setRows((prev) => {
      const next = { ...prev };
      const current = next[type];
      const newSelected = !current.selected;
      next[type] = { selected: newSelected, kgText: newSelected ? current.kgText : "" };
      return next;
    });
  }

  function setKg(type: WasteType, kgText: string) {
    setRows((prev) => ({ ...prev, [type]: { ...prev[type], kgText } }));
  }

  function reset() {
    setLocationId("");
    setRows(initialRows());
  }

  return { locationId, setLocationId, rows, toggleType, setKg, reset, selectedCount };
}
