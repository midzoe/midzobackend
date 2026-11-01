/**
 * Champs du catalogue traduits pour le site (DeepL), par route publique.
 *
 * Seuls les textes descriptifs sont traduits : jamais les noms propres (université, banque,
 * centre), ni les valeurs qui servent de filtre (pays, ville, langue, type, niveau). Un champ
 * s'écrit `cle` (n'importe où dans la réponse) ou `parent.cle` (ex. `programs.name` : le nom
 * d'un programme, pas celui de l'université).
 *
 * ⚠️ Même liste côté front : midzoweb/src/i18n/contentRules.ts — les garder identiques
 * (seule exception : `programs.name`, voir plus bas).
 */
export interface TranslatableRule {
  /** Route publique (sans `/api`) avec la requête qui ramène tout le catalogue. */
  source: string;
  /** Préfixe des routes concernées (liste et fiche). */
  prefix: string;
  keys: string[];
}

export const TRANSLATABLE: TranslatableRule[] = [
  // `programs.name` est traduit ici mais remplacé à l'affichage seulement (le parcours Study
  // cherche des mots-clés français dans les intitulés) : il n'est pas dans la liste du front.
  { source: "/universities?limit=1000", prefix: "/universities", keys: ["admissionRequirements", "minimumGrade", "specialty", "programs.name"] },
  { source: "/banks", prefix: "/banks", keys: ["description", "accountTypes.name", "features", "requirements", "studentPerks", "cardType", "monthlyFee", "withdrawalLimit"] },
  { source: "/accommodations", prefix: "/accommodations", keys: ["description"] },
  { source: "/language-centers?limit=500", prefix: "/language-centers", keys: ["description", "startDates"] },
  { source: "/tourism/events", prefix: "/tourism/events", keys: ["title", "description", "highlights", "audience", "location"] },
  { source: "/tourism/programs?limit=500", prefix: "/tourism/programs", keys: ["title", "description", "itinerary", "transport"] },
  { source: "/circuits", prefix: "/circuits", keys: ["title", "summary", "description", "highlights", "best_time", "stops.visa"] },
  { source: "/orientation", prefix: "/orientation", keys: ["title", "description", "category"] },
  { source: "/blogs?limit=500", prefix: "/blogs", keys: ["title", "excerpt", "body", "category"] },
  { source: "/tourism-countries", prefix: "/tourism-countries", keys: ["description", "bestTime", "language", "visaForAfricans", "processingTimeVisa", "region"] },
  { source: "/study-countries", prefix: "/study-countries", keys: ["description", "admissionRequirements", "popularPrograms", "languageInstruction", "visaDifficulty", "region"] },
  { source: "/visa", prefix: "/visa", keys: ["applicationSteps", "commonRefusalReasons", "documentsRequired", "accommodationProof", "fundsAmount", "insuranceMinCoverage", "languageRequirement", "maxStay", "notes", "passportValidity", "photoSpec", "processingTime", "proofOfFunds", "vaccinations", "visaType", "visaValidity", "whereToApply", "entriesType"] },
  { source: "/vocational-trainings", prefix: "/vocational-trainings", keys: ["description", "documents", "employerType", "languageLevel", "requirements", "salary", "startDates"] },
  { source: "/insurance-plans", prefix: "/insurance-plans", keys: ["description", "benefits", "coverage"] },
];

/** Textes traduisibles d'une réponse, selon les champs de la règle. */
export function collectTexts(data: unknown, keys: string[]): string[] {
  const out = new Set<string>();
  const add = (v: unknown) => {
    if (typeof v === "string" && v.trim()) out.add(v.trim());
  };
  const walk = (node: unknown, parent: string) => {
    if (Array.isArray(node)) return node.forEach((x) => walk(x, parent));
    if (!node || typeof node !== "object") return;
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
      const wanted = keys.includes(k) || keys.includes(`${parent}.${k}`);
      if (wanted && typeof v === "string") add(v);
      else if (wanted && Array.isArray(v) && v.every((x) => typeof x === "string")) v.forEach(add);
      else if (v && typeof v === "object") walk(v, k);
    }
  };
  walk(data, "");
  return [...out];
}
