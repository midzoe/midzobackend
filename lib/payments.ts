import type Stripe from "stripe";
import prisma from "@/lib/prisma";
import { sendPremiumWelcomeEmail, sendPlainEmail } from "@/lib/email";
import { PremiumCaseModel } from "@/src/models/PremiumCase";

/**
 * Activation après paiement — partagée par le webhook Stripe, la page de retour (confirmation
 * côté serveur si le webhook tarde) et l'enregistrement d'un paiement hors ligne par l'admin.
 *
 * 🚨 Idempotence : la transition `pending → paid` est un `updateMany` conditionnel ; seul
 * l'appel qui l'effectue déclenche premium, dossier, notification et email.
 */

export interface FulfillResult { purchaseId: number; activated: boolean }

/** Premium + dossier ouvert + notification ; email d'accompagnement après coup (best-effort). */
async function activate(purchaseId: number) {
  const purchase = await prisma.purchase.findUnique({ where: { id: purchaseId } });
  if (!purchase) return;
  const user = await prisma.user.findUnique({ where: { id: purchase.userId }, select: { isPremium: true, email: true, firstName: true } });
  await prisma.user.update({
    where: { id: purchase.userId },
    data: user?.isPremium ? { isPremium: true } : { isPremium: true, premiumSince: new Date() },
  });
  const kase = await PremiumCaseModel.getOrCreate(purchase.userId);
  if (kase?.status === "closed") await PremiumCaseModel.update(purchase.userId, { status: "open" });

  const label = purchase.offerLabel ?? (purchase.quote as any)?.package?.name ?? "votre package";
  const plan = purchase.installments > 1 ? ` (paiement en ${purchase.installments} fois)` : "";
  await prisma.notification.create({
    data: {
      userId: purchase.userId,
      type: "premium_purchase",
      title: "Paiement confirmé",
      message: `Votre paiement pour ${label}${plan} est confirmé : votre dossier est ouvert et un conseiller MIDZOE vous accompagne.`,
      data: { purchase_id: purchase.id, amount_cents: purchase.amountCents, currency: purchase.currency },
    },
  });
  if (user?.email) {
    try {
      await sendPremiumWelcomeEmail(user.email, user.firstName ?? null, {
        packageName: `${label}${plan}`,
        amountCents: purchase.amountCents,
        currency: purchase.currency,
      });
    } catch (e) {
      console.error("Premium welcome email failed:", e);
    }
  }
}

/** Fin de mois +n en conservant le jour (borné au dernier jour du mois). */
function addMonths(date: Date, n: number) {
  const d = new Date(date);
  const day = d.getUTCDate();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + n);
  const last = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
  d.setUTCDate(Math.min(day, last));
  return d;
}

/** Session Checkout terminée (paiement unique ou 1re échéance d'un abonnement borné). */
export async function fulfillCheckoutSession(stripe: Stripe, session: Stripe.Checkout.Session): Promise<FulfillResult | null> {
  const metaId = session.metadata?.purchase_id;
  const purchase =
    (metaId ? await prisma.purchase.findUnique({ where: { id: parseInt(metaId) } }) : null) ??
    (await prisma.purchase.findUnique({ where: { stripeSessionId: session.id } }));
  if (!purchase) return null;
  if (session.payment_status !== "paid") return { purchaseId: purchase.id, activated: false };

  const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id ?? null;
  const invoiceId = typeof session.invoice === "string" ? session.invoice : session.invoice?.id ?? null;
  const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : null;

  const { count } = await prisma.purchase.updateMany({
    where: { id: purchase.id, status: "pending" },
    data: {
      status: "paid",
      paidAt: new Date(),
      stripePaymentIntentId: paymentIntentId,
      stripeSubscriptionId: subscriptionId,
      installmentsPaid: 1,
      paidInvoiceIds: invoiceId ? [invoiceId] : [],
    },
  });
  if (count !== 1) return { purchaseId: purchase.id, activated: false };

  // Abonnement borné : il s'arrête de lui-même après la dernière échéance, même si un webhook
  // est perdu (cancel_at posé une fois pour toutes, sans prorata).
  if (subscriptionId && purchase.installments > 1) {
    try {
      const cancelAt = addMonths(new Date(), purchase.installments - 1);
      cancelAt.setUTCDate(cancelAt.getUTCDate() + 7);
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at: Math.floor(cancelAt.getTime() / 1000),
        proration_behavior: "none",
        metadata: { purchase_id: String(purchase.id), installments: String(purchase.installments) },
      });
    } catch (e) {
      console.error("Subscription cancel_at failed:", e);
    }
  }

  await activate(purchase.id);
  return { purchaseId: purchase.id, activated: true };
}

/** Abonnement d'une facture : `parent.subscription_details` (API récente) ou `subscription` (ancienne). */
function subscriptionOf(invoice: Stripe.Invoice): string | null {
  const any = invoice as any;
  const ref = any.parent?.subscription_details?.subscription ?? any.subscription ?? null;
  return typeof ref === "string" ? ref : ref?.id ?? null;
}

/** Échéance suivante encaissée (invoice.paid) : comptée une seule fois par facture. */
export async function recordInvoicePaid(invoice: Stripe.Invoice) {
  const subscriptionId = subscriptionOf(invoice);
  if (!subscriptionId || !invoice.id) return { ignored: "no subscription" };
  const purchase = await prisma.purchase.findUnique({ where: { stripeSubscriptionId: subscriptionId } });
  if (!purchase) return { ignored: "unknown subscription" };
  if (purchase.paidInvoiceIds.includes(invoice.id)) return { duplicate: true };
  await prisma.purchase.update({
    where: { id: purchase.id },
    data: {
      paidInvoiceIds: { push: invoice.id },
      installmentsPaid: Math.min(purchase.installments, purchase.installmentsPaid + 1),
      status: purchase.status === "past_due" ? "paid" : purchase.status,
    },
  });
  return { counted: true };
}

/** Échéance refusée : achat « en retard », client prévenu (notification + email). */
export async function recordInvoiceFailed(invoice: Stripe.Invoice) {
  const subscriptionId = subscriptionOf(invoice);
  if (!subscriptionId) return { ignored: "no subscription" };
  const purchase = await prisma.purchase.findUnique({ where: { stripeSubscriptionId: subscriptionId }, include: { user: { select: { email: true, firstName: true } } } });
  if (!purchase || purchase.status === "past_due") return { ignored: "unknown or already past due" };
  await prisma.purchase.update({ where: { id: purchase.id }, data: { status: "past_due" } });
  const title = "Échéance refusée";
  const message = `Le prélèvement de votre échéance pour ${purchase.offerLabel ?? "votre package"} a été refusé. Mettez à jour votre carte depuis le lien reçu de Stripe ou contactez votre conseiller.`;
  await prisma.notification.create({ data: { userId: purchase.userId, type: "payment_failed", title, message, data: { purchase_id: purchase.id } } });
  if (purchase.user?.email) {
    try { await sendPlainEmail(purchase.user.email, `Midzoe — ${title}`, [purchase.user.firstName ? `Bonjour ${purchase.user.firstName},` : "Bonjour,", message]); }
    catch (e) { console.error("Payment failed email error:", e); }
  }
  return { pastDue: true };
}

/** Paiement reçu hors ligne (virement, Mobile Money, espèces) : même activation qu'un paiement carte. */
export async function activateOfflinePurchase(purchaseId: number) {
  await activate(purchaseId);
}
