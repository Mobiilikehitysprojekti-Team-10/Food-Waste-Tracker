import type { WeeklyMenu } from "../domain/menuTypes";
import { parseRssItems } from "./parseRss";
import { mapItemsToWeeklyMenu } from "./mapAromiToWeeklyMenu";

const cache = new Map<string, { value: WeeklyMenu; expiresAt: number }>();
const TTL_MS = 60 * 60 * 1000;

export async function fetchWeeklyMenu(locationName: string, rssUrl: string): Promise<WeeklyMenu> {
  if (!rssUrl) {
    throw new Error("The RSS URL is missing from the selected location.");
  }

  const cached = cache.get(rssUrl);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const res = await fetch(rssUrl, {
    headers: { "Cache-Control": "no-cache" },
  });

  if (!res.ok) {
    throw new Error(`Menu RSS fetch failed: ${res.status} ${res.statusText}`);
  }

  const xml = await res.text();

  if (!xml.toLowerCase().includes("<rss") && !xml.toLowerCase().includes("<feed")) {
    throw new Error("Menu source did not return an RSS/XML feed (check RSS URL).");
  }

  const items = parseRssItems(xml);
  const weekly = mapItemsToWeeklyMenu(locationName, items);

  cache.set(rssUrl, { value: weekly, expiresAt: Date.now() + TTL_MS });
  return weekly;
}
