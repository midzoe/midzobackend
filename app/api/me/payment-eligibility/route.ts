import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";
import { allowedInstallments, isFirstPurchase } from "@/lib/payment-rules";

/**
 * Ce que le client peut choisir au paiement : remise de premier achat encore disponible,
 * échéances autorisées selon son pays de résidence (Afrique : une fois). Le checkout
 * applique les mêmes règles ; cette route sert à l'afficher avant.
 */
export async function GET(request: NextRequest) {
  try {
    const auth = authenticateRequest(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    const userId = parseInt(auth.userId);
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { countryOfResidence: true } });
    return corsJson({
      success: true,
      first_purchase: await isFirstPurchase(userId),
      residence: user?.countryOfResidence ?? null,
      allowed_installments: allowedInstallments(user?.countryOfResidence),
    });
  } catch (error) {
    console.error("Payment eligibility error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
