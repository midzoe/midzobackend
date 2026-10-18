import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";
import { logAdminAction } from "@/lib/audit";
import { activateOfflinePurchase } from "@/lib/payments";
import { INSTALLMENTS } from "@/lib/grid-pricing";

/**
 * Journal des paiements (table `purchases`, story 3.4).
 *
 * Un paiement carte n'est jamais modifié ici : sa vérité est chez Stripe (rapprochement via
 * `stripe_session_id`). L'admin peut en revanche ENREGISTRER un paiement reçu hors ligne
 * (virement, Mobile Money, espèces) : POST ci-dessous.
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
    const userId = parseInt(searchParams.get("user_id") ?? "");

    const where: any = {
      ...(status ? { status } : {}),
      ...(Number.isInteger(userId) ? { userId } : {}),
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
              { offerLabel: { contains: search, mode: "insensitive" } },
              { reference: { contains: search, mode: "insensitive" } },
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
          stripeSubscriptionId: true,
          offerId: true,
          offerLabel: true,
          installments: true,
          installmentsPaid: true,
          method: true,
          reference: true,
          note: true,
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
      stripe_subscription_id: p.stripeSubscriptionId,
      offer_id: p.offerId,
      offer_label: p.offerLabel,
      installments: p.installments,
      installments_paid: p.installmentsPaid,
      method: p.method,
      reference: p.reference,
      note: p.note,
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

const METHODS = ["transfer", "mobile_money", "cash", "other"];

/**
 * Paiement reçu hors ligne : crée l'achat (offre, montant, échéances), active le premium,
 * ouvre le dossier, prévient le client — comme un paiement carte confirmé.
 * Body : { user_id, offer_label, offer_id?, package_id?, amount_cents, currency?, installments?,
 *          installments_paid?, method, reference?, note?, paid_at? }
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const b = await request.json().catch(() => ({}));
    const userId = Number(b?.user_id);
    const amountCents = Number(b?.amount_cents);
    const installments = Number(b?.installments ?? 1);
    const installmentsPaid = Number(b?.installments_paid ?? 1);
    const offerLabel = typeof b?.offer_label === "string" ? b.offer_label.trim() : "";
    if (!Number.isInteger(userId)) return corsJson({ error: "user_id is required" }, { status: 400 });
    if (!offerLabel) return corsJson({ error: "offer_label is required" }, { status: 400 });
    if (!Number.isInteger(amountCents) || amountCents <= 0) return corsJson({ error: "amount_cents must be a positive integer" }, { status: 400 });
    if (!(INSTALLMENTS as readonly number[]).includes(installments)) return corsJson({ error: "installments must be 1, 3, 6 or 12" }, { status: 400 });
    if (!Number.isInteger(installmentsPaid) || installmentsPaid < 1 || installmentsPaid > installments) {
      return corsJson({ error: "installments_paid must be between 1 and installments" }, { status: 400 });
    }
    if (!METHODS.includes(b?.method)) return corsJson({ error: `method must be ${METHODS.join("|")}` }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
    if (!user) return corsJson({ error: "User not found" }, { status: 404 });
    const packageId = Number.isInteger(Number(b?.package_id)) ? Number(b.package_id) : null;
    const pkg = packageId ? await prisma.package.findUnique({ where: { id: packageId }, select: { id: true } }) : null;

    const purchase = await prisma.purchase.create({
      data: {
        userId,
        packageId: pkg?.id ?? null,
        isCustom: !pkg,
        amountCents,
        currency: typeof b?.currency === "string" && b.currency ? b.currency.toUpperCase() : "EUR",
        quote: { source: "offline", offer_label: offerLabel, recorded_by: Number(auth.userId) } as any,
        status: "paid",
        paidAt: b?.paid_at ? new Date(b.paid_at) : new Date(),
        offerId: typeof b?.offer_id === "string" ? b.offer_id : null,
        offerLabel,
        installments,
        installmentsPaid,
        method: b.method,
        reference: typeof b?.reference === "string" && b.reference.trim() ? b.reference.trim() : null,
        note: typeof b?.note === "string" && b.note.trim() ? b.note.trim() : null,
        recordedBy: Number(auth.userId),
      },
    });
    await activateOfflinePurchase(purchase.id);
    await logAdminAction(auth.userId, "purchase.record", { type: "purchase", id: purchase.id, userId, details: { offerLabel, amountCents, installments, method: b.method } });
    return corsJson({ success: true, data: { id: purchase.id } }, { status: 201 });
  } catch (error) {
    console.error("Admin record purchase error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, POST, OPTIONS");
}
