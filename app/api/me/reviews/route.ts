import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";
import { paidPurchases } from "@/lib/reviews";

/** Mes avis et les achats pour lesquels je peux encore en déposer un. */
export async function GET(request: NextRequest) {
  try {
    const auth = authenticateRequest(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    const userId = parseInt(auth.userId);
    const [reviews, purchases] = await Promise.all([
      prisma.review.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
      paidPurchases(userId),
    ]);
    const reviewed = new Set(reviews.filter((r) => r.status !== "rejected").map((r) => r.purchaseId));
    return corsJson({
      success: true,
      data: {
        reviews: reviews.map((r) => ({ id: r.id, rating: r.rating, title: r.title, body: r.body, status: r.status, reject_reason: r.rejectReason, created_at: r.createdAt })),
        eligible: purchases.filter((p) => !reviewed.has(p.id)).map((p) => ({ purchase_id: p.id, offer_label: p.offerLabel ?? "Accompagnement Midzo" })),
      },
    });
  } catch (error) {
    console.error("My reviews error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
