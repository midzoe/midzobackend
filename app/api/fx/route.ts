import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";

/**
 * Taux de change EUR → monnaies des clients, pour AFFICHER un équivalent indicatif (le paiement
 * reste en euros). Source : open.er-api.com, mis en cache 12 h en base (app_settings).
 * Le franc CFA a une parité fixe avec l'euro : XOF = XAF = 655,957 (jamais d'appel nécessaire).
 */
const CFA = 655.957;
const CACHE_KEY = "fx.rates.eur";
const MAX_AGE_MS = 12 * 60 * 60 * 1000;
const CURRENCIES = ["XOF", "XAF", "NGN", "GHS", "GNF", "CDF", "MAD", "DZD", "TND", "KES", "RWF", "UGX", "TZS", "ZAR", "EGP", "USD", "CAD", "GBP", "CHF"];

export async function GET(_request: NextRequest) {
  try {
    const row = await prisma.appSetting.findUnique({ where: { key: CACHE_KEY } }).catch(() => null);
    let cached: { rates: Record<string, number>; updatedAt: string } | null = null;
    try { cached = row?.value ? JSON.parse(row.value) : null; } catch { cached = null; }

    if (!cached || Date.now() - new Date(cached.updatedAt).getTime() > MAX_AGE_MS) {
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/EUR", { cache: "no-store" });
        const data = await res.json();
        if (data?.result === "success" && data.rates) {
          const rates: Record<string, number> = {};
          for (const c of CURRENCIES) if (typeof data.rates[c] === "number") rates[c] = data.rates[c];
          cached = { rates, updatedAt: new Date().toISOString() };
          await prisma.appSetting.upsert({
            where: { key: CACHE_KEY },
            create: { key: CACHE_KEY, value: JSON.stringify(cached) },
            update: { value: JSON.stringify(cached) },
          }).catch(() => undefined);
        }
      } catch (e) {
        console.error("FX refresh failed:", e);
      }
    }

    const rates = { ...(cached?.rates ?? {}), XOF: CFA, XAF: CFA, EUR: 1 };
    return corsJson({ success: true, base: "EUR", rates, updated_at: cached?.updatedAt ?? null, source: "open.er-api.com (XOF/XAF : parité fixe)" });
  } catch (error) {
    console.error("FX error:", error);
    return corsJson({ success: true, base: "EUR", rates: { EUR: 1, XOF: CFA, XAF: CFA }, updated_at: null });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
