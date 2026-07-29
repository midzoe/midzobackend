import prisma from "../../lib/prisma";

/**
 * Événement tourisme (story 6.2, programmation annuelle story 6.8).
 *
 * `country` reprend le nom anglais de `TourismCountry.name` : c'est la clé du plan
 * annuel (« ce pays porte-t-il assez d'événements cette année ? »).
 */
export interface CreateTourismEventData {
  title: string;
  description?: string | null;
  country?: string | null;
  city?: string | null;
  location?: string | null;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  status?: string;
  link?: string | null;
  imageUrl?: string | null;
  isPublished?: boolean;
  subcategory?: string | null;
  year?: number | null;
  datesConfirmed?: boolean;
  priceFrom?: number | null;
  currency?: string | null;
  capacity?: number | null;
  audience?: string | null;
  offerIncludes?: string[];
  highlights?: string[];
  internalNotes?: string | null;
}

const str = (v: unknown): string | null | undefined => {
  if (v === undefined) return undefined;
  if (v === null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
};

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

const date = (v: unknown): Date | null | undefined => {
  if (v === undefined) return undefined;
  if (v === null || v === "") return null;
  const d = new Date(v as string);
  return isNaN(d.getTime()) ? null : d;
};

/** Corps de requête → données Prisma ; les champs absents ne sont pas touchés. */
function toPayload(data: Record<string, any>) {
  const startDate = date(data.startDate ?? data.start_date);
  const payload: Record<string, any> = {
    title: str(data.title),
    description: str(data.description),
    country: str(data.country),
    city: str(data.city),
    location: str(data.location),
    startDate,
    endDate: date(data.endDate ?? data.end_date),
    status: str(data.status),
    link: str(data.link),
    imageUrl: str(data.imageUrl ?? data.image_url),
    isPublished: bool(data.isPublished ?? data.is_published),
    subcategory: str(data.subcategory),
    year: int(data.year),
    datesConfirmed: bool(data.datesConfirmed ?? data.dates_confirmed),
    priceFrom: num(data.priceFrom ?? data.price_from),
    currency: str(data.currency) ?? undefined,
    capacity: int(data.capacity),
    audience: str(data.audience),
    offerIncludes: arr(data.offerIncludes ?? data.offer_includes),
    highlights: arr(data.highlights),
    internalNotes: str(data.internalNotes ?? data.internal_notes),
  };

  // Année déduite de la date quand elle n'est pas fournie : le plan annuel ne doit
  // jamais perdre un événement daté au motif que l'année n'a pas été saisie.
  if (payload.year === undefined && startDate) payload.year = startDate.getFullYear();

  for (const key of Object.keys(payload)) {
    if (payload[key] === undefined) delete payload[key];
  }
  return payload;
}

export interface TourismEventFilters {
  country?: string;
  year?: number;
  subcategory?: string;
  status?: string;
}

export class TourismEventModel {
  /** Public : uniquement les événements publiés, du plus proche au plus lointain. */
  static async findPublic(filters: TourismEventFilters = {}) {
    const where: Record<string, any> = { isPublished: true };
    if (filters.country) where.country = { equals: filters.country, mode: "insensitive" };
    if (filters.year) where.year = filters.year;
    if (filters.subcategory) where.subcategory = { equals: filters.subcategory, mode: "insensitive" };

    return prisma.tourismEvent.findMany({
      where,
      orderBy: [{ startDate: "asc" }, { title: "asc" }],
    });
  }

  static async findAll(filters: TourismEventFilters = {}) {
    const where: Record<string, any> = {};
    if (filters.country) where.country = { equals: filters.country, mode: "insensitive" };
    if (filters.year) where.year = filters.year;
    if (filters.subcategory) where.subcategory = { equals: filters.subcategory, mode: "insensitive" };
    if (filters.status) where.status = filters.status;

    return prisma.tourismEvent.findMany({
      where,
      orderBy: [{ year: "asc" }, { startDate: "asc" }, { title: "asc" }],
    });
  }

  static async findById(id: number) {
    return prisma.tourismEvent.findUnique({ where: { id } });
  }

  static async create(data: CreateTourismEventData & Record<string, any>) {
    const payload = toPayload(data);
    return prisma.tourismEvent.create({
      data: { ...payload, title: payload.title, status: payload.status ?? "proposed" },
    });
  }

  static async update(id: number, data: Partial<CreateTourismEventData> & Record<string, any>) {
    try {
      return await prisma.tourismEvent.update({ where: { id }, data: toPayload(data) });
    } catch (error: any) {
      if (error.code === "P2025") return null;
      throw error;
    }
  }

  static async delete(id: number) {
    try {
      await prisma.tourismEvent.delete({ where: { id } });
      return true;
    } catch (error: any) {
      if (error.code === "P2025") return false;
      throw error;
    }
  }
}
