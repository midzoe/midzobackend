import prisma from "../../lib/prisma";

// Grille tarifaire : prix unitaire des services (S1..S11 études, T1..T10 tourisme).
export interface PricedServiceData {
  code: string;
  family: string;
  name: string;
  complexity?: string;
  priceCents: number;
  currency?: string;
  order?: number;
  isActive?: boolean;
}

const ORDER = [{ family: "asc" as const }, { order: "asc" as const }, { code: "asc" as const }];

export class PricedServiceModel {
  static async findActive() {
    return prisma.pricedService.findMany({ where: { isActive: true }, orderBy: ORDER });
  }

  static async findAllAdmin() {
    return prisma.pricedService.findMany({ orderBy: ORDER });
  }

  static async create(data: PricedServiceData) {
    return prisma.pricedService.create({ data });
  }

  static async update(id: number, data: Partial<PricedServiceData>) {
    try {
      return await prisma.pricedService.update({ where: { id }, data });
    } catch (error: any) {
      if (error.code === "P2025") return null;
      throw error;
    }
  }

  static async delete(id: number) {
    try {
      await prisma.pricedService.delete({ where: { id } });
      return true;
    } catch (error: any) {
      if (error.code === "P2025") return false;
      throw error;
    }
  }
}
