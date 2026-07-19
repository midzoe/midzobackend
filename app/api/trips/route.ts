import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { TripModel } from "@/src/models/Trip";

// Story 7.1 — liste mes trips / crée un trip (multi-destination).
export async function GET(request: NextRequest) {
  try {
    const auth = authenticateRequest(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    const trips = await TripModel.findByUser(parseInt(auth.userId));
    return corsJson({ success: true, data: trips, total: trips.length });
  } catch (error) {
    console.error("List trips error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = authenticateRequest(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json();
    if (!body?.title) return corsJson({ error: "title is required" }, { status: 400 });
    if (body.destinations && !Array.isArray(body.destinations)) {
      return corsJson({ error: "destinations must be an array" }, { status: 400 });
    }
    const trip = await TripModel.create(parseInt(auth.userId), {
      title: body.title,
      status: body.status,
      startDate: body.startDate ?? body.start_date,
      endDate: body.endDate ?? body.end_date,
      destinations: body.destinations,
    });
    return corsJson({ success: true, data: trip }, { status: 201 });
  } catch (error) {
    console.error("Create trip error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, POST, OPTIONS");
}
