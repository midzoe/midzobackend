import { NextRequest } from "next/server";
import type Stripe from "stripe";
import { corsJson } from "@/lib/cors";
import prisma from "@/lib/prisma";
import { getStripe, getWebhookSecret } from "@/lib/stripe";
import { sendPremiumWelcomeEmail } from "@/lib/email";
import { PurchaseModel } from "@/src/models/Purchase";

/**
 * Webhook Stripe → premium automatique (story 3.4, FR8).
 *
 * Appelée par Stripe, jamais par le front. Deux propriétés non négociables :
 *  1. SIGNATURE — sans elle, poster un JSON à la main suffirait à devenir premium.
 *  2. IDEMPOTENCE — Stripe rejoue ses webhooks (timeout, 5xx, retries), parfois en
 *     parallèle : un rejeu ne doit ni dupliquer l'achat ni la notification.
 */

/** Corps BRUT obligatoire : la signature porte sur les octets exacts. */
async function readRawBody(request: NextRequest): Promise<string> {
  return request.text();
}

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = getWebhookSecret();
  if (!stripe || !webhookSecret) {
    return corsJson({ error: "Stripe not configured" }, { status: 503 });
  }

  // ⚠️ Ne JAMAIS utiliser request.json() ici : re-sérialiser casse la signature.
  const rawBody = await readRawBody(request);
  const signature = request.headers.get("stripe-signature");

  let event: Stripe.Event;
  try {
    if (!signature) throw new Error("Missing stripe-signature header");
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error: any) {
    // Signature invalide = requête non authentique. 400, et surtout aucune écriture.
    console.error("Stripe webhook signature verification failed:", error?.message);
    return corsJson({ error: `Webhook signature verification failed: ${error?.message}` }, { status: 400 });
  }

  // Tout autre événement : 200 inerte. Un 4xx ferait rejouer Stripe indéfiniment.
  if (event.type !== "checkout.session.completed") {
    return corsJson({ received: true, ignored: event.type });
  }

  try {
    const session = event.data.object as Stripe.Checkout.Session;

    // Une session non payée (expirée, abandonnée) ne donne pas le premium.
    if (session.payment_status !== "paid") {
      return corsJson({ received: true, ignored: `payment_status=${session.payment_status}` });
    }

    const purchase = await findPurchase(session);
    if (!purchase) {
      // Ni retrouvable par metadata ni par session : rien à activer. 200 pour arrêter les rejeux
      // (un 5xx ferait boucler Stripe sur un événement qui ne guérira pas tout seul).
      console.error("Stripe webhook: no purchase for session", session.id);
      return corsJson({ received: true, ignored: "unknown purchase" });
    }

    const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : null;

    const result = await prisma.$transaction(async (tx) => {
      // 🚨 Transition atomique pending → paid. Si un autre rejeu l'a déjà faite, on sort
      // AVANT tout autre effet : c'est ce qui garantit une seule notification (AC7).
      const claimed = await PurchaseModel.markPaid(tx as any, purchase.id, paymentIntentId);
      if (!claimed) return { duplicate: true };

      const user = await tx.user.findUnique({
        where: { id: purchase.userId },
        select: { isPremium: true, email: true, firstName: true },
      });

      // `premiumSince` ne se réécrit pas : un second achat ne doit pas effacer l'ancienneté
      // du client (AC8). D'où la mise à jour conditionnelle plutôt que UserModel.activatePremium.
      await tx.user.update({
        where: { id: purchase.userId },
        data: user?.isPremium ? { isPremium: true } : { isPremium: true, premiumSince: new Date() },
      });

      await tx.notification.create({
        data: {
          userId: purchase.userId,
          type: "premium_purchase",
          title: "Bienvenue chez Midzo Premium",
          message:
            "Votre paiement est confirmé : votre compte est maintenant premium. Nous allons suivre votre dossier.",
          data: {
            purchase_id: purchase.id,
            amount_cents: purchase.amountCents,
            currency: purchase.currency,
          },
        },
      });

      // Données de l'email d'accompagnement (story 3.5) — envoyé APRÈS le commit, jamais ici.
      // `packageName` vient du snapshot du devis (fait foi au moment de l'achat), pas d'une re-requête.
      return {
        duplicate: false,
        email: user?.email ?? null,
        firstName: user?.firstName ?? null,
        packageName: (purchase.quote as any)?.package?.name ?? null,
        amountCents: purchase.amountCents,
        currency: purchase.currency,
      };
    });

    if (result.duplicate) return corsJson({ received: true, duplicate: true });

    // Email d'accompagnement (story 3.5, FR8b) : APRÈS le commit, best-effort.
    // Un échec SMTP ne doit pas faire échouer le webhook (un rejeu ne le renverrait pas :
    // l'achat serait déjà `paid`). On journalise et on répond 200. Uniquement sur le
    // passage effectif (branche non-duplicate) → un seul email par achat.
    if (result.email) {
      try {
        await sendPremiumWelcomeEmail(result.email, result.firstName, {
          packageName: result.packageName,
          amountCents: result.amountCents,
          currency: result.currency,
        });
      } catch (emailError) {
        console.error("Failed to send premium welcome email:", emailError);
      }
    }

    return corsJson({ received: true });
  } catch (error) {
    // 500 volontaire : Stripe rejouera, et l'idempotence rend le rejeu sûr.
    console.error("Stripe webhook handling error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

/** metadata.purchase_id d'abord (posé au checkout), repli sur la référence de session. */
async function findPurchase(session: Stripe.Checkout.Session) {
  const metadataId = session.metadata?.purchase_id;
  if (metadataId) {
    const byId = await PurchaseModel.findById(parseInt(metadataId));
    if (byId) return byId;
  }
  return PurchaseModel.findByStripeSessionId(session.id);
}
