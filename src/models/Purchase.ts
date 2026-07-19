import prisma from "../../lib/prisma";
import type { Quote } from "./Quote";

/**
 * Achats de packages (story 3.4).
 *
 * `markPaid` porte l'idempotence du webhook Stripe : voir son commentaire.
 */

export interface CreatePurchaseData {
  userId: number;
  packageId: number | null;
  isCustom: boolean;
  amountCents: number;
  currency: string;
  quote: Quote;
}

function formatPurchase(p: any) {
  return {
    id: p.id,
    user_id: p.userId,
    package_id: p.packageId ?? null,
    is_custom: p.isCustom,
    amount_cents: p.amountCents,
    currency: p.currency,
    quote: p.quote,
    status: p.status,
    stripe_session_id: p.stripeSessionId ?? null,
    created_at: p.createdAt,
    paid_at: p.paidAt ?? null,
  };
}

export class PurchaseModel {
  /** Créé en `pending` AVANT la session Stripe : le webhook ne peut pas arriver avant la ligne. */
  static async create(data: CreatePurchaseData) {
    return prisma.purchase.create({
      data: {
        userId: data.userId,
        packageId: data.packageId,
        isCustom: data.isCustom,
        amountCents: data.amountCents,
        currency: data.currency,
        quote: data.quote as any,
        status: "pending",
      },
    });
  }

  static async attachSession(id: number, stripeSessionId: string) {
    return prisma.purchase.update({ where: { id }, data: { stripeSessionId } });
  }

  static async findById(id: number) {
    return prisma.purchase.findUnique({ where: { id } });
  }

  static async findByStripeSessionId(stripeSessionId: string) {
    return prisma.purchase.findUnique({ where: { stripeSessionId } });
  }

  static async findByUser(userId: number) {
    const purchases = await prisma.purchase.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return purchases.map(formatPurchase);
  }

  /** Une session Stripe créée puis jamais payée ne doit pas laisser de trace. */
  static async deleteIfPending(id: number) {
    await prisma.purchase.deleteMany({ where: { id, status: "pending" } });
  }

  /**
   * Transition `pending` → `paid`, ATOMIQUE.
   *
   * 🚨 C'est le cœur de l'idempotence (AC7). Stripe rejoue ses webhooks, parfois en
   * parallèle : un `findUnique` suivi d'un `if (status === "paid")` puis d'un `update`
   * laisse une fenêtre de course où deux rejeux lisent `pending` tous les deux et
   * créent deux notifications pour un seul paiement.
   *
   * Le `updateMany` conditionnel fait de la transition une seule opération en base :
   * un seul appelant obtient `count === 1` et poursuit ; les autres obtiennent `0`
   * et sortent. Ne jamais « simplifier » en update inconditionnel.
   *
   * @returns true si CET appel a effectué la transition (donc doit poursuivre les effets)
   */
  static async markPaid(
    tx: { purchase: { updateMany: (args: any) => Promise<{ count: number }> } },
    id: number,
    stripePaymentIntentId: string | null
  ): Promise<boolean> {
    const { count } = await tx.purchase.updateMany({
      where: { id, status: "pending" },
      data: { status: "paid", paidAt: new Date(), stripePaymentIntentId },
    });
    return count === 1;
  }
}
