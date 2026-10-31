import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";
import { AppSettingModel } from "@/src/models/AppSetting";
import { logAdminAction } from "@/lib/audit";
import { AVAILABILITY_KEY, DEFAULT_AVAILABILITY, loadAvailability, slotLabel, validateAvailability } from "@/lib/consultation";

/**
 * Admin (admin et superadmin) : horaires de consultation en heure d'Allemagne et rendez-vous
 * à venir. Modifier les horaires ne change aucun rendez-vous déjà pris : ils restent réservés
 * et bloquent leur créneau.
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const availability = await loadAvailability();
    const bookings = await prisma.consultationBooking.findMany({
      where: {
        slotStart: { gte: new Date(Date.now() - 24 * 3600_000) },
        OR: [{ status: "confirmed" }, { status: "held", holdUntil: { gt: new Date() } }],
      },
      orderBy: { slotStart: "asc" },
      include: { user: { select: { id: true, username: true, email: true, firstName: true, lastName: true } } },
    });
    return corsJson({
      success: true,
      availability,
      defaults: DEFAULT_AVAILABILITY,
      bookings: bookings.map((b) => ({
        id: b.id,
        slot_start: b.slotStart,
        duration_minutes: b.durationMinutes,
        status: b.status,
        label: slotLabel(b.slotStart.toISOString(), availability, b.clientTimezone),
        client_timezone: b.clientTimezone,
        purchase_id: b.purchaseId,
        user: b.user,
      })),
    });
  } catch (error) {
    console.error("Admin consultations error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

/** Corps : { availability: { timezone, slotMinutes, leadHours, horizonDays, weekly, closedDates } } */
export async function PUT(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const body = await request.json().catch(() => ({}));
    const availability = validateAvailability(body?.availability);
    if (typeof availability === "string") return corsJson({ error: availability }, { status: 400 });

    await AppSettingModel.set(AVAILABILITY_KEY, JSON.stringify(availability));
    await logAdminAction(auth.userId, "consultation.availability", { type: "setting", details: { key: AVAILABILITY_KEY, availability } });
    return corsJson({ success: true, availability });
  } catch (error) {
    console.error("Admin consultations update error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, PUT, OPTIONS");
}
