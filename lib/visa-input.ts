/**
 * Normalisation du corps des requêtes de fiche visa (story 4.7).
 *
 * L'admin envoie des clés snake_case et n'a que des champs texte / cases à cocher :
 * les listes arrivent en « a, b, c » (ou une ligne par valeur), les nombres et les
 * booléens en chaînes. Ici on traduit vers `CreateVisaData` (camelCase, types Prisma).
 *
 * Règle importante : une chaîne vide vaut « champ vidé » → `null`, pour qu'un admin
 * puisse effacer une information ; une clé absente du corps reste `undefined` et
 * n'écrase donc rien lors d'une mise à jour partielle.
 *
 * Vit hors des route files : Next n'autorise que les handlers HTTP en export d'une route.
 */
import { toList, toBool, toNumber } from "./directory-input";
import type { CreateVisaData } from "@/src/models/Visa";

/** Texte ou `null` si vidé ; `undefined` si la clé est absente. */
function text(value: unknown): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const s = String(value).trim();
  return s.length > 0 ? s : null;
}

/** Liste ou `null` si vidée ; `undefined` si la clé est absente. */
function list(value: unknown): string[] | null | undefined {
  const l = toList(value);
  if (l === undefined) return value === null ? null : undefined;
  return l.length > 0 ? l : null;
}

/** Nombre ou `null` si vidé ; `undefined` si la clé est absente. */
function num(value: unknown): number | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  return toNumber(value) ?? null;
}

/** Date ISO (« 2026-08-10 ») ou `null` si vidée ; `undefined` si la clé est absente. */
function date(value: unknown): Date | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  const d = new Date(String(value));
  return Number.isNaN(d.getTime()) ? null : d;
}

/** `embassy_id` : "" / null → null (aucune ambassade), sinon entier. `NaN` signale une saisie invalide. */
export function parseEmbassyId(value: unknown): number | null {
  if (value === "" || value === undefined || value === null) return null;
  return Number(value);
}

/**
 * Corps admin (snake_case) → données du modèle. Seules les clés présentes dans le
 * corps ressortent, pour que PUT reste une mise à jour partielle.
 */
export function visaPayload(body: Record<string, any>): Partial<CreateVisaData> {
  const has = (key: string) => Object.prototype.hasOwnProperty.call(body, key);
  const out: Record<string, unknown> = {};
  const set = (key: keyof CreateVisaData, value: unknown) => {
    if (value !== undefined) out[key] = value;
  };

  // Identité de la route.
  set("originCountry", text(body.origin_country) ?? undefined);
  set("destinationCountry", text(body.destination_country) ?? undefined);
  if (has("visa_type")) set("visaType", text(body.visa_type) ?? "Étudiant");
  if (has("visa_required")) set("visaRequired", toBool(body.visa_required) ?? false);
  if (has("embassy_id")) set("embassyId", parseEmbassyId(body.embassy_id));

  // Coûts & délais.
  set("processingTime", text(body.processing_time));
  set("cost", num(body.cost));
  set("currency", text(body.currency));
  set("visaValidity", text(body.visa_validity));
  set("entriesType", text(body.entries_type));
  set("maxStay", text(body.max_stay));

  // Dossier obligatoire.
  set("documentsRequired", list(body.documents_required));
  set("passportValidity", text(body.passport_validity));
  set("photoSpec", text(body.photo_spec));
  set("applicationFormUrl", text(body.application_form_url));

  // Conditions personnelles à prouver.
  set("fundsAmount", text(body.funds_amount));
  set("proofOfFunds", text(body.proof_of_funds));
  set("accommodationProof", text(body.accommodation_proof));
  if (has("insurance_required")) set("insuranceRequired", toBool(body.insurance_required) ?? false);
  set("insuranceMinCoverage", text(body.insurance_min_coverage));
  set("languageRequirement", text(body.language_requirement));
  if (has("admission_letter_required"))
    set("admissionLetterRequired", toBool(body.admission_letter_required) ?? false);
  if (has("guarantor_required")) set("guarantorRequired", toBool(body.guarantor_required) ?? false);
  if (has("criminal_record_required"))
    set("criminalRecordRequired", toBool(body.criminal_record_required) ?? false);
  if (has("medical_exam_required"))
    set("medicalExamRequired", toBool(body.medical_exam_required) ?? false);
  set("vaccinations", text(body.vaccinations));
  if (has("return_ticket_required"))
    set("returnTicketRequired", toBool(body.return_ticket_required) ?? false);

  // Procédure de dépôt.
  set("whereToApply", text(body.where_to_apply));
  set("appointmentUrl", text(body.appointment_url));
  if (has("biometrics_required"))
    set("biometricsRequired", toBool(body.biometrics_required) ?? false);
  if (has("interview_required")) set("interviewRequired", toBool(body.interview_required) ?? false);
  set("applicationSteps", list(body.application_steps));

  // À savoir.
  set("commonRefusalReasons", list(body.common_refusal_reasons));
  set("notes", text(body.notes));
  set("officialSourceUrl", text(body.official_source_url));
  set("lastVerifiedAt", date(body.last_verified_at));
  if (has("is_validated")) set("isValidated", toBool(body.is_validated) ?? false);

  return out as Partial<CreateVisaData>;
}
