import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { fulfillCheckoutSession } from "@/lib/payments";

/**
 * Retour de Stripe (page /payment/success) : relit la session CHEZ STRIPE et active l'achat
 * si le webhook ne l'a pas déjà fait. Même chemin idempotent que le webhook : aucun double
 * effet si les deux arrivent. Rien n'est cru du navigateur à part l'identifiant de session.
 */
export async function GET(request: NextRequest) {
  try {
    const auth = authenticateRequest(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    const stripe = getStripe();
    if (!stripe) return corsJson({ error: "Stripe not configured" }, { status: 503 });

    const sessionId = new URL(request.url).searchParams.get("session_id") ?? "";
    if (!sessionId.startsWith("cs_")) return corsJson({ error: "session_id is required" }, { status: 400 });

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.metadata?.user_id !== auth.userId) return corsJson({ error: "Not found" }, { status: 404 });

    await fulfillCheckoutSession(stripe, session);

    const purchase = await prisma.purchase.findUnique({ where: { stripeSessionId: sessionId } });
    if (!purchase) return corsJson({ error: "Not found" }, { status: 404 });
    return corsJson({
      success: true,
      payment_status: session.payment_status,
      purchase: {
        id: purchase.id,
        status: purchase.status,
        offer_label: purchase.offerLabel,
        amount_cents: purchase.amountCents,
        currency: purchase.currency,
        installments: purchase.installments,
        installments_paid: purchase.installmentsPaid,
        paid_at: purchase.paidAt,
      },
    });
  } catch (error: any) {
    if (error?.type === "StripeInvalidRequestError") return corsJson({ error: "Not found" }, { status: 404 });
    console.error("Payment confirm error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
