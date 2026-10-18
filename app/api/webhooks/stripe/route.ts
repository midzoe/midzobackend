import { NextRequest } from "next/server";
import type Stripe from "stripe";
import { corsJson } from "@/lib/cors";
import { getStripe, getWebhookSecret } from "@/lib/stripe";
import { fulfillCheckoutSession, recordInvoiceFailed, recordInvoicePaid } from "@/lib/payments";

/**
 * Webhook Stripe → premium automatique (story 3.4, FR8) + échéances (paiement en 3/6/12 fois).
 *
 * Appelée par Stripe, jamais par le front. Deux propriétés non négociables :
 *  1. SIGNATURE — sans elle, poster un JSON à la main suffirait à devenir premium.
 *  2. IDEMPOTENCE — Stripe rejoue ses webhooks (timeout, 5xx, retries), parfois en
 *     parallèle : un rejeu ne doit ni dupliquer l'achat, ni l'échéance, ni la notification.
 *
 * Événements à cocher dans le tableau de bord Stripe : checkout.session.completed,
 * checkout.session.async_payment_succeeded, invoice.paid, invoice.payment_failed.
 */
export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = getWebhookSecret();
  if (!stripe || !webhookSecret) {
    return corsJson({ error: "Stripe not configured" }, { status: 503 });
  }

  // ⚠️ Corps BRUT : la signature porte sur les octets exacts (jamais request.json()).
  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature");

  let event: Stripe.Event;
  try {
    if (!signature) throw new Error("Missing stripe-signature header");
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error: any) {
    console.error("Stripe webhook signature verification failed:", error?.message);
    return corsJson({ error: `Webhook signature verification failed: ${error?.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const result = await fulfillCheckoutSession(stripe, event.data.object as Stripe.Checkout.Session);
        return corsJson({ received: true, result: result ?? "unknown purchase" });
      }
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        // La 1re facture d'un abonnement est comptée à l'activation (checkout.session.completed).
        return corsJson({ received: true, result: await recordInvoicePaid(invoice) });
      }
      case "invoice.payment_failed":
        return corsJson({ received: true, result: await recordInvoiceFailed(event.data.object as Stripe.Invoice) });
      default:
        // Tout autre événement : 200 inerte. Un 4xx ferait rejouer Stripe indéfiniment.
        return corsJson({ received: true, ignored: event.type });
    }
  } catch (error) {
    // 500 volontaire : Stripe rejouera, et l'idempotence rend le rejeu sûr.
    console.error("Stripe webhook handling error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}
