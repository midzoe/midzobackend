import prisma from "../../lib/prisma";

export class PremiumCaseModel {
  /** Récupère le dossier premium d'un user, le crée à la volée s'il n'existe pas. */
  static async getOrCreate(userId: number) {
    const existing = await prisma.premiumCase.findUnique({ where: { userId } });
    if (existing) return existing;
    return prisma.premiumCase.create({ data: { userId } });
  }

  static async update(
    userId: number,
    data: { status?: string; notes?: string; assignedTo?: string; clientMessage?: string; nextStep?: string }
  ) {
    const fields = {
      status: data.status,
      notes: data.notes,
      assignedTo: data.assignedTo,
      clientMessage: data.clientMessage,
      nextStep: data.nextStep,
    };
    return prisma.premiumCase.upsert({ where: { userId }, create: { userId, ...fields }, update: fields });
  }
}
