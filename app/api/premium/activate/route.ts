import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { UserModel } from "@/src/models/User";

/**
 * Activation premium MANUELLE — réservée à l'admin (geste commercial, dépannage).
 *
 * 🚨 Le chemin normal vers le premium est le paiement Stripe (/api/premium/checkout +
 * webhook, story 3.4). Cette route était auparavant ouverte à tout utilisateur connecté :
 * n'importe qui pouvait se rendre premium gratuitement, ce qui contredit le PRD
 * (« le statut premium découle de l'achat »). D'où la garde de rôle — ne pas la retirer.
 *
 * L'admin active pour UN CLIENT : la cible vient du body, pas du token.
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const body = await request.json().catch(() => ({}));
    if (!Number.isInteger(body?.user_id)) {
      return corsJson({ error: "user_id is required (integer)" }, { status: 400 });
    }

    const target = await UserModel.findById(body.user_id);
    if (!target) return corsJson({ error: "User not found" }, { status: 404 });

    const user = await UserModel.activatePremium(body.user_id);

    return corsJson({ success: true, user });
  } catch (error) {
    console.error("Premium activate error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("POST, OPTIONS");
}
