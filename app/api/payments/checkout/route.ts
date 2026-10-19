import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { INSTALLMENTS, loadGrid, offersFor, paymentPlan } from "@/lib/grid-pricing";

/**
 * Paiement en ligne d'une offre de la grille tarifaire (Stripe Checkout).
 *
 * Body : { codes: ["S9","S11",…], offer_id?: "study-plus" | "alacarte" | "consultation" | …,
 *          installments?: 1 | 3 | 6 | 12, trip_id?: number }
 *
 * 🚨 Le montant est RECALCULÉ ici depuis la base (services, paliers, remises). Le navigateur
 * n'envoie jamais de prix. 1× = paiement unique ; 3/6/12× = abonnement mensuel borné au
 * nombre d'échéances (arrêté automatiquement après la dernière).
 */
export async function POST(request: NextRequest) {
  try {
    const auth = authenticateRequest(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    const userId = parseInt(auth.userId);

    const stripe = getStripe();
    if (!stripe) return corsJson({ error: "Stripe not configured" }, { status: 503 });

    const body = await request.json().catch(() => ({}));
    // CGV et politique de remboursement acceptées avant tout paiement (horodatées dans l'achat).
    if (body?.accept_terms !== true) {
      return corsJson({ error: "terms must be accepted (accept_terms: true)" }, { status: 400 });
    }
    const codes: string[] = Array.isArray(body?.codes) ? body.codes.filter((c: unknown) => typeof c === "string") : [];
    const installments = Number(body?.installments ?? 1);
    if (!(INSTALLMENTS as readonly number[]).includes(installments)) {
      return corsJson({ error: "installments must be 1, 3, 6 or 12" }, { status: 400 });
    }

    const grid = await loadGrid();
    const travelers = Math.max(1, Math.min(50, Math.floor(Number(body?.travelers ?? 1)) || 1));
    const { services, unknown, offers } = offersFor(codes, grid, { travelers });
    if (unknown.length) return corsJson({ error: `unknown service codes: ${unknown.join(", ")}` }, { status: 400 });

    const requested = typeof body?.offer_id === "string" ? body.offer_id : null;
    const offer = requested
      ? offers.find((o) => o.id === requested)
      : offers.find((o) => o.id !== "consultation");
    if (!offer) {
      return corsJson({ error: requested ? `offer ${requested} does not cover this selection` : "select at least one service" }, { status: 422 });
    }
    // La consultation est un prix fixe (25 €), réglé en une fois et sans remise — comme l'affiche le site.
    const plan = offer.id === "consultation"
      ? { installments: 1, discountPct: 0, perInstallmentCents: offer.priceCents, totalCents: offer.priceCents }
      : paymentPlan(offer.priceCents, installments, grid);
    if (plan.totalCents <= 0) return corsJson({ error: "offer price is 0" }, { status: 422 });

    let tripId: number | null = null;
    if (body?.trip_id) {
      const trip = await prisma.trip.findFirst({ where: { id: Number(body.trip_id), userId }, select: { id: true } });
      tripId = trip?.id ?? null;
    }

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
    const singleTier = offer.lines.length === 1 ? offer.lines[0].packageId ?? null : null;
    const quote = {
      source: "grid",
      offer,
      plan,
      services: services.map((s) => ({ code: s.code, name: s.name, price_cents: s.price_cents })),
      travelers,
      traveler_policy: grid.traveler_policy,
      currency: grid.currency,
      terms: { accepted_at: new Date().toISOString(), version: typeof body?.terms_version === "string" ? body.terms_version : null },
    };

    // Créé AVANT la session : le webhook ne peut pas arriver avant la ligne.
    const purchase = await prisma.purchase.create({
      data: {
        userId,
        packageId: singleTier,
        isCustom: offer.id === "alacarte",
        amountCents: plan.totalCents,
        currency: grid.currency,
        quote: quote as any,
        status: "pending",
        offerId: offer.id,
        offerLabel: offer.label,
        installments: plan.installments,
        method: "stripe",
        tripId,
      },
    });

    const frontend = process.env.FRONTEND_URL || "http://localhost:5173";
    const successUrl = `${frontend}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${frontend}/payment/cancel?purchase=${purchase.id}`;
    const metadata = { purchase_id: String(purchase.id), user_id: String(userId), offer_id: offer.id };
    const description = services.length ? services.map((s) => s.name).join(", ").slice(0, 450) : undefined;

    try {
      const session = plan.installments > 1
        ? await stripe.checkout.sessions.create({
            mode: "subscription",
            client_reference_id: String(userId),
            customer_email: user?.email,
            metadata,
            subscription_data: { metadata, description: `${offer.label} — ${plan.installments} échéances` },
            line_items: [{
              quantity: 1,
              price_data: {
                currency: grid.currency.toLowerCase(),
                unit_amount: plan.perInstallmentCents,
                recurring: { interval: "month" },
                product_data: { name: `${offer.label} — paiement en ${plan.installments} fois`, description },
              },
            }],
            success_url: successUrl,
            cancel_url: cancelUrl,
          })
        : await stripe.checkout.sessions.create({
            mode: "payment",
            client_reference_id: String(userId),
            customer_email: user?.email,
            metadata,
            payment_intent_data: { metadata },
            line_items: [{
              quantity: 1,
              price_data: {
                currency: grid.currency.toLowerCase(),
                unit_amount: plan.totalCents,
                product_data: { name: offer.label, description },
              },
            }],
            success_url: successUrl,
            cancel_url: cancelUrl,
          });

      await prisma.purchase.update({ where: { id: purchase.id }, data: { stripeSessionId: session.id } });
      return corsJson({ success: true, checkout_url: session.url, session_id: session.id, purchase_id: purchase.id, offer: { id: offer.id, label: offer.label }, plan });
    } catch (stripeError: any) {
      await prisma.purchase.deleteMany({ where: { id: purchase.id, status: "pending" } });
      console.error("Stripe checkout error:", stripeError);
      return corsJson({ error: `Stripe error: ${stripeError?.message ?? "unknown"}` }, { status: 502 });
    }
  } catch (error) {
    console.error("Payment checkout error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("POST, OPTIONS");
}
