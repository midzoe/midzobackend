import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { AccommodationModel } from "@/src/models/Accommodation";

const VALID_TYPES = ["studio", "shared", "residence", "homestay"];

// Story 9.1 : liste admin des hébergements (écran 9.6).
export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });
    const items = await AccommodationModel.findAll({});
    return corsJson({ success: true, data: items, total: items.length });
  } catch (error) {
    console.error("Admin list accommodations error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { name, country, city, type, currency, contact, description, images } = body;
    const price_per_month = body.price_per_month ?? body.pricePerMonth;

    if (!name || !country || !city || !type || price_per_month == null) {
      return corsJson(
        { error: "name, country, city, type, price_per_month are required" },
        { status: 400 }
      );
    }

    if (!VALID_TYPES.includes(type)) {
      return corsJson(
        { error: `type must be one of: ${VALID_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    const accommodation = await AccommodationModel.create({
      name,
      country,
      city,
      type,
      pricePerMonth: price_per_month,
      currency,
      contact,
      description,
      images,
    });

    return corsJson({ success: true, accommodation }, { status: 201 });
  } catch (error) {
    console.error("Create accommodation error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, POST, OPTIONS");
}
