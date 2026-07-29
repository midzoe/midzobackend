import prisma from "../../lib/prisma";

/**
 * Centre de langue (story 5.4, fiche enrichie story 5.14).
 *
 * `country` reprend le vocabulaire **anglais** de `University.country` (« Germany »,
 * « France »…) : la redirection depuis l'exigence de langue d'une université passe
 * ?country=<University.country>, les deux catalogues doivent donc concorder.
 * `language` reste en français (« Allemand ») comme `University.requiredLanguage`.
 */
export interface CreateLanguageCenterData {
  name: string;
  country: string;
  city?: string | null;
  language: string;
  levels?: string | null;
  link?: string | null;
  description?: string | null;
  address?: string | null;
  email?: string | null;
  phone?: string | null;
  registrationUrl?: string | null;
  image?: string | null;
  levelsOffered?: string[];
  courseTypes?: string[];
  examsPrepared?: string[];
  accreditations?: string[];
  universityPartners?: string[];
  priceFrom?: number | null;
  priceUnit?: string | null;
  currency?: string | null;
  weeklyHours?: number | null;
  classSize?: number | null;
  startDates?: string | null;
  offersVisaSupport?: boolean;
  offersAccommodation?: boolean;
  offersPathway?: boolean;
  isPartner?: boolean;
  isValidated?: boolean;
}

export interface LanguageCenterFilters {
  language?: string;
  country?: string;
  city?: string;
  /** Niveau CEFR : un centre correspond s'il l'enseigne (levelsOffered) ou si `levels` le mentionne. */
  level?: string;
  courseType?: string;
  exam?: string;
  onlyPartners?: boolean;
  /** Recherche plein texte simple sur nom / ville / description. */
  q?: string;
  /** Par défaut la liste publique ne sert que les fiches validées. */
  includeUnvalidated?: boolean;
}

/** Chaîne vide → null, pour ne pas stocker des « » qui s'affichent comme des valeurs. */
const str = (v: unknown): string | null | undefined => {
  if (v === undefined) return undefined;
  if (v === null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
};

/** Tableau normalisé : accepte aussi « A1, A2 » saisi d'un bloc dans l'admin. */
const arr = (v: unknown): string[] | undefined => {
  if (v === undefined || v === null) return undefined;
  const list = Array.isArray(v) ? v : String(v).split(",");
  return list.map(x => String(x).trim()).filter(Boolean);
};

const num = (v: unknown): number | null | undefined => {
  if (v === undefined) return undefined;
  if (v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const int = (v: unknown): number | null | undefined => {
  const n = num(v);
  return n == null ? n : Math.round(n);
};

const bool = (v: unknown): boolean | undefined =>
  v === undefined ? undefined : v === true || v === "true" || v === 1 || v === "1";

/** Corps de requête admin → données Prisma, champs absents ignorés (PATCH-friendly). */
function toPayload(data: Record<string, any>) {
  const payload: Record<string, any> = {
    name: str(data.name),
    country: str(data.country),
    city: str(data.city),
    language: str(data.language),
    levels: str(data.levels),
    link: str(data.link),
    description: str(data.description),
    address: str(data.address),
    email: str(data.email),
    phone: str(data.phone),
    registrationUrl: str(data.registrationUrl),
    image: str(data.image),
    levelsOffered: arr(data.levelsOffered),
    courseTypes: arr(data.courseTypes),
    examsPrepared: arr(data.examsPrepared),
    accreditations: arr(data.accreditations),
    universityPartners: arr(data.universityPartners),
    priceFrom: num(data.priceFrom),
    priceUnit: str(data.priceUnit),
    currency: str(data.currency) ?? undefined,
    weeklyHours: int(data.weeklyHours),
    classSize: int(data.classSize),
    startDates: str(data.startDates),
    offersVisaSupport: bool(data.offersVisaSupport),
    offersAccommodation: bool(data.offersAccommodation),
    offersPathway: bool(data.offersPathway),
    isPartner: bool(data.isPartner),
    isValidated: bool(data.isValidated),
  };

  for (const key of Object.keys(payload)) {
    if (payload[key] === undefined) delete payload[key];
  }
  return payload;
}

/** « A1-C1 » à partir des niveaux cochés, pour garder `levels` cohérent sans double saisie. */
const CEFR_ORDER = ["A1", "A2", "B1", "B2", "C1", "C2"];
function summarizeLevels(levels?: string[]): string | undefined {
  if (!levels || levels.length === 0) return undefined;
  const cefr = levels.filter(l => CEFR_ORDER.includes(l)).sort((a, b) => CEFR_ORDER.indexOf(a) - CEFR_ORDER.indexOf(b));
  if (cefr.length === levels.length && cefr.length > 1) return `${cefr[0]}-${cefr[cefr.length - 1]}`;
  return levels.join(", ");
}

export class LanguageCenterModel {
  static async findAll() {
    return prisma.languageCenter.findMany({
      orderBy: [{ country: "asc" }, { city: "asc" }, { name: "asc" }],
    });
  }

  /** Filtres publics (AC #2, story 5.4) — insensibles à la casse, cumulables. */
  static async findFiltered(filters: LanguageCenterFilters) {
    const where: Record<string, any> = {};

    if (!filters.includeUnvalidated) where.isValidated = true;
    if (filters.language) where.language = { equals: filters.language, mode: "insensitive" };
    if (filters.country) where.country = { equals: filters.country, mode: "insensitive" };
    if (filters.city) where.city = { equals: filters.city, mode: "insensitive" };
    if (filters.courseType) where.courseTypes = { has: filters.courseType };
    if (filters.exam) where.examsPrepared = { has: filters.exam };
    if (filters.onlyPartners) where.isPartner = true;

    // Un centre « couvre » un niveau s'il le liste explicitement ; les fiches anciennes
    // n'ont que le résumé texte `levels`, d'où le repli sur `contains`.
    if (filters.level) {
      where.OR = [
        { levelsOffered: { has: filters.level } },
        { levels: { contains: filters.level, mode: "insensitive" } },
      ];
    }

    if (filters.q) {
      const q = filters.q;
      const search = [
        { name: { contains: q, mode: "insensitive" } },
        { city: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
      where.AND = [...(where.AND ?? []), { OR: search }];
    }

    return prisma.languageCenter.findMany({
      where,
      // Les partenaires remontent en tête : c'est l'offre que Midzo accompagne.
      orderBy: [{ isPartner: "desc" }, { country: "asc" }, { city: "asc" }, { name: "asc" }],
    });
  }

  static async findById(id: number) {
    return prisma.languageCenter.findUnique({ where: { id } });
  }

  /** Facettes servies au front (pays, villes, langues…) pour construire les filtres. */
  static async facets(includeUnvalidated = false) {
    const where = includeUnvalidated ? {} : { isValidated: true };
    const rows = await prisma.languageCenter.findMany({
      where,
      select: { country: true, city: true, language: true, levelsOffered: true, courseTypes: true, examsPrepared: true },
    });

    const countries = new Map<string, number>();
    const cities = new Set<string>();
    const languages = new Map<string, number>();
    const levels = new Set<string>();
    const courseTypes = new Set<string>();
    const exams = new Set<string>();

    for (const r of rows) {
      countries.set(r.country, (countries.get(r.country) ?? 0) + 1);
      if (r.city) cities.add(r.city);
      languages.set(r.language, (languages.get(r.language) ?? 0) + 1);
      r.levelsOffered?.forEach(l => levels.add(l));
      r.courseTypes?.forEach(c => courseTypes.add(c));
      r.examsPrepared?.forEach(e => exams.add(e));
    }

    return {
      countries: [...countries.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
      cities: [...cities].sort((a, b) => a.localeCompare(b)),
      languages: [...languages.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
      levels: [...levels].sort((a, b) => a.localeCompare(b)),
      courseTypes: [...courseTypes].sort((a, b) => a.localeCompare(b)),
      exams: [...exams].sort((a, b) => a.localeCompare(b)),
      total: rows.length,
    };
  }

  static async create(data: CreateLanguageCenterData & Record<string, any>) {
    const payload = toPayload(data);
    if (!payload.levels) payload.levels = summarizeLevels(payload.levelsOffered) ?? null;
    return prisma.languageCenter.create({
      data: {
        ...payload,
        name: payload.name,
        country: payload.country,
        language: payload.language,
      },
    });
  }

  static async update(id: number, data: Partial<CreateLanguageCenterData> & Record<string, any>) {
    const payload = toPayload(data);
    // Niveaux modifiés sans résumé fourni : on régénère « A1-C1 » plutôt que de le laisser mentir.
    if (payload.levelsOffered && data.levels === undefined) {
      payload.levels = summarizeLevels(payload.levelsOffered) ?? null;
    }
    try {
      return await prisma.languageCenter.update({ where: { id }, data: payload });
    } catch (error: any) {
      if (error.code === "P2025") return null;
      throw error;
    }
  }

  static async delete(id: number) {
    try {
      await prisma.languageCenter.delete({ where: { id } });
      return true;
    } catch (error: any) {
      if (error.code === "P2025") return false;
      throw error;
    }
  }
}
