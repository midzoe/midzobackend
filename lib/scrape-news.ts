import { NewsModel } from "@/src/models/News";

/**
 * Story 11.1 (FR44) : récupération automatique des actualités immigration depuis des flux RSS
 * autorisés, créées en **brouillons dédupliqués** (isPublished=false, scope="immigration").
 *
 * Implémentation complète mais volontairement dépendante de la config : les sources sont fournies
 * via l'env `SCRAPE_SOURCES` (URLs RSS séparées par des virgules). Aucune source n'est scrapée en
 * dur — on ne récupère que des flux RSS publics explicitement configurés (respect des ToS).
 */

export const SCRAPE_SCOPE = "immigration";

export function getConfiguredSources(): string[] {
  return (process.env.SCRAPE_SOURCES || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Parse minimal d'un flux RSS 2.0 / Atom : renvoie les items {title, link, description, pubDate}. */
export function parseRss(xml: string): { title: string; link?: string; description?: string; pubDate?: string }[] {
  const items: { title: string; link?: string; description?: string; pubDate?: string }[] = [];

  const decode = (s: string) =>
    s
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/<[^>]+>/g, "")
      .trim();

  const pick = (block: string, tag: string): string | undefined => {
    const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
    return m ? decode(m[1]) : undefined;
  };

  // RSS <item> ou Atom <entry>
  const blocks = xml.match(/<(item|entry)[\s\S]*?<\/(item|entry)>/gi) || [];
  for (const block of blocks) {
    const title = pick(block, "title");
    if (!title) continue;
    let link = pick(block, "link");
    // Atom : <link href="..."/>
    if (!link) {
      const hrefMatch = block.match(/<link[^>]*href="([^"]+)"/i);
      if (hrefMatch) link = hrefMatch[1];
    }
    const description = pick(block, "description") || pick(block, "summary") || pick(block, "content");
    const pubDate = pick(block, "pubDate") || pick(block, "updated") || pick(block, "published");
    items.push({ title, link, description, pubDate });
  }
  return items;
}

export interface ScrapeResult {
  sources: number;
  fetched: number;
  created: number;
  skipped: number;
  errors: { source: string; error: string }[];
}

/**
 * Récupère les sources configurées, parse les items, crée les brouillons dédupliqués.
 * `maxPerSource` borne le volume par exécution. Best-effort : une source en échec n'interrompt pas le job.
 */
export async function scrapeImmigrationNews(maxPerSource = 20): Promise<ScrapeResult> {
  const sources = getConfiguredSources();
  const result: ScrapeResult = { sources: sources.length, fetched: 0, created: 0, skipped: 0, errors: [] };

  for (const source of sources) {
    try {
      const res = await fetch(source, {
        headers: { "User-Agent": "MidzoBot/1.0 (+immigration-news)" },
        // Ne bloque pas indéfiniment
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) {
        result.errors.push({ source, error: `HTTP ${res.status}` });
        continue;
      }
      const xml = await res.text();
      const items = parseRss(xml).slice(0, maxPerSource);
      result.fetched += items.length;

      for (const item of items) {
        const exists = await NewsModel.existsByLinkOrTitle(item.link, item.title);
        if (exists) {
          result.skipped++;
          continue;
        }
        const publishedAt = item.pubDate ? new Date(item.pubDate) : new Date();
        await NewsModel.create({
          title: item.title,
          description: item.description?.slice(0, 2000),
          link: item.link,
          scope: SCRAPE_SCOPE,
          category: "immigration",
          isPublished: false, // brouillon → validation admin (11.2)
          publishedAt: isNaN(publishedAt.getTime()) ? new Date() : publishedAt,
        });
        result.created++;
      }
    } catch (e: any) {
      result.errors.push({ source, error: e?.message || String(e) });
    }
  }

  return result;
}
