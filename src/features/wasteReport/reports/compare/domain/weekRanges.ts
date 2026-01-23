type WeekRange = { dayFrom: string; dayTo: string; label: string };

function pad2(n: number) {
  return String(n).padStart(2, "0");
}
function formatYMD(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
function formatFi(d: Date) {
  return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
}


function startOfISOWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const iso = day === 0 ? 7 : day;
  d.setDate(d.getDate() - (iso - 1));
  d.setHours(0, 0, 0, 0);
  return d;
}
function endOfISOWeek(date: Date) {
  const s = startOfISOWeek(date);
  const e = new Date(s);
  e.setDate(e.getDate() + 6);
  e.setHours(23, 59, 59, 999);
  return e;
}

export function getCurrentWeekRange(now = new Date()): WeekRange {
  const from = startOfISOWeek(now);
  const to = endOfISOWeek(now);
  return {
    dayFrom: formatYMD(from),
    dayTo: formatYMD(to),
    label: `${formatFi(from)} - ${formatFi(to)}`,
  };
}

export function getPreviousWeekRange(now = new Date()): WeekRange {
  const prev = new Date(now);
  prev.setDate(prev.getDate() - 7);
  return getCurrentWeekRange(prev);
}
