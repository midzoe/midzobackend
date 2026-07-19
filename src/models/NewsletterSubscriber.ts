import prisma from "../../lib/prisma";

export type NewsletterType = "study" | "tourism";

export class NewsletterSubscriberModel {
  /** Upsert d'un abonné non-utilisateur : (dés)abonne au type demandé sans toucher l'autre. */
  static async setSubscription(email: string, type: NewsletterType, subscribed: boolean) {
    const field = type === "study" ? "study" : "tourism";
    return prisma.newsletterSubscriber.upsert({
      where: { email },
      create: { email, [field]: subscribed } as any,
      update: { [field]: subscribed } as any,
    });
  }

  static async findByEmail(email: string) {
    return prisma.newsletterSubscriber.findUnique({ where: { email } });
  }

  static async findAll() {
    return prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } });
  }

  /** Emails des abonnés non-utilisateurs à un type donné (pour les campagnes 8.5). */
  static async recipientsForType(type: NewsletterType) {
    const rows = await prisma.newsletterSubscriber.findMany({
      where: type === "study" ? { study: true } : { tourism: true },
      select: { email: true },
    });
    return rows.map((r) => r.email);
  }
}
