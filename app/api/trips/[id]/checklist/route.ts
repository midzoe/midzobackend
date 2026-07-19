import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { TripModel } from "@/src/models/Trip";

// Story 7.4 — checklist d'un trip : items + état « prêt / pas prêt » dérivé.
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = authenticateRequest(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const tripId = parseInt(id);
    if (isNaN(tripId)) return corsJson({ error: "Invalid id" }, { status: 400 });
    const userId = parseInt(auth.userId);
    const trip = await TripModel.findByIdForUser(tripId, userId);
    if (!trip) return corsJson({ error: "Trip not found" }, { status: 404 });
    const readiness = await TripModel.readiness(tripId, userId);
    return corsJson({ success: true, items: trip.checklistItems, services: trip.services, readiness });
  } catch (error) {
    console.error("Get trip checklist error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = authenticateRequest(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const tripId = parseInt(id);
    if (isNaN(tripId)) return corsJson({ error: "Invalid id" }, { status: 400 });
    const b = await request.json();
    if (!b?.label) return corsJson({ error: "label is required" }, { status: 400 });
    const item = await TripModel.addChecklistItem(tripId, parseInt(auth.userId), {
      label: b.label, category: b.category, order: b.order,
    });
    if (!item) return corsJson({ error: "Trip not found" }, { status: 404 });
    return corsJson({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error("Add checklist item error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, POST, OPTIONS");
}
