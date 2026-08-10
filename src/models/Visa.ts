import prisma from "../../lib/prisma";

/**
 * Fiche visa d'une route « origine → destination », par type de visa.
 * Story 4.7 : au-delà de « visa requis oui/non », la fiche porte le dossier obligatoire,
 * les conditions personnelles à prouver, la procédure de dépôt et les motifs de refus.
 */
export interface CreateVisaData {
  originCountry: string;
  destinationCountry: string;
  visaType?: string;
  visaRequired?: boolean;
  embassyId?: number | null;

  // Coûts & délais
  processingTime?: string | null;
  cost?: number | null;
  currency?: string | null;
  visaValidity?: string | null;
  entriesType?: string | null;
  maxStay?: string | null;

  // Dossier obligatoire
  documentsRequired?: string[] | null;
  passportValidity?: string | null;
  photoSpec?: string | null;
  applicationFormUrl?: string | null;

  // Conditions personnelles
  fundsAmount?: string | null;
  proofOfFunds?: string | null;
  accommodationProof?: string | null;
  insuranceRequired?: boolean;
  insuranceMinCoverage?: string | null;
  languageRequirement?: string | null;
  admissionLetterRequired?: boolean;
  guarantorRequired?: boolean;
  criminalRecordRequired?: boolean;
  medicalExamRequired?: boolean;
  vaccinations?: string | null;
  returnTicketRequired?: boolean;

  // Procédure
  whereToApply?: string | null;
  appointmentUrl?: string | null;
  biometricsRequired?: boolean;
  interviewRequired?: boolean;
  applicationSteps?: string[] | null;

  // À savoir
  commonRefusalReasons?: string[] | null;
  notes?: string | null;
  officialSourceUrl?: string | null;
  lastVerifiedAt?: Date | null;
  isValidated?: boolean;
}

export const VISA_TYPES = ["Étudiant", "Tourisme", "Travail", "Transit", "Long séjour"];

/** Champs acceptés en création/mise à jour, dans l'ordre du formulaire admin. */
const WRITABLE: (keyof CreateVisaData)[] = [
  "originCountry", "destinationCountry", "visaType", "visaRequired", "embassyId",
  "processingTime", "cost", "currency", "visaValidity", "entriesType", "maxStay",
  "documentsRequired", "passportValidity", "photoSpec", "applicationFormUrl",
  "fundsAmount", "proofOfFunds", "accommodationProof", "insuranceRequired",
  "insuranceMinCoverage", "languageRequirement", "admissionLetterRequired",
  "guarantorRequired", "criminalRecordRequired", "medicalExamRequired", "vaccinations",
  "returnTicketRequired", "whereToApply", "appointmentUrl", "biometricsRequired",
  "interviewRequired", "applicationSteps", "commonRefusalReasons", "notes",
  "officialSourceUrl", "lastVerifiedAt", "isValidated",
];

/** Ne conserve que les champs fournis : un PUT partiel ne doit pas écraser le reste. */
function pickDefined(data: Partial<CreateVisaData>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of WRITABLE) {
    if (data[key] !== undefined) out[key] = data[key];
  }
  return out;
}

export class VisaModel {
  /**
   * Fiche d'une route. `visaType` cible un type précis ; sans type, on renvoie la
   * fiche « Étudiant » à défaut la première disponible — pour que l'ancien appel
   * (nationalité + destination seules) continue de répondre.
   */
  static async findByRoute(from: string, to: string, visaType?: string | null) {
    if (visaType) {
      return prisma.visa.findUnique({
        where: {
          originCountry_destinationCountry_visaType: {
            originCountry: from,
            destinationCountry: to,
            visaType,
          },
        },
        include: { embassy: true },
      });
    }
    const matches = await prisma.visa.findMany({
      where: { originCountry: from, destinationCountry: to },
      include: { embassy: true },
      orderBy: { visaType: "asc" },
    });
    return matches.find(v => v.visaType === "Étudiant") ?? matches[0] ?? null;
  }

  static async findById(id: number) {
    return prisma.visa.findUnique({ where: { id }, include: { embassy: true } });
  }

  static async findAll() {
    return prisma.visa.findMany({
      orderBy: [{ destinationCountry: "asc" }, { originCountry: "asc" }, { visaType: "asc" }],
      include: { embassy: true },
    });
  }

  /** Public (gate 9.2 / FR37) : seules les fiches validées sortent côté site. */
  static async findAllPublic() {
    return prisma.visa.findMany({
      where: { isValidated: true },
      orderBy: [{ destinationCountry: "asc" }, { originCountry: "asc" }],
      include: { embassy: true },
    });
  }

  static async findByRoutePublic(from: string, to: string, visaType?: string | null) {
    const visa = await VisaModel.findByRoute(from, to, visaType);
    return visa && visa.isValidated ? visa : null;
  }

  static async create(data: CreateVisaData) {
    return prisma.visa.create({
      data: {
        ...(pickDefined(data) as any),
        originCountry: data.originCountry,
        destinationCountry: data.destinationCountry,
      },
    });
  }

  static async update(id: number, data: Partial<CreateVisaData>) {
    try {
      return await prisma.visa.update({ where: { id }, data: pickDefined(data) as any });
    } catch (error: any) {
      if (error.code === "P2025") return null;
      throw error;
    }
  }

  static async delete(id: number) {
    try {
      await prisma.visa.delete({ where: { id } });
      return true;
    } catch (error: any) {
      if (error.code === "P2025") return false;
      throw error;
    }
  }
}
