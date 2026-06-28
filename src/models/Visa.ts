import prisma from "../../lib/prisma";

export interface CreateVisaData {
  originCountry: string;
  destinationCountry: string;
  visaRequired?: boolean;
  visaType?: string;
  processingTime?: string;
  cost?: number;
  documentsRequired?: string[];
  notes?: string;
}

export class VisaModel {
  static async findByRoute(from: string, to: string) {
    return prisma.visa.findUnique({
      where: { originCountry_destinationCountry: { originCountry: from, destinationCountry: to } },
    });
  }

  static async findById(id: number) {
    return prisma.visa.findUnique({ where: { id } });
  }

  static async findAll() {
    return prisma.visa.findMany({ orderBy: { originCountry: "asc" } });
  }

  static async create(data: CreateVisaData) {
    return prisma.visa.create({
      data: {
        originCountry: data.originCountry,
        destinationCountry: data.destinationCountry,
        visaRequired: data.visaRequired ?? true,
        visaType: data.visaType,
        processingTime: data.processingTime,
        cost: data.cost,
        documentsRequired: data.documentsRequired as any,
        notes: data.notes,
      },
    });
  }

  static async update(id: number, data: Partial<CreateVisaData>) {
    try {
      return await prisma.visa.update({
        where: { id },
        data: {
          originCountry: data.originCountry,
          destinationCountry: data.destinationCountry,
          visaRequired: data.visaRequired,
          visaType: data.visaType,
          processingTime: data.processingTime,
          cost: data.cost,
          documentsRequired: data.documentsRequired as any,
          notes: data.notes,
        },
      });
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
