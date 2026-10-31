import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { loadAvailability, slotsWithAvailability } from "@/lib/consultation";

/**
 * Créneaux de consultation à venir. Les horaires sont tenus en heure d'Allemagne (réglables
 * dans l'admin) ; les instants sont en UTC, le site les affiche à l'heure du visiteur. Un
 * créneau déjà réservé (payé, ou paiement en cours) est marqué indisponible.
 */
export async function GET(_request: NextRequest) {
  try {
    const av = await loadAvailability();
    return corsJson({
      success: true,
      timezone: av.timezone,
      slot_minutes: av.slotMinutes,
      weekly: av.weekly,
      slots: await slotsWithAvailability(av),
    });
  } catch (error) {
    console.error("Consultation slots error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
