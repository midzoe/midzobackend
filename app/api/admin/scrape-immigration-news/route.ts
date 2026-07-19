import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { NewsModel } from "@/src/models/News";
import { scrapeImmigrationNews, getConfiguredSources, SCRAPE_SCOPE } from "@/lib/scrape-news";

// Story 11.1 (FR44) : déclenche le scraping des actus immigration → brouillons dédupliqués.
// Accès : admin (token) OU cron (header x-cron-secret == CRON_SECRET). Comme /trips/process-reminders.
async function authorize(request: NextRequest): Promise<{ ok: boolean; status?: number }> {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("x-cron-secret") === secret) return { ok: true };

  const auth = await getAuthWithRole(request);
  if (!auth) return { ok: false, status: 401 };
  if (!isAdmin(auth.role)) return { ok: false, status: 403 };
  return { ok: true };
}

export async function POST(request: NextRequest) {
  try {
    const authz = await authorize(request);
    if (!authz.ok) return corsJson({ error: "Unauthorized" }, { status: authz.status });

    const sources = getConfiguredSources();
    if (sources.length === 0) {
      return corsJson(
        { error: "No sources configured. Set SCRAPE_SOURCES (comma-separated RSS URLs)." },
        { status: 400 }
      );
    }

    const result = await scrapeImmigrationNews();
    console.log(`[SCRAPE] immigration news: created=${result.created} skipped=${result.skipped} errors=${result.errors.length}`);
    return corsJson({ success: true, result });
  } catch (error) {
    console.error("Scrape immigration news error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

// Story 11.2 : liste des brouillons scrappés (immigration) en attente de validation.
export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const drafts = await NewsModel.findDrafts(SCRAPE_SCOPE);
    return corsJson({ success: true, data: drafts, total: drafts.length });
  } catch (error) {
    console.error("List scraped drafts error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, POST, OPTIONS");
}
