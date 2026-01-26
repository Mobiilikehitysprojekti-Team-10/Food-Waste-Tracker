function isLeapYear(y: number) {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}
export function isoWeeksInYear(year: number): 52 | 53 {
  const jan1 = new Date(year, 0, 1);
  const day = jan1.getDay();
  const jan1Iso = day === 0 ? 7 : day;

  if (jan1Iso === 4) return 53;
  if (jan1Iso === 3 && isLeapYear(year)) return 53;
  return 52;
}
