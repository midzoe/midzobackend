import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";

/**
 * Journal des paiements (table `purchases`, story 3.4).
 *
 * Lecture seule, volontairement : la vérité d'un paiement est chez Stripe, et une ligne
 * `paid` porte le snapshot du devis au moment de l'achat. L'admin ne doit ni la modifier
 * ni la supprimer — il la consulte, la recherche et la rapproche du dashboard Stripe via
 * `stripe_session_id`.
 *
 * Les montants sont en **centimes** et peuvent cohabiter en plusieurs devises : les
 * totaux sont donc agrégés par devise, jamais additionnés à l'aveugle.
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "25")));
    const skip = (page - 1) * limit;
    const status = searchParams.get("status") ?? ""; // "paid" | "pending" | ""
    const kind = searchParams.get("kind") ?? "";     // "custom" | "package" | ""
    const search = (searchParams.get("search") ?? "").trim();

    const where: any = {
      ...(status ? { status } : {}),
      ...(kind ? { isCustom: kind === "custom" } : {}),
      ...(search
        ? {
            OR: [
              { stripeSessionId: { contains: search, mode: "insensitive" } },
              { stripePaymentIntentId: { contains: search, mode: "insensitive" } },
              { user: { email: { contains: search, mode: "insensitive" } } },
              { user: { username: { contains: search, mode: "insensitive" } } },
              { user: { firstName: { contains: search, mode: "insensitive" } } },
              { user: { lastName: { contains: search, mode: "insensitive" } } },
              { package: { name: { contains: search, mode: "insensitive" } } },
            ],
          }
        : {}),
    };

    const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [rows, total, paidAgg, pendingAgg, paid30d, customPaid] = await Promise.all([
      prisma.purchase.findMany({
        where,
        select: {
          id: true,
          amountCents: true,
          currency: true,
          status: true,
          isCustom: true,
          quote: true,
          stripeSessionId: true,
          stripePaymentIntentId: true,
          createdAt: true,
          paidAt: true,
          package: { select: { id: true, name: true } },
          user: {
            select: { id: true, email: true, username: true, firstName: true, lastName: true, isPremium: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.purchase.count({ where }),
      // Les KPI portent sur TOUT le journal, pas sur la page filtrée.
      prisma.purchase.groupBy({ by: ["currency"], where: { status: "paid" }, _count: { _all: true }, _sum: { amountCents: true } }),
      prisma.purchase.groupBy({ by: ["currency"], where: { status: "pending" }, _count: { _all: true }, _sum: { amountCents: true } }),
      prisma.purchase.groupBy({ by: ["currency"], where: { status: "paid", paidAt: { gte: since30d } }, _count: { _all: true }, _sum: { amountCents: true } }),
      prisma.purchase.count({ where: { status: "paid", isCustom: true } }),
    ]);

    const byCurrency = (agg: typeof paidAgg) =>
      agg.map(r => ({ currency: r.currency, count: r._count._all, amount_cents: r._sum.amountCents ?? 0 }));

    const paid = byCurrency(paidAgg);
    const paidCount = paid.reduce((s, r) => s + r.count, 0);

    const data = rows.map(p => ({
      id: p.id,
      amount_cents: p.amountCents,
      currency: p.currency,
      status: p.status,
      is_custom: p.isCustom,
      quote: p.quote,
      stripe_session_id: p.stripeSessionId,
      stripe_payment_intent_id: p.stripePaymentIntentId,
      created_at: p.createdAt,
      paid_at: p.paidAt,
      package: p.package,
      user: p.user,
    }));

    return corsJson({
      success: true,
      data,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      stats: {
        paid,
        pending: byCurrency(pendingAgg),
        last30d: byCurrency(paid30d),
        paid_count: paidCount,
        pending_count: byCurrency(pendingAgg).reduce((s, r) => s + r.count, 0),
        custom_paid_count: customPaid,
      },
    });
  } catch (error) {
    console.error("Admin purchases error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
