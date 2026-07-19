import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { CategoryModel } from "@/src/models/Category";

const VALID_DELIVERY_MODES = ["online", "physical", "hybrid"];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const serviceId = parseInt(id);
    if (isNaN(serviceId)) return corsJson({ error: "Invalid id" }, { status: 400 });

    const body = await request.json();
    const { deliveryMode } = body;

    if (deliveryMode !== undefined && !VALID_DELIVERY_MODES.includes(deliveryMode)) {
      return corsJson(
        { error: `deliveryMode must be one of: ${VALID_DELIVERY_MODES.join(", ")}` },
        { status: 400 }
      );
    }

    const service = await CategoryModel.updateService(serviceId, { deliveryMode });
    if (!service) return corsJson({ error: "Service not found" }, { status: 404 });

    return corsJson({ success: true, service });
  } catch (error) {
    console.error("Update service error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("PATCH, OPTIONS");
}
