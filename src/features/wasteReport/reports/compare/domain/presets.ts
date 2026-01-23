import { getCurrentWeekRange, getPreviousWeekRange } from "./weekRanges";

type MonthRange = { dayFrom: string; dayTo: string; label: string };

function toYMD(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatMonthLabel(d: Date) {
  return d.toLocaleDateString("fi-FI", { month: "long", year: "numeric" });
}

function getCurrentMonthRange(today = new Date()): MonthRange {
  const from = new Date(today.getFullYear(), today.getMonth(), 1);
  const to = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return { dayFrom: toYMD(from), dayTo: toYMD(to), label: formatMonthLabel(from) };
}

function getPreviousMonthRange(today = new Date()): MonthRange {
  const prev = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const from = new Date(prev.getFullYear(), prev.getMonth(), 1);
  const to = new Date(prev.getFullYear(), prev.getMonth() + 1, 0);
  return { dayFrom: toYMD(from), dayTo: toYMD(to), label: formatMonthLabel(from) };
}

export type ComparePresetId =
  | "prevWeek_vs_thisWeek"
  | "prevMonth_vs_thisMonth"
  | "custom";

export type ComparePreset = {
  id: ComparePresetId;
  title: string;
  aLabel: string;
  bLabel: string;
  rangeA: { dayFrom: string; dayTo: string };
  rangeB: { dayFrom: string; dayTo: string };
};

export function listPresets(): ComparePreset[] {
  const today = new Date();

  const aW = getPreviousWeekRange(today);
  const bW = getCurrentWeekRange(today);

  const aM = getPreviousMonthRange(today);
  const bM = getCurrentMonthRange(today);

  return [
    {
      id: "prevWeek_vs_thisWeek",
      title: "Week: previous vs current",
          aLabel: `A (${aW.label})`,
          bLabel: `B (${bW.label})`,      rangeA: { dayFrom: aW.dayFrom, dayTo: aW.dayTo },
      rangeB: { dayFrom: bW.dayFrom, dayTo: bW.dayTo },
    },
    {
      id: "prevMonth_vs_thisMonth",
      title: "Month: previous vs current",
          aLabel: `A (${aM.label})`,
          bLabel: `B (${bM.label})`,      rangeA: { dayFrom: aM.dayFrom, dayTo: aM.dayTo },
      rangeB: { dayFrom: bM.dayFrom, dayTo: bM.dayTo },
    },
    {
      id: "custom",
      title: "Custom",
      aLabel: "A (custom)",
      bLabel: "B (custom)",
      rangeA: { dayFrom: "", dayTo: "" },
      rangeB: { dayFrom: "", dayTo: "" },
    },
  ];
}

export function getPreset(presetId: ComparePresetId): ComparePreset {
  const presets = listPresets();
  const found = presets.find((p) => p.id === presetId);
  if (!found) return presets[0];
  return found;
}
