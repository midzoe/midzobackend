import type { ServiceInput } from "@/src/models/Category";

export const VALID_DELIVERY_MODES = ["online", "physical", "hybrid"];

/** `true`/`false` peuvent arriver en booléen (API) ou en chaîne (formulaire). */
function toBool(v: unknown): boolean | undefined {
  if (v === undefined || v === null || v === "") return undefined;
  if (typeof v === "boolean") return v;
  return v === "true" || v === "1" || v === 1;
}

/**
 * Les étapes arrivent soit en tableau (appel API), soit en texte multiligne
 * (textarea de l'admin). Une valeur vide efface la colonne (null), ce qui n'est
 * pas la même chose qu'un champ absent — celui-ci reste `undefined` et Prisma
 * laisse alors la colonne intacte.
 */
function toSteps(v: unknown): string[] | null | undefined {
  if (v === undefined) return undefined;
  if (v === null) return null;
  const list = Array.isArray(v)
    ? v.map((s) => String(s))
    : String(v).split("\n");
  const cleaned = list.map((s) => s.trim()).filter(Boolean);
  return cleaned.length ? cleaned : null;
}

/** Corps de requête (camelCase ou snake_case) -> champs du modèle Service. */
export function parseServicePayload(b: any): Partial<ServiceInput> {
  const order = b.order === "" || b.order === undefined || b.order === null ? undefined : Number(b.order);
  return {
    ...(b.name !== undefined ? { name: b.name } : {}),
    ...(b.categoryId ?? b.category_id ? { categoryId: b.categoryId ?? b.category_id } : {}),
    ...(b.displayName !== undefined || b.display_name !== undefined
      ? { displayName: b.displayName ?? b.display_name ?? null }
      : {}),
    ...(b.description !== undefined ? { description: b.description || null } : {}),
    ...(b.image !== undefined ? { image: b.image || null } : {}),
    ...(b.learnMoreLink !== undefined || b.learn_more_link !== undefined
      ? { learnMoreLink: b.learnMoreLink ?? b.learn_more_link ?? null }
      : {}),
    ...(b.translationKey !== undefined || b.translation_key !== undefined
      ? { translationKey: b.translationKey ?? b.translation_key ?? null }
      : {}),
    ...(toBool(b.isExternal ?? b.is_external) !== undefined
      ? { isExternal: toBool(b.isExternal ?? b.is_external) }
      : {}),
    ...(toBool(b.isActive ?? b.is_active) !== undefined
      ? { isActive: toBool(b.isActive ?? b.is_active) }
      : {}),
    ...(b.deliveryMode ?? b.delivery_mode ? { deliveryMode: b.deliveryMode ?? b.delivery_mode } : {}),
    ...(toSteps(b.steps) !== undefined ? { steps: toSteps(b.steps) } : {}),
    ...(order !== undefined && !isNaN(order) ? { order } : {}),
  };
}
