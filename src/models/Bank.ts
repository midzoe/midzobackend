import prisma from "../../lib/prisma";

export interface BankAccountTypeData {
  id?: number;
  name: string;
  features?: string[];
  monthlyFee?: string;
  requirements?: string[];
  minimumDeposit?: string;
  cardType?: string;
  withdrawalLimit?: string;
  onlineBanking?: boolean;
  studentPerks?: string[];
}

export interface CreateBankData {
  name: string;
  country: string;
  image?: string;
  description?: string;
  isActive?: boolean;
  accountTypes?: BankAccountTypeData[];
}

const accountTypeCreate = (a: BankAccountTypeData) => ({
  name: a.name,
  features: a.features as any,
  monthlyFee: a.monthlyFee,
  requirements: a.requirements as any,
  minimumDeposit: a.minimumDeposit,
  cardType: a.cardType,
  withdrawalLimit: a.withdrawalLimit,
  onlineBanking: a.onlineBanking ?? true,
  studentPerks: a.studentPerks as any,
});

export class BankModel {
  static async findAll(filters: { country?: string } = {}) {
    return prisma.bank.findMany({
      where: {
        isActive: true,
        country: filters.country ? { equals: filters.country, mode: "insensitive" } : undefined,
      },
      include: { accountTypes: { orderBy: { id: "asc" } } },
      orderBy: [{ country: "asc" }, { name: "asc" }],
    });
  }

  static async findAllAdmin() {
    return prisma.bank.findMany({
      include: { accountTypes: { orderBy: { id: "asc" } } },
      orderBy: [{ country: "asc" }, { name: "asc" }],
    });
  }

  static async findById(id: number) {
    return prisma.bank.findUnique({
      where: { id },
      include: { accountTypes: { orderBy: { id: "asc" } } },
    });
  }

  static async create(data: CreateBankData) {
    return prisma.bank.create({
      data: {
        name: data.name,
        country: data.country,
        image: data.image,
        description: data.description,
        isActive: data.isActive ?? true,
        accountTypes: data.accountTypes?.length
          ? { create: data.accountTypes.map(accountTypeCreate) }
          : undefined,
      },
      include: { accountTypes: true },
    });
  }

  /**
   * `accountTypes` est remplacé en bloc quand il est fourni : les comptes d'une banque
   * se saisissent comme une liste, et un diff partiel donnerait des doublons silencieux.
   * Absent du payload => les comptes existants sont conservés tels quels.
   */
  static async update(id: number, data: Partial<CreateBankData>) {
    try {
      return await prisma.bank.update({
        where: { id },
        data: {
          name: data.name,
          country: data.country,
          image: data.image,
          description: data.description,
          isActive: data.isActive,
          accountTypes: data.accountTypes
            ? { deleteMany: {}, create: data.accountTypes.map(accountTypeCreate) }
            : undefined,
        },
        include: { accountTypes: { orderBy: { id: "asc" } } },
      });
    } catch (error: any) {
      if (error.code === "P2025") return null;
      throw error;
    }
  }

  static async delete(id: number) {
    try {
      await prisma.bank.delete({ where: { id } });
      return true;
    } catch (error: any) {
      if (error.code === "P2025") return false;
      throw error;
    }
  }
}
