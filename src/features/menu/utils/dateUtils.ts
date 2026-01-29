import type { WeekdayKey } from "../domain/menuTypes";

export const WEEKDAYS: { key: WeekdayKey; label: string }[] = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
];

export function getDefaultWeekdayKey(now = new Date()): WeekdayKey {
  const d = now.getDay();
  if (d === 0 || d === 6) return "mon";
  return WEEKDAYS[d - 1].key;
}
