import prisma from "@/lib/prisma";

/**
 * Règles de paiement de la grille (décisions de Thierno, 31/10/2026) — mêmes règles que
 * `midzoweb/src/pricing/paymentRules.ts`.
 *
 *  - Paiement en 1, 2 ou 3 fois, rien au-delà.
 *  - Résidents d'Afrique : paiement en une fois uniquement (le risque d'impayé sur un
 *    échéancier y est trop élevé). Résidence inconnue : une fois aussi, par prudence.
 *  - La remise de paiement ne vaut que pour le premier achat (la consultation ne compte pas).
 * Créneaux de consultation : `lib/consultation.ts`.
 */

/** Noms anglais, comme `users.country_of_residence` (liste de `midzoweb/src/data/africanCountries.ts`). */
const AFRICA = new Set([
  "South Africa", "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cameroon", "Cape Verde",
  "Central African Republic", "Comoros", "Republic of the Congo", "DR Congo", "Djibouti", "Egypt", "Eritrea",
  "Eswatini", "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Equatorial Guinea", "Kenya",
  "Lesotho", "Liberia", "Libya", "Madagascar", "Malawi", "Mali", "Morocco", "Mauritius", "Mauritania", "Mozambique",
  "Namibia", "Niger", "Nigeria", "Uganda", "Rwanda", "São Tomé and Príncipe", "Senegal", "Seychelles",
  "Sierra Leone", "Somalia", "Sudan", "South Sudan", "Tanzania", "Chad", "Togo", "Tunisia", "Zambia", "Zimbabwe",
  "Côte d'Ivoire", "Ivory Coast",
]);

export function isAfrica(country: string | null | undefined): boolean {
  return !!country && AFRICA.has(country.trim());
}

/** Échéances autorisées selon le pays de résidence. */
export function allowedInstallments(residence: string | null | undefined): number[] {
  return !residence || isAfrica(residence) ? [1] : [1, 2, 3];
}

/** Premier achat = aucun achat payé hors consultation. */
export async function isFirstPurchase(userId: number): Promise<boolean> {
  const paid = await prisma.purchase.count({
    where: { userId, status: "paid", NOT: { offerId: "consultation" } },
  });
  return paid === 0;
}
