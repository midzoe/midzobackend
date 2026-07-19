import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { TripModel } from "@/src/models/Trip";

// Story 7.1 — détail / mise à jour / suppression d'un trip (scopé à l'utilisateur).
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = authenticateRequest(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const tripId = parseInt(id);
    if (isNaN(tripId)) return corsJson({ error: "Invalid id" }, { status: 400 });
    const trip = await TripModel.findByIdForUser(tripId, parseInt(auth.userId));
    if (!trip) return corsJson({ error: "Trip not found" }, { status: 404 });
    return corsJson({ success: true, data: trip });
  } catch (error) {
    console.error("Get trip error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = authenticateRequest(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const tripId = parseInt(id);
    if (isNaN(tripId)) return corsJson({ error: "Invalid id" }, { status: 400 });
    const body = await request.json();
    const trip = await TripModel.update(tripId, parseInt(auth.userId), {
      title: body.title, status: body.status,
      startDate: body.startDate ?? body.start_date, endDate: body.endDate ?? body.end_date,
    });
    if (!trip) return corsJson({ error: "Trip not found" }, { status: 404 });
    return corsJson({ success: true, data: trip });
  } catch (error) {
    console.error("Update trip error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = authenticateRequest(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const tripId = parseInt(id);
    if (isNaN(tripId)) return corsJson({ error: "Invalid id" }, { status: 400 });
    const deleted = await TripModel.delete(tripId, parseInt(auth.userId));
    if (!deleted) return corsJson({ error: "Trip not found" }, { status: 404 });
    return corsJson({ success: true });
  } catch (error) {
    console.error("Delete trip error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, PUT, DELETE, OPTIONS");
}
