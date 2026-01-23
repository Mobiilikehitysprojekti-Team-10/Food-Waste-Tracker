export type WeekRange = {
  dayFrom: string; // YYYY-MM-DD
  dayTo: string;   // YYYY-MM-DD
  label: string;   // "19.1 – 25.1.2026"
};

function toYMD(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function startOfWeekMonday(d: Date) {
  const x = new Date(d);
  const day = x.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  x.setDate(x.getDate() + diff);
  x.setHours(0, 0, 0, 0);
  return x;
}

function formatWeekLabel(from: Date, to: Date) {
  const fromDM = from.toLocaleDateString("fi-FI", { day: "numeric", month: "numeric" });
  const toDM = to.toLocaleDateString("fi-FI", { day: "numeric", month: "numeric" });
  const toY = to.toLocaleDateString("fi-FI", { year: "numeric" });

  if (from.getFullYear() !== to.getFullYear()) {
    const fromY = from.toLocaleDateString("fi-FI", { year: "numeric" });
    return `${fromDM}.${fromY} – ${toDM}.${toY}`;
  }
  return `${fromDM} – ${toDM}.${toY}`;
}

export function getCurrentWeekRange(today = new Date()): WeekRange {
  const from = startOfWeekMonday(today);
  const to = new Date(from);
  to.setDate(to.getDate() + 6);

  return {
    dayFrom: toYMD(from),
    dayTo: toYMD(to),
    label: formatWeekLabel(from, to),
  };
}