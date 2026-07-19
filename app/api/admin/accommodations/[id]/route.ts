import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { AccommodationModel } from "@/src/models/Accommodation";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const accomId = parseInt(id);
    if (isNaN(accomId)) return corsJson({ error: "Invalid id" }, { status: 400 });

    const body = await request.json();
    const { name, country, city, type, currency, contact, description, images } = body;
    const price_per_month = body.price_per_month ?? body.pricePerMonth;

    const accommodation = await AccommodationModel.update(accomId, {
      name,
      country,
      city,
      type,
      pricePerMonth: price_per_month != null ? Number(price_per_month) : undefined,
      currency,
      contact,
      description,
      images,
    });

    if (!accommodation) return corsJson({ error: "Accommodation not found" }, { status: 404 });

    return corsJson({ success: true, accommodation });
  } catch (error) {
    console.error("Update accommodation error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const accomId = parseInt(id);
    if (isNaN(accomId)) return corsJson({ error: "Invalid id" }, { status: 400 });

    const deleted = await AccommodationModel.delete(accomId);
    if (!deleted) return corsJson({ error: "Accommodation not found" }, { status: 404 });

    return corsJson({ success: true });
  } catch (error) {
    console.error("Delete accommodation error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("PUT, DELETE, OPTIONS");
}
