import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { EmbassyModel } from "@/src/models/Embassy";
import { embassyPayload, buildMapsUrl } from "@/lib/embassy-input";

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const items = await EmbassyModel.findAll();
    return corsJson({ success: true, data: items, total: items.length });
  } catch (error) {
    console.error("Admin list embassies error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const data = embassyPayload(body);

    if (!data.country || !data.name) {
      return corsJson({ error: "country and name are required" }, { status: 400 });
    }

    // Sans lien cartographique saisi, on en dérive une recherche à partir du nom
    // et de la ville : l'admin n'a pas à coller un lien Google Maps à la main.
    if (!data.mapsUrl) {
      data.mapsUrl = buildMapsUrl(data.name, data.city, data.hostCountry);
    }

    const embassy = await EmbassyModel.create({
      ...data,
      country: data.country,
      name: data.name,
    });

    return corsJson({ success: true, embassy }, { status: 201 });
  } catch (error) {
    console.error("Create embassy error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, POST, OPTIONS");
}
