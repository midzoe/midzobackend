import prisma from "../../lib/prisma";

/**
 * Représentation diplomatique. `country` est le pays REPRÉSENTÉ (France),
 * `hostCountry` le pays où la mission se trouve (Togo). Story 4.8 : c'est ce
 * couple qui permet de répondre à « je pars du Togo pour la France, à quelle
 * ambassade dois-je m'adresser ? ».
 */
export interface CreateEmbassyData {
  country: string;
  name: string;
  location?: string | null;
  link?: string | null;
  email?: string | null;
  phone?: string | null;
  hostCountry?: string | null;
  city?: string | null;
  address?: string | null;
  mapsUrl?: string | null;
  type?: string | null;
  coveredCountries?: string[] | null;
  isValidated?: boolean;
}

export const EMBASSY_TYPES = [
  "Ambassade",
  "Consulat général",
  "Section consulaire",
  "Centre de dépôt",
];

const WRITABLE: (keyof CreateEmbassyData)[] = [
  "country", "name", "location", "link", "email", "phone",
  "hostCountry", "city", "address", "mapsUrl", "type", "coveredCountries", "isValidated",
];

/** Ne conserve que les champs fournis : une mise à jour partielle n'écrase pas le reste. */
function pickDefined(data: Partial<CreateEmbassyData>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of WRITABLE) {
    if (data[key] !== undefined) out[key] = data[key];
  }
  return out;
}

export class EmbassyModel {
  static async findAll() {
    return prisma.embassy.findMany({
      orderBy: [{ country: "asc" }, { hostCountry: "asc" }, { name: "asc" }],
    });
  }

  static async findByCountry(country: string) {
    return prisma.embassy.findMany({
      where: { country },
      orderBy: [{ hostCountry: "asc" }, { name: "asc" }],
    });
  }

  static async findById(id: number) {
    return prisma.embassy.findUnique({ where: { id } });
  }

  /**
   * Mission du pays `destination` compétente pour un demandeur résidant dans
   * `origin`. On privilégie la mission installée sur place ; à défaut, celle qui
   * déclare desservir ce pays (« l'ambassade de Suède à Abuja couvre le Togo »).
   * `publicOnly` applique le gate : une mission non vérifiée n'est pas montrée.
   */
  static async findCompetent(destination: string, origin: string, publicOnly = true) {
    const base = { country: destination, ...(publicOnly ? { isValidated: true } : {}) };

    const onSite = await prisma.embassy.findFirst({
      where: { ...base, hostCountry: origin },
      orderBy: { type: "asc" },
    });
    if (onSite) return onSite;

    return prisma.embassy.findFirst({
      where: { ...base, coveredCountries: { has: origin } },
      orderBy: { type: "asc" },
    });
  }

  static async create(data: CreateEmbassyData) {
    return prisma.embassy.create({
      data: {
        ...(pickDefined(data) as any),
        country: data.country,
        name: data.name,
      },
    });
  }

  static async update(id: number, data: Partial<CreateEmbassyData>) {
    try {
      return await prisma.embassy.update({ where: { id }, data: pickDefined(data) as any });
    } catch (error: any) {
      if (error.code === "P2025") return null;
      throw error;
    }
  }

  static async delete(id: number) {
    try {
      await prisma.embassy.delete({ where: { id } });
      return true;
    } catch (error: any) {
      if (error.code === "P2025") return false;
      throw error;
    }
  }
}
