import prisma from "../../lib/prisma";

export type NotificationType = "visa_alert" | "newsletter" | "trip_reminder" | "premium_purchase";

export interface CreateNotificationData {
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
}

export class NotificationModel {
  static async findByUser(userId: number) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async findById(id: number) {
    return prisma.notification.findUnique({ where: { id } });
  }

  static async create(data: CreateNotificationData) {
    return prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        data: data.data as any,
      },
    });
  }

  /**
   * Story 4.4 : crée une alerte visa pour un premium, sans doublon par destination.
   * Clé logique = (userId, type=visa_alert, data.destination).
   */
  static async createVisaAlertIfAbsent(
    userId: number,
    destination: string,
    title: string,
    message: string
  ) {
    const existing = await prisma.notification.findFirst({
      where: {
        userId,
        type: "visa_alert",
        data: { path: ["destination"], equals: destination },
      },
    });
    if (existing) return { created: false, notification: existing };

    const notification = await this.create({
      userId,
      type: "visa_alert",
      title,
      message,
      data: { destination },
    });
    return { created: true, notification };
  }

  static async markRead(id: number, userId: number) {
    try {
      return await prisma.notification.update({
        where: { id, userId },
        data: { isRead: true },
      });
    } catch (error: any) {
      if (error.code === "P2025") return null;
      throw error;
    }
  }
}
