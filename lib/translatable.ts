/**
 * Champs du catalogue traduits pour le site (DeepL), par route publique — seule liste (le site
 * envoie `?locale=` et reçoit le contenu déjà traduit).
 *
 * Seuls les textes descriptifs sont traduits : jamais les noms propres (université, banque,
 * centre), ni les valeurs qui servent de filtre (pays, ville, langue, type, niveau). Un champ
 * s'écrit `cle` (n'importe où dans la réponse) ou `parent.cle` (ex. `programs.name` : le nom
 * d'un programme, pas celui de l'université).
 *
 * - `keys` : remplacés dans la réponse ;
 * - `displayKeys` : traduits mais laissés d'origine dans la réponse — le site les traduit à
 *   l'affichage (`useContentLabels`), parce qu'il raisonne dessus (le parcours Study cherche des
 *   mots-clés français dans les intitulés des programmes) ;
 * - `admin` : routes admin dont une écriture ajoute ou modifie ces textes (traduction à
 *   l'enregistrement, quand la clé DeepL est sur le serveur).
 */
export interface TranslatableRule {
  /** Route publique (sans `/api`) avec la requête qui ramène tout le catalogue. */
  source: string;
  /** Préfixes des routes publiques concernées (liste et fiche). */
  prefixes: string[];
  admin: string[];
  keys: string[];
  displayKeys?: string[];
}

const VISA_KEYS = ["visaType", "applicationSteps", "commonRefusalReasons", "documentsRequired", "accommodationProof", "fundsAmount", "insuranceMinCoverage", "languageRequirement", "maxStay", "notes", "passportValidity", "photoSpec", "processingTime", "proofOfFunds", "vaccinations", "visaValidity", "whereToApply", "entriesType"];

export const TRANSLATABLE: TranslatableRule[] = [
  { source: "/universities?limit=1000", prefixes: ["/universities"], admin: ["/admin/universities"], keys: ["admissionRequirements", "minimumGrade", "specialty"], displayKeys: ["programs.name"] },
  { source: "/banks", prefixes: ["/banks"], admin: ["/admin/banks"], keys: ["description", "accountTypes.name", "features", "requirements", "studentPerks", "cardType", "monthlyFee", "withdrawalLimit", "minimumDeposit"] },
  { source: "/accommodations", prefixes: ["/accommodations"], admin: ["/admin/accommodations"], keys: ["description"] },
  { source: "/language-centers?limit=500", prefixes: ["/language-centers"], admin: ["/admin/language-centers"], keys: ["description", "startDates"] },
  { source: "/tourism/events", prefixes: ["/tourism/events"], admin: ["/admin/tourism-events"], keys: ["title", "description", "highlights", "audience", "location"] },
  { source: "/tourism/programs?limit=500", prefixes: ["/tourism/programs"], admin: ["/admin/tourism-programs"], keys: ["title", "description", "itinerary", "transport"] },
  { source: "/circuits", prefixes: ["/circuits"], admin: ["/admin/circuits"], keys: ["title", "summary", "description", "highlights", "best_time", "stops.visa", "stops.label"] },
  { source: "/orientation", prefixes: ["/orientation"], admin: ["/admin/orientation"], keys: ["title", "description", "category", "provider"] },
  { source: "/blogs?limit=500", prefixes: ["/blogs"], admin: ["/admin/blogs"], keys: ["title", "excerpt", "body", "category"] },
  { source: "/tourism-countries", prefixes: ["/tourism-countries"], admin: ["/admin/tourism-countries"], keys: ["description", "bestTime", "language", "visaForAfricans", "processingTimeVisa", "region"] },
  { source: "/study-countries", prefixes: ["/study-countries"], admin: ["/admin/study-countries"], keys: ["description", "admissionRequirements", "popularPrograms", "languageInstruction", "visaDifficulty", "region"] },
  // Le vérificateur de visa (`/travel/check`) renvoie les mêmes textes que les fiches visa.
  { source: "/visa", prefixes: ["/visa", "/travel/check"], admin: ["/admin/visa", "/admin/validate", "/admin/validation-queue"], keys: [...VISA_KEYS, "list", "steps", "travel_advisory", "documents_needed"] },
  { source: "/vocational-trainings", prefixes: ["/vocational-trainings"], admin: ["/admin/vocational-trainings"], keys: ["description", "documents", "employerType", "languageLevel", "requirements", "salary", "startDates"] },
  { source: "/insurance-plans", prefixes: ["/insurance-plans"], admin: ["/admin/insurance-plans"], keys: ["description", "benefits", "coverage"] },
];

const matches = (path: string, prefix: string) => path === prefix || path.startsWith(`${prefix}/`);

/** Règle d'une route publique (`/universities/12` → universités). */
export const ruleForPath = (path: string) => TRANSLATABLE.find((r) => r.prefixes.some((p) => matches(path, p)));

/** Règles touchées par une écriture admin (`/admin/banks/4` → banques ; validation → visa…). */
export const rulesForAdminPath = (path: string) => TRANSLATABLE.filter((r) => r.admin.some((p) => matches(path, p)));

/** Parcourt une réponse et applique `fn` aux textes des champs `keys` (chaînes ou listes de chaînes). */
export function mapTexts(node: unknown, keys: string[], fn: (s: string) => string, parent = ""): unknown {
  if (Array.isArray(node)) return node.map((x) => mapTexts(x, keys, fn, parent));
  if (!node || typeof node !== "object") return node;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
    const wanted = keys.includes(k) || keys.includes(`${parent}.${k}`);
    if (wanted && typeof v === "string") out[k] = fn(v);
    else if (wanted && Array.isArray(v) && v.every((x) => typeof x === "string")) out[k] = v.map((x) => fn(x as string));
    else out[k] = v && typeof v === "object" ? mapTexts(v, keys, fn, k) : v;
  }
  return out;
}

/** Textes traduisibles d'une réponse, selon les champs donnés. */
export function collectTexts(data: unknown, keys: string[]): string[] {
  const out = new Set<string>();
  mapTexts(data, keys, (s) => {
    if (s.trim()) out.add(s.trim());
    return s;
  });
  return [...out];
}
