import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { UserModel } from "@/src/models/User";

/**
 * Garde d'aptitude au 1er trip premium (story 3.6, FR9).
 *
 * Réutilisable : l'épic « trips » (création/gestion de voyages) appellera ce guard depuis
 * chacune de ses routes, plutôt que de recopier la règle. Le premier consommateur est
 * `POST /api/premium/trips/start`.
 *
 * La règle de complétude reste `UserModel.getPremiumTripReadiness` (→ `getProfileCompleteness`),
 * source unique : cette garde ne redéfinit pas « profil complet ».
 */

export type TripReadiness =
  | { ok: true; userId: number }
  | { ok: false; status: 401 | 403 | 404 | 422; error: string; missing?: string[] };

export async function requirePremiumTripReadiness(request: NextRequest): Promise<TripReadiness> {
  const auth = authenticateRequest(request);
  if (!auth) return { ok: false, status: 401, error: "Unauthorized" };

  const userId = parseInt(auth.userId);
  const readiness = await UserModel.getPremiumTripReadiness(userId);
  if (!readiness) return { ok: false, status: 404, error: "User not found" };

  // Premium AVANT complétude : un trip n'est pas vendable à un non-premium ; inutile
  // de réclamer des champs à quelqu'un qui n'a pas accès à la fonctionnalité.
  if (!readiness.isPremium) return { ok: false, status: 403, error: "Premium required" };

  if (!readiness.complete) {
    return { ok: false, status: 422, error: "Profile incomplete", missing: readiness.missing };
  }

  return { ok: true, userId };
}
