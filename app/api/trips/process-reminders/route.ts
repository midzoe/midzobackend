import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { TripModel, activeServices } from "@/src/models/Trip";
import { sendTripReminderEmail } from "@/lib/email";

// Story 7.5 — job planifié (cron) : envoie les emails de rappel/préparation avant le départ.
// Protégé par CRON_SECRET, transmis soit par Vercel Cron (GET, `Authorization: Bearer <secret>`),
// soit à la main (POST, header `x-cron-secret`). En production sans CRON_SECRET, le job est
// refusé : sinon n'importe qui pourrait déclencher l'envoi des emails à tous les clients.
// En dev sans CRON_SECRET, l'appel reste autorisé (emails → console).

function authorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production";
  return (
    request.headers.get("x-cron-secret") === secret ||
    request.headers.get("authorization") === `Bearer ${secret}`
  );
}

async function run(request: NextRequest) {
  try {
    if (!authorized(request)) return corsJson({ error: "Unauthorized" }, { status: 401 });

    const trips = await TripModel.findNeedingReminder(7);
    let sent = 0;
    for (const trip of trips) {
      const services = activeServices(trip.services);
      const pendingServices = services.filter((s) => s.status !== "done");
      const pendingItems = trip.checklistItems.filter((i) => !i.isDone);
      const missing = [...pendingServices.map((s) => s.label), ...pendingItems.map((i) => i.label)];
      const total = services.length + trip.checklistItems.length;
      const ready = missing.length === 0 && total > 0;

      if (trip.user?.email) {
        await sendTripReminderEmail(trip.user.email, trip.user.firstName ?? null, {
          tripTitle: trip.title,
          startDate: trip.startDate,
          ready,
          missing,
        });
      }
      await TripModel.markReminderSent(trip.id);
      sent++;
    }

    return corsJson({ success: true, processed: trips.length, sent });
  } catch (error) {
    console.error("Process trip reminders error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export const GET = run;
export const POST = run;

export async function OPTIONS() {
  return corsOptions("GET, POST, OPTIONS");
}
