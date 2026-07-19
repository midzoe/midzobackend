import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { TripModel } from "@/src/models/Trip";

// Story 7.2/7.3 — rattacher un service (vol, logement, visa, assurance…) à un trip.
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = authenticateRequest(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const tripId = parseInt(id);
    if (isNaN(tripId)) return corsJson({ error: "Invalid id" }, { status: 400 });
    const b = await request.json();
    if (!b?.type || !b?.label) return corsJson({ error: "type and label are required" }, { status: 400 });
    const service = await TripModel.addService(tripId, parseInt(auth.userId), {
      destinationId: b.destinationId ?? b.destination_id,
      type: b.type, label: b.label, status: b.status, data: b.data,
    });
    if (!service) return corsJson({ error: "Trip not found" }, { status: 404 });
    return corsJson({ success: true, data: service }, { status: 201 });
  } catch (error) {
    console.error("Add trip service error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("POST, OPTIONS");
}
