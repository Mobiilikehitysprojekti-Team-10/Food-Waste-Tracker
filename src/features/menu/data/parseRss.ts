export type RssItem = {
  title: string;
  description: string;
  pubDate?: string;
};

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
}

function stripCdata(input: string): string {
  return input.replace(/^<!\[CDATA\[(.*)\]\]>$/s, "$1");
}

function getTag(block: string, tag: string): string {
  const m = block.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "i"));
  if (!m) return "";
  return decodeHtmlEntities(stripCdata(m[1].trim()));
}

export function parseRssItems(xml: string): RssItem[] {
  const items: RssItem[] = [];
  const itemBlocks = xml.match(/<item>[\s\S]*?<\/item>/gi) ?? [];
  for (const block of itemBlocks) {
    items.push({
      title: getTag(block, "title"),
      description: getTag(block, "description"),
      pubDate: getTag(block, "pubDate") || undefined,
    });
  }
  return items;
}
