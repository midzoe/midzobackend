import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { TripModel } from "@/src/models/Trip";

// Story 7.2/7.4 — mettre à jour un service (statut done/pending, label, data).
export async function PUT(request: NextRequest, { params }: { params: Promise<{ serviceId: string }> }) {
  try {
    const auth = authenticateRequest(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    const { serviceId } = await params;
    const sid = parseInt(serviceId);
    if (isNaN(sid)) return corsJson({ error: "Invalid id" }, { status: 400 });
    const b = await request.json();
    const service = await TripModel.updateService(sid, parseInt(auth.userId), {
      status: b.status, label: b.label, data: b.data,
    });
    if (!service) return corsJson({ error: "Service not found" }, { status: 404 });
    return corsJson({ success: true, data: service });
  } catch (error) {
    console.error("Update trip service error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("PUT, OPTIONS");
}
