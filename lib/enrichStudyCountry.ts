import Anthropic from "@anthropic-ai/sdk";

// Story 5.5 : génération IA (Claude) d'un brouillon de pays d'étude.
// Modèle par défaut claude-opus-4-8 (réf. /claude-api). Structured outputs → JSON valide.

export const ENRICH_MODEL = "claude-opus-4-8";

// Erreur typée : la clé API n'est pas configurée → la route renvoie 503.
export class EnrichNotConfiguredError extends Error {
  constructor() {
    super("AI enrichment is not configured (ANTHROPIC_API_KEY missing)");
    this.name = "EnrichNotConfiguredError";
  }
}

// Champs générés (sous-ensemble de CreateStudyCountryData ; pas de flag/image/isValidated).
export interface EnrichedStudyCountry {
  nameFr: string;
  region: string;
  capital: string;
  description: string;
  languageInstruction: string[];
  tuitionRange: string;
  livingCost: string;
  visaDifficulty: string;
  scholarshipAvailable: boolean;
  popularScholarships: string[];
  popularPrograms: string[];
  admissionRequirements: string[];
  topUniversities: string[];
  processingTimeVisa: string;
}

// Schéma structured-outputs (additionalProperties:false + required, pas de contrainte min/max).
const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    nameFr: { type: "string", description: "Nom du pays en français" },
    region: { type: "string", description: "Région/continent" },
    capital: { type: "string" },
    description: { type: "string", description: "2-3 phrases sur les études dans ce pays" },
    languageInstruction: { type: "array", items: { type: "string" }, description: "Langues d'enseignement (en français, ex. « Anglais »)" },
    tuitionRange: { type: "string", description: "Fourchette de frais de scolarité annuels" },
    livingCost: { type: "string", description: "Coût de la vie mensuel estimé" },
    visaDifficulty: { type: "string", description: "Facile | Moyen | Difficile" },
    scholarshipAvailable: { type: "boolean" },
    popularScholarships: { type: "array", items: { type: "string" } },
    popularPrograms: { type: "array", items: { type: "string" } },
    admissionRequirements: { type: "array", items: { type: "string" } },
    topUniversities: { type: "array", items: { type: "string" } },
    processingTimeVisa: { type: "string", description: "Délai de traitement du visa étudiant" },
  },
  required: [
    "nameFr", "region", "capital", "description", "languageInstruction",
    "tuitionRange", "livingCost", "visaDifficulty", "scholarshipAvailable",
    "popularScholarships", "popularPrograms", "admissionRequirements",
    "topUniversities", "processingTimeVisa",
  ],
} as const;

export async function enrichStudyCountry(name: string): Promise<EnrichedStudyCountry> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new EnrichNotConfiguredError();
  }

  const client = new Anthropic();

  const response = await client.messages.create({
    model: ENRICH_MODEL,
    max_tokens: 4096,
    output_config: { format: { type: "json_schema", schema: SCHEMA } },
    messages: [
      {
        role: "user",
        content:
          `Tu es un expert en mobilité étudiante internationale. Génère une fiche d'information ` +
          `factuelle et concise pour les études supérieures dans le pays suivant : « ${name} ». ` +
          `Réponds en français. Sois réaliste et prudent : si une donnée est incertaine, reste général.`,
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  const raw = textBlock && "text" in textBlock ? textBlock.text : "";
  return JSON.parse(raw) as EnrichedStudyCountry;
}
