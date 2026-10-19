import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";
import { paidPurchases, publicReview, serviceOfPurchase } from "@/lib/reviews";

/**
 * Avis clients. GET : avis publiés (?service=study|tourism|consultation, ?limit=) + statistiques
 * réelles (nombre, moyenne). POST : réservé aux clients ayant payé un accompagnement ; l'avis est
 * relu par l'équipe avant publication (contenu jamais modifié).
 */
export async function GET(request: NextRequest) {
  try {
    const sp = new URL(request.url).searchParams;
    const service = sp.get("service");
    const limit = Math.min(100, Math.max(1, parseInt(sp.get("limit") ?? "30")));
    const where: any = { status: "approved", ...(service ? { service } : {}) };
    const [rows, agg] = await prisma.$transaction([
      prisma.review.findMany({ where, orderBy: { publishedAt: "desc" }, take: limit }),
      prisma.review.aggregate({ where, _count: { _all: true }, _avg: { rating: true } }),
    ]);
    return corsJson({
      success: true,
      data: rows.map(publicReview),
      stats: { count: agg._count._all, average: agg._avg.rating ? Math.round(agg._avg.rating * 10) / 10 : null },
    });
  } catch (error) {
    console.error("Reviews error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = authenticateRequest(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    const userId = parseInt(auth.userId);
    const b = await request.json().catch(() => ({}));

    const rating = Number(b?.rating);
    const body = typeof b?.body === "string" ? b.body.trim() : "";
    const title = typeof b?.title === "string" ? b.title.trim().slice(0, 120) : "";
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) return corsJson({ error: "rating must be 1 to 5" }, { status: 400 });
    if (body.length < 20 || body.length > 3000) return corsJson({ error: "body must be 20 to 3000 characters" }, { status: 400 });

    const purchases = await paidPurchases(userId);
    if (!purchases.length) return corsJson({ error: "only customers with a paid support can post a review" }, { status: 403 });
    const purchase = purchases.find((p) => p.id === Number(b?.purchase_id)) ?? purchases[0];
    const already = await prisma.review.findFirst({ where: { userId, purchaseId: purchase.id, status: { in: ["pending", "approved"] } } });
    if (already) return corsJson({ error: "a review already exists for this purchase" }, { status: 409 });

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { firstName: true, lastName: true, username: true, nationality: true } });
    const authorName = user?.firstName
      ? `${user.firstName}${user.lastName ? ` ${user.lastName.charAt(0).toUpperCase()}.` : ""}`
      : (user?.username ?? "Client").split(/[._-]/)[0];

    const review = await prisma.review.create({
      data: {
        userId,
        purchaseId: purchase.id,
        authorName,
        country: typeof b?.country === "string" && b.country.trim() ? b.country.trim() : user?.nationality ?? null,
        service: serviceOfPurchase(purchase),
        destination: typeof b?.destination === "string" && b.destination.trim() ? b.destination.trim().slice(0, 80) : null,
        rating,
        title: title || null,
        body,
        verified: true,
      },
    });
    return corsJson({ success: true, data: { id: review.id, status: review.status } }, { status: 201 });
  } catch (error) {
    console.error("Create review error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, POST, OPTIONS");
}
