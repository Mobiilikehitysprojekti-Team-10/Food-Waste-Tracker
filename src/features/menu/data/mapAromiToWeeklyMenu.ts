import type { MenuDay, MenuSection, WeekdayKey, WeeklyMenu } from "../domain/menuTypes";
import type { RssItem } from "./parseRss";
import { WEEKDAYS } from "../utils/dateUtils";

const DAY_PATTERNS: Record<WeekdayKey, RegExp[]> = {
  mon: [/^ma\b/i, /^maanantai\b/i, /^mon(day)?\b/i],
  tue: [/^ti\b/i, /^tiistai\b/i, /^tue(sday)?\b/i],
  wed: [/^ke\b/i, /^keskiviikko\b/i, /^wed(nesday)?\b/i],
  thu: [/^to\b/i, /^torstai\b/i, /^thu(rsday)?\b/i],
  fri: [/^pe\b/i, /^perjantai\b/i, /^fri(day)?\b/i],
};

function normalizeWhitespace(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

function stripHtmlToText(input: string): string {
  const withNewlines = input
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "");
  return withNewlines;
}

function splitToLines(description: string): string[] {
  const text = stripHtmlToText(description);
  return text
    .split("\n")
    .map((l) => normalizeWhitespace(l))
    .filter(Boolean);
}

function groupIntoSections(lines: string[]): MenuSection[] {
  const sections: MenuSection[] = [];
  let current: MenuSection | null = null;

  for (const line of lines) {
    const header = line.match(/^(.{2,40}):\s*$/);
    if (header) {
      current = { title: header[1], items: [] };
      sections.push(current);
      continue;
    }
    if (!current) {
      current = { title: "Menu", items: [] };
      sections.push(current);
    }
    current.items.push(line);
  }

  if (!sections.length) {
    return [{ title: "No information", items: ["Menu not available."] }];
  }
  return sections;
}

function findItemForWeekday(items: RssItem[], dayKey: WeekdayKey): RssItem | undefined {
  const patterns = DAY_PATTERNS[dayKey];

  for (const it of items) {
    const t = (it.title ?? "").trim();
    if (patterns.some((re) => re.test(t))) return it;
  }

  for (const it of items) {
    const lines = splitToLines(it.description);
    if (lines.some((l) => patterns.some((re) => re.test(l.trim())))) return it;
  }

  return undefined;
}


export function mapItemsToWeeklyMenu(locationName: string, items: RssItem[]): WeeklyMenu {
  const days = {} as WeeklyMenu["days"];

  for (const wd of WEEKDAYS) {
    const rssItem = findItemForWeekday(items, wd.key);

    const lines = rssItem ? splitToLines(rssItem.description) : [];
    const sections = lines.length ? groupIntoSections(lines) : [{ title: "No information", items: ["Menu not available."] }];

    const day: MenuDay = {
      weekday: wd.key,
      sections,
    };

    days[wd.key] = day;
  }

  return {
    locationName,
    days,
    fetchedAt: Date.now(),
  };
}
