import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { TripModel } from "@/src/models/Trip";
import { sendTripReminderEmail } from "@/lib/email";

// Story 7.5 — job planifié (cron) : envoie les emails de rappel/préparation avant le départ.
// Protégé par un secret cron : si CRON_SECRET est défini, le header `x-cron-secret` doit
// correspondre (sinon 401). En dev sans CRON_SECRET, l'appel est autorisé (emails → console).
export async function POST(request: NextRequest) {
  try {
    const secret = process.env.CRON_SECRET;
    if (secret && request.headers.get("x-cron-secret") !== secret) {
      return corsJson({ error: "Unauthorized" }, { status: 401 });
    }

    const trips = await TripModel.findNeedingReminder(7);
    let sent = 0;
    for (const trip of trips) {
      const pendingServices = trip.services.filter((s) => s.status !== "done");
      const pendingItems = trip.checklistItems.filter((i) => !i.isDone);
      const missing = [...pendingServices.map((s) => s.label), ...pendingItems.map((i) => i.label)];
      const total = trip.services.length + trip.checklistItems.length;
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

export async function OPTIONS() {
  return corsOptions("POST, OPTIONS");
}
