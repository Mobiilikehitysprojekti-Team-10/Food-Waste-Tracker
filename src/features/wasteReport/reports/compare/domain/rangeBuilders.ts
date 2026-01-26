export type Range = {
  dayFrom: string;
  dayTo: string;
  label: string;
  fromTs: string;
  toTs: string;
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toYMD(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function startOfLocalDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfLocalDay(d: Date) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

export function buildDayRange(date: Date): Range {
  const start = startOfLocalDay(date);
  const end = endOfLocalDay(date);

  const label = start.toLocaleDateString("fi-FI", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  return {
    dayFrom: toYMD(start),
    dayTo: toYMD(start),
    label,
    fromTs: start.toISOString(),
    toTs: end.toISOString(),
  };
}

export function buildMonthRange(year: number, monthIndex0: number): Range {
  const first = new Date(year, monthIndex0, 1);
  const last = new Date(year, monthIndex0 + 1, 0);

  const start = startOfLocalDay(first);
  const end = endOfLocalDay(last);

  const label = first.toLocaleDateString("fi-FI", {
    month: "long",
    year: "numeric",
  });

  return {
    dayFrom: toYMD(start),
    dayTo: toYMD(end),
    label,
    fromTs: start.toISOString(),
    toTs: end.toISOString(),
  };
}

export function buildIsoWeekRange(year: number, week: number): Range {

  const jan4 = new Date(year, 0, 4);
  const day = jan4.getDay() || 7;
  const mondayWeek1 = new Date(jan4);
  mondayWeek1.setDate(jan4.getDate() - (day - 1));
  mondayWeek1.setHours(0, 0, 0, 0);

  const from = new Date(mondayWeek1);
  from.setDate(mondayWeek1.getDate() + (week - 1) * 7);

  const to = new Date(from);
  to.setDate(from.getDate() + 6);

  const start = startOfLocalDay(from);
  const end = endOfLocalDay(to);

  const fromDM = from.toLocaleDateString("fi-FI", { day: "numeric", month: "numeric" });
  const toDM = to.toLocaleDateString("fi-FI", { day: "numeric", month: "numeric" });
  const label = `${fromDM} – ${toDM}.${year} (week ${week})`;

  return {
    dayFrom: toYMD(start),
    dayTo: toYMD(end),
    label,
    fromTs: start.toISOString(),
    toTs: end.toISOString(),
  };
}
