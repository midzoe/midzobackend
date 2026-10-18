import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";

/**
 * Suivi vu par le client : état de son dossier (statut, conseiller, message, prochaine
 * étape — jamais les notes internes), ses achats et l'avancement de ses services.
 */
export async function GET(request: NextRequest) {
  try {
    const auth = authenticateRequest(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    const userId = parseInt(auth.userId);

    const [user, kase, purchases, trips] = await prisma.$transaction([
      prisma.user.findUnique({ where: { id: userId }, select: { isPremium: true, premiumSince: true } }),
      prisma.premiumCase.findUnique({ where: { userId } }),
      prisma.purchase.findMany({ where: { userId, status: { not: "pending" } }, orderBy: { createdAt: "desc" } }),
      prisma.trip.findMany({ where: { userId }, include: { services: true } }),
    ]);

    const services = trips.flatMap((t) => t.services)
      .filter((s) => s.status !== "cancelled" && s.type !== "study_project" && s.type !== "tourism_project");

    return corsJson({
      success: true,
      data: {
        is_premium: Boolean(user?.isPremium),
        premium_since: user?.premiumSince ?? null,
        case: kase
          ? {
              status: kase.status,
              assigned_to: kase.assignedTo,
              client_message: kase.clientMessage,
              next_step: kase.nextStep,
              updated_at: kase.updatedAt,
            }
          : null,
        purchases: purchases.map((p) => ({
          id: p.id,
          offer_label: p.offerLabel ?? (p.quote as any)?.package?.name ?? "Package",
          amount_cents: p.amountCents,
          currency: p.currency,
          installments: p.installments,
          installments_paid: p.installmentsPaid,
          method: p.method,
          status: p.status,
          paid_at: p.paidAt,
        })),
        services: { total: services.length, done: services.filter((s) => s.status === "done").length },
      },
    });
  } catch (error) {
    console.error("Dossier error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
