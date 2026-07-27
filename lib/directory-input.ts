/**
 * Normalisation des entrées des tables « annuaire » (vols, assurances, banques,
 * sites, restaurants, hébergements tourisme, jobs, formations, démarches).
 *
 * Ces entités se saisissent depuis le CRUD générique de l'admin, qui n'expose que
 * des champs texte : les listes arrivent donc en « a, b, c » (ou une ligne par
 * valeur) alors que la base attend un tableau JSON. Ces helpers acceptent les deux
 * formes pour qu'un même endpoint serve l'admin ET un import programmatique.
 *
 * Vit hors des route files : Next n'autorise que les handlers HTTP en export d'une route.
 */

/** Tableau tel quel, sinon découpe « a, b, c » ou une valeur par ligne. `undefined` reste `undefined`. */
export function toList(value: unknown): string[] | undefined {
  if (value === undefined || value === null) return undefined;
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter((v) => v.length > 0);
  }
  if (typeof value !== "string") return undefined;
  // Une chaîne vide vaut « liste vidée », pas « champ absent ».
  if (value.trim().length === 0) return [];
  return value
    .split(/\r?\n|,/)
    .map((v) => v.trim())
    .filter((v) => v.length > 0);
}

/** Nombre ou `undefined`. Une chaîne vide (champ admin laissé vide) vaut « non renseigné ». */
export function toNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const n = typeof value === "number" ? value : Number(String(value).replace(",", "."));
  return Number.isFinite(n) ? n : undefined;
}

/** Entier ou `undefined` (mêmes règles que toNumber). */
export function toInt(value: unknown): number | undefined {
  const n = toNumber(value);
  return n === undefined ? undefined : Math.trunc(n);
}

/** Booléen tolérant : accepte true/false, "true"/"false", "1"/"0", "on". */
export function toBool(value: unknown): boolean | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value === "boolean") return value;
  const s = String(value).toLowerCase();
  if (["true", "1", "on", "yes", "oui"].includes(s)) return true;
  if (["false", "0", "off", "no", "non"].includes(s)) return false;
  return undefined;
}

/** Chaîne non vide, sinon `undefined` — évite d'écrire "" à la place d'un NULL. */
export function toText(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  const s = String(value).trim();
  return s.length > 0 ? s : undefined;
}
