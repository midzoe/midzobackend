// Story 5.3 : comparaison de niveaux de langue CEFR (Cadre européen commun).
// Ordre strict croissant : A1 < A2 < B1 < B2 < C1 < C2.
export const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

/**
 * L'utilisateur « atteint » l'exigence si son niveau ≥ niveau requis.
 * - niveau requis inconnu/vide  → true  (rien à atteindre)
 * - niveau utilisateur absent/inconnu → false
 */
export function meetsLevel(userLevel?: string | null, requiredLevel?: string | null): boolean {
  const required = (requiredLevel ?? "").trim().toUpperCase();
  const requiredIdx = CEFR_LEVELS.indexOf(required as (typeof CEFR_LEVELS)[number]);
  if (requiredIdx === -1) return true; // pas d'exigence exploitable

  const user = (userLevel ?? "").trim().toUpperCase();
  const userIdx = CEFR_LEVELS.indexOf(user as (typeof CEFR_LEVELS)[number]);
  if (userIdx === -1) return false; // l'utilisateur n'a pas la langue (ou niveau inconnu)

  return userIdx >= requiredIdx;
}
