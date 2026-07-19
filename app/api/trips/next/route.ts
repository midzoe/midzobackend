import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { TripModel } from "@/src/models/Trip";

// Story 7.7 — prochain départ (pour le tableau de bord voyage).
export async function GET(request: NextRequest) {
  try {
    const auth = authenticateRequest(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    const trip = await TripModel.findNextDeparture(parseInt(auth.userId));
    return corsJson({ success: true, data: trip });
  } catch (error) {
    console.error("Next departure error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
