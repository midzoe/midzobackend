import prisma from "../../lib/prisma";

export interface CreateStudyCountryData {
  name: string;
  nameFr?: string;
  region?: string;
  capital?: string;
  flag?: string;
  image?: string;
  description?: string;
  languageInstruction?: string[];
  tuitionRange?: string;
  livingCost?: string;
  visaDifficulty?: string;
  scholarshipAvailable?: boolean;
  popularScholarships?: string[];
  popularPrograms?: string[];
  admissionRequirements?: string[];
  topUniversities?: string[];
  processingTimeVisa?: string;
  studyAvailable?: boolean;
  isValidated?: boolean;
}

export class StudyCountryModel {
  static async findAll() {
    return prisma.studyCountry.findMany({ orderBy: { name: "asc" } });
  }

  static async findById(id: number) {
    return prisma.studyCountry.findUnique({ where: { id } });
  }

  static async create(data: CreateStudyCountryData) {
    return prisma.studyCountry.create({
      data: {
        name: data.name,
        nameFr: data.nameFr,
        region: data.region,
        capital: data.capital,
        flag: data.flag,
        image: data.image,
        description: data.description,
        languageInstruction: data.languageInstruction ?? [],
        tuitionRange: data.tuitionRange,
        livingCost: data.livingCost,
        visaDifficulty: data.visaDifficulty,
        scholarshipAvailable: data.scholarshipAvailable ?? false,
        popularScholarships: data.popularScholarships ?? [],
        popularPrograms: data.popularPrograms ?? [],
        admissionRequirements: data.admissionRequirements ?? [],
        topUniversities: data.topUniversities ?? [],
        processingTimeVisa: data.processingTimeVisa,
        studyAvailable: data.studyAvailable ?? true,
        isValidated: data.isValidated ?? false,
      },
    });
  }

  static async update(id: number, data: Partial<CreateStudyCountryData>) {
    try {
      return await prisma.studyCountry.update({ where: { id }, data });
    } catch (error: any) {
      if (error.code === "P2025") return null;
      throw error;
    }
  }

  static async delete(id: number) {
    try {
      await prisma.studyCountry.delete({ where: { id } });
      return true;
    } catch (error: any) {
      if (error.code === "P2025") return false;
      throw error;
    }
  }
}
