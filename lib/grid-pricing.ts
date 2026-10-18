import { PricedServiceModel } from "@/src/models/PricedService";
import { PackageModel } from "@/src/models/Package";
import { AppSettingModel } from "@/src/models/AppSetting";

/**
 * Grille tarifaire — calcul CÔTÉ SERVEUR (même règles que `midzoweb/src/pricing/pricingEngine.ts`).
 *
 * 🚨 Le paiement en ligne facture le résultat de ce calcul, jamais un montant envoyé par le
 * navigateur : le client choisit des services, une offre et un nombre d'échéances ; le prix
 * est recalculé ici depuis la base.
 */

export const INSTALLMENTS = [1, 3, 6, 12] as const;

export interface GridService { code: string; family: string; name: string; price_cents: number }
export interface GridTier {
  id: number;
  slug: string | null;
  name: string;
  family: string | null;
  price_from_cents: number;
  max_services?: number | null;
  value_cap_cents?: number | null;
}
export interface GridData {
  currency: string;
  services: GridService[];
  packages: GridTier[];
  payment_options: { installments: number; discount_pct: number }[];
}

export interface OfferLine {
  kind: "alacarte" | "tier" | "mix" | "consultation";
  family: string;
  label: string;
  slug?: string;
  packageId?: number;
  valueCents: number;
  priceCents: number;
  serviceCount: number;
}
export interface Offer { id: string; label: string; lines: OfferLine[]; priceCents: number; valueCents: number }

export async function loadGrid(): Promise<GridData> {
  const [services, packages] = await Promise.all([PricedServiceModel.findActive(), PackageModel.findShowcase()]);
  const payment_options = [];
  for (const n of INSTALLMENTS) {
    payment_options.push({ installments: n, discount_pct: await AppSettingModel.getInt(`payment.discount_pct.${n}`, 0, 0, 50) });
  }
  return {
    currency: "EUR",
    services: services.map((s) => ({ code: s.code, family: s.family, name: s.name, price_cents: s.priceCents })),
    packages: (packages as any[]).map((p) => ({
      id: p.id, slug: p.slug, name: p.name, family: p.family, price_from_cents: p.price_from_cents,
      max_services: p.max_services, value_cap_cents: p.value_cap_cents,
    })),
    payment_options,
  };
}

const sum = (list: GridService[]) => list.reduce((n, s) => n + s.price_cents, 0);

function covers(t: GridTier, count: number, value: number) {
  if (!count) return false;
  if (t.max_services != null && count > t.max_services) return false;
  if (t.value_cap_cents != null && value > t.value_cap_cents) return false;
  return true;
}

function familyLines(family: "study" | "tourism", services: GridService[], tiers: GridTier[]): OfferLine[] {
  if (!services.length) return [];
  const value = sum(services);
  const lines: OfferLine[] = [{ kind: "alacarte", family, label: `${family === "study" ? "Études" : "Tourisme"} à la carte`, valueCents: value, priceCents: value, serviceCount: services.length }];
  tiers
    .filter((t) => t.family === family && covers(t, services.length, value) && t.price_from_cents < value)
    .forEach((t) => lines.push({ kind: "tier", family, label: t.name, slug: t.slug ?? undefined, packageId: t.id, valueCents: value, priceCents: t.price_from_cents, serviceCount: services.length }));
  return lines;
}

function makeOffer(lines: OfferLine[]): Offer {
  return {
    id: lines.every((l) => l.kind === "alacarte") ? "alacarte" : lines.map((l) => l.slug ?? `${l.family}-alacarte`).join("+"),
    label: lines.map((l) => l.label).join(" + "),
    lines,
    priceCents: lines.reduce((n, l) => n + l.priceCents, 0),
    valueCents: lines.reduce((n, l) => n + l.valueCents, 0),
  };
}

/** Toutes les offres possibles pour une sélection, de la moins chère à la plus chère. */
export function offersFor(codes: string[], grid: GridData): { services: GridService[]; unknown: string[]; offers: Offer[] } {
  const byCode = new Map(grid.services.map((s) => [s.code, s]));
  const unique = [...new Set(codes)];
  const services = unique.map((c) => byCode.get(c)).filter((s): s is GridService => !!s);
  const unknown = unique.filter((c) => !byCode.has(c));
  const study = services.filter((s) => s.family === "study");
  const tourism = services.filter((s) => s.family === "tourism");
  const offers: Offer[] = [];
  if (services.length) {
    const sl = familyLines("study", study, grid.packages);
    const tl = familyLines("tourism", tourism, grid.packages);
    for (const a of sl.length ? sl : [null]) {
      for (const b of tl.length ? tl : [null]) {
        const lines = [a, b].filter((l): l is OfferLine => !!l);
        if (lines.length) offers.push(makeOffer(lines));
      }
    }
    const value = sum(services);
    if (study.length && tourism.length) {
      grid.packages
        .filter((t) => t.family === "mix" && (t.value_cap_cents == null || value <= t.value_cap_cents) && t.price_from_cents < value)
        .forEach((t) => offers.push(makeOffer([{ kind: "mix", family: "mix", label: t.name, slug: t.slug ?? undefined, packageId: t.id, valueCents: value, priceCents: t.price_from_cents, serviceCount: services.length }])));
    }
  }
  // Consultation : toujours proposable, indépendante de la sélection.
  grid.packages
    .filter((t) => t.family === "consultation" && t.price_from_cents > 0)
    .forEach((t) => offers.push({
      id: "consultation",
      label: t.name,
      lines: [{ kind: "consultation", family: "consultation", label: t.name, slug: t.slug ?? undefined, packageId: t.id, valueCents: t.price_from_cents, priceCents: t.price_from_cents, serviceCount: 0 }],
      priceCents: t.price_from_cents,
      valueCents: t.price_from_cents,
    }));
  offers.sort((x, y) => x.priceCents - y.priceCents || x.lines.length - y.lines.length);
  return { services, unknown, offers };
}

export interface PaymentPlan { installments: number; discountPct: number; perInstallmentCents: number; totalCents: number }

/** Identique au front : remise sur le montant de l'offre, échéance arrondie à l'euro. */
export function paymentPlan(priceCents: number, installments: number, grid: GridData): PaymentPlan {
  const option = grid.payment_options.find((o) => o.installments === installments) ?? { installments: 1, discount_pct: 0 };
  const discounted = priceCents * (1 - option.discount_pct / 100);
  const n = Math.max(1, option.installments);
  const per = Math.round(discounted / n / 100) * 100;
  return { installments: n, discountPct: option.discount_pct, perInstallmentCents: per, totalCents: n === 1 ? Math.round(discounted / 100) * 100 : per * n };
}
