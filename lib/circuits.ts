import prisma from "@/lib/prisma";
import { GridData, loadGrid, offersFor } from "@/lib/grid-pricing";

/**
 * Circuits types : le prix « à partir de » de l'accompagnement Midzo est calculé depuis la
 * grille tarifaire (services inclus, voyageurs de base) — jamais saisi à la main. Le budget
 * sur place reprend la fourchette indicative de chaque pays (fiche tourism_countries).
 */
export interface CircuitStop { country: string; label?: string; cities?: string[]; nights?: number }

export async function serializeCircuits(rows: any[], grid?: GridData) {
  const g = grid ?? (await loadGrid());
  const countries = await prisma.tourismCountry.findMany({
    select: { name: true, nameFr: true, avgBudgetPerDay: true, flag: true, visaForAfricans: true, image: true },
  });
  const byName = new Map(countries.map((c) => [c.name, c]));
  return rows.map((c) => {
    const stops: CircuitStop[] = Array.isArray(c.stops) ? c.stops : [];
    const best = offersFor(c.services ?? [], g, { travelers: c.travelersBase ?? 2 }).offers.find((o) => o.id !== "consultation") ?? null;
    return {
      id: c.id,
      slug: c.slug,
      title: c.title,
      summary: c.summary,
      description: c.description,
      image: c.image ?? byName.get(stops[0]?.country ?? "")?.image ?? null,
      stops: stops.map((s) => ({
        country: s.country,
        label: s.label || byName.get(s.country)?.nameFr || s.country,
        cities: s.cities ?? [],
        nights: s.nights ?? null,
        flag: byName.get(s.country)?.flag ?? null,
        budget_per_day: byName.get(s.country)?.avgBudgetPerDay ?? null,
        visa: byName.get(s.country)?.visaForAfricans ?? null,
      })),
      duration_days: c.durationDays,
      services: c.services ?? [],
      highlights: c.highlights ?? [],
      best_time: c.bestTime,
      travelers_base: c.travelersBase ?? 2,
      is_published: c.isPublished,
      order: c.order,
      price_from: best ? { offer_id: best.id, label: best.label, price_cents: best.priceCents, value_cents: best.valueCents } : null,
    };
  });
}

export function circuitInput(b: any) {
  const stops = Array.isArray(b?.stops)
    ? b.stops
        .filter((s: any) => s && typeof s.country === "string" && s.country.trim())
        .map((s: any) => ({
          country: s.country.trim(),
          label: typeof s.label === "string" ? s.label.trim() : undefined,
          cities: Array.isArray(s.cities) ? s.cities.filter((x: any) => typeof x === "string" && x.trim()).map((x: string) => x.trim()) : [],
          nights: Number.isInteger(Number(s.nights)) && Number(s.nights) > 0 ? Number(s.nights) : undefined,
        }))
    : undefined;
  const list = (v: any) => (Array.isArray(v) ? v.filter((x: any) => typeof x === "string" && x.trim()).map((x: string) => x.trim()) : undefined);
  return {
    slug: typeof b?.slug === "string" ? b.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-") : undefined,
    title: typeof b?.title === "string" ? b.title.trim() : undefined,
    summary: typeof b?.summary === "string" ? b.summary.trim() : undefined,
    description: typeof b?.description === "string" ? b.description.trim() : undefined,
    image: typeof b?.image === "string" ? b.image.trim() || null : undefined,
    stops,
    durationDays: b?.duration_days !== undefined ? Number(b.duration_days) : undefined,
    services: list(b?.services)?.filter((c: string) => /^T\d+$/.test(c)),
    highlights: list(b?.highlights),
    bestTime: typeof b?.best_time === "string" ? b.best_time.trim() : undefined,
    travelersBase: b?.travelers_base !== undefined ? Math.max(1, Math.min(20, Number(b.travelers_base) || 2)) : undefined,
    isPublished: typeof b?.is_published === "boolean" ? b.is_published : undefined,
    order: b?.order !== undefined ? Number(b.order) || 0 : undefined,
  };
}
