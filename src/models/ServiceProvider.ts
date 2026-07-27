import prisma from "../../lib/prisma";

/** Les trois pages « démarches » partagent cette table, distinguées par serviceType. */
export const SERVICE_PROVIDER_TYPES = ["work_visa", "legalization", "recognition"] as const;
export type ServiceProviderType = (typeof SERVICE_PROVIDER_TYPES)[number];

export interface CreateServiceProviderData {
  provider: string;
  country: string;
  serviceType: string;
  services?: string[];
  visaTypes?: string[];
  acceptedDegrees?: string[];
  documentTypes?: string[];
  processingTime?: string;
  price?: string;
  requirements?: string[];
  features?: string[];
  successRate?: string;
  rating?: number;
  link?: string;
  isActive?: boolean;
}

export class ServiceProviderModel {
  static async findAll(filters: { serviceType?: string; country?: string } = {}) {
    return prisma.serviceProvider.findMany({
      where: {
        isActive: true,
        // serviceType inconnu => aucun filtre plutôt qu'une liste vide trompeuse.
        serviceType: SERVICE_PROVIDER_TYPES.includes(filters.serviceType as ServiceProviderType)
          ? filters.serviceType
          : undefined,
        country: filters.country ? { equals: filters.country, mode: "insensitive" } : undefined,
      },
      orderBy: [{ country: "asc" }, { provider: "asc" }],
    });
  }

  static async findAllAdmin() {
    return prisma.serviceProvider.findMany({
      orderBy: [{ serviceType: "asc" }, { country: "asc" }, { provider: "asc" }],
    });
  }

  static async findById(id: number) {
    return prisma.serviceProvider.findUnique({ where: { id } });
  }

  static async create(data: CreateServiceProviderData) {
    return prisma.serviceProvider.create({
      data: {
        provider: data.provider,
        country: data.country,
        serviceType: data.serviceType,
        services: data.services as any,
        visaTypes: data.visaTypes as any,
        acceptedDegrees: data.acceptedDegrees as any,
        documentTypes: data.documentTypes as any,
        processingTime: data.processingTime,
        price: data.price,
        requirements: data.requirements as any,
        features: data.features as any,
        successRate: data.successRate,
        rating: data.rating,
        link: data.link,
        isActive: data.isActive ?? true,
      },
    });
  }

  static async update(id: number, data: Partial<CreateServiceProviderData>) {
    try {
      return await prisma.serviceProvider.update({
        where: { id },
        data: {
          provider: data.provider,
          country: data.country,
          serviceType: data.serviceType,
          services: data.services as any,
          visaTypes: data.visaTypes as any,
          acceptedDegrees: data.acceptedDegrees as any,
          documentTypes: data.documentTypes as any,
          processingTime: data.processingTime,
          price: data.price,
          requirements: data.requirements as any,
          features: data.features as any,
          successRate: data.successRate,
          rating: data.rating,
          link: data.link,
          isActive: data.isActive,
        },
      });
    } catch (error: any) {
      if (error.code === "P2025") return null;
      throw error;
    }
  }

  static async delete(id: number) {
    try {
      await prisma.serviceProvider.delete({ where: { id } });
      return true;
    } catch (error: any) {
      if (error.code === "P2025") return false;
      throw error;
    }
  }
}
