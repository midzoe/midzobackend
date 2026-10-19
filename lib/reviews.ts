import prisma from "@/lib/prisma";

/** Achats qui ouvrent le droit à un avis : payés (au moins une échéance encaissée). */
export async function paidPurchases(userId: number) {
  return prisma.purchase.findMany({
    where: { userId, status: { in: ["paid", "past_due"] }, installmentsPaid: { gte: 1 } },
    orderBy: { paidAt: "desc" },
    select: { id: true, offerId: true, offerLabel: true, quote: true },
  });
}

/** Famille de l'achat : consultation, mix, voyage ou études (pour classer l'avis). */
export function serviceOfPurchase(p: { offerId: string | null; quote: any }): "study" | "tourism" | "consultation" {
  if (p.offerId === "consultation") return "consultation";
  const lines: any[] = p.quote?.offer?.lines ?? [];
  if (lines.some((l) => l.family === "tourism") && !lines.some((l) => l.family === "study")) return "tourism";
  return "study";
}

export function publicReview(r: any) {
  return {
    id: r.id,
    author: r.authorName,
    country: r.country,
    service: r.service,
    destination: r.destination,
    rating: r.rating,
    title: r.title,
    body: r.body,
    verified: r.verified,
    admin_reply: r.adminReply,
    published_at: r.publishedAt,
  };
}
