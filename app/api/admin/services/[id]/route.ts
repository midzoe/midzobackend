import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { CategoryModel } from "@/src/models/Category";
import { parseServicePayload, VALID_DELIVERY_MODES } from "@/lib/service-payload";

async function guard(request: NextRequest) {
  const auth = await getAuthWithRole(request);
  if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });
  return null;
}

/** PUT et PATCH partagent la même sémantique : mise à jour des champs fournis. */
async function updateService(request: NextRequest, id: string) {
  const denied = await guard(request);
  if (denied) return denied;

  const serviceId = parseInt(id);
  if (isNaN(serviceId)) return corsJson({ error: "Invalid id" }, { status: 400 });

  const body = await request.json();
  const data = parseServicePayload(body);

  if (data.deliveryMode !== undefined && !VALID_DELIVERY_MODES.includes(data.deliveryMode)) {
    return corsJson(
      { error: `deliveryMode must be one of: ${VALID_DELIVERY_MODES.join(", ")}` },
      { status: 400 }
    );
  }
  if (data.name !== undefined && !String(data.name).trim()) {
    return corsJson({ error: "name cannot be empty" }, { status: 400 });
  }
  if (data.categoryId !== undefined && !(await CategoryModel.findById(data.categoryId))) {
    return corsJson({ error: "Unknown categoryId" }, { status: 400 });
  }

  try {
    const service = await CategoryModel.updateService(serviceId, data);
    if (!service) return corsJson({ error: "Service not found" }, { status: 404 });
    return corsJson({ success: true, service, data: service });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return corsJson({ error: "Ce service existe déjà dans cette catégorie" }, { status: 409 });
    }
    throw error;
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    return await updateService(request, id);
  } catch (error) {
    console.error("Update service error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    return await updateService(request, id);
  } catch (error) {
    console.error("Update service error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const denied = await guard(request);
    if (denied) return denied;

    const { id } = await params;
    const serviceId = parseInt(id);
    if (isNaN(serviceId)) return corsJson({ error: "Invalid id" }, { status: 400 });

    const result = await CategoryModel.deleteService(serviceId);
    if (result === "not_found") return corsJson({ error: "Service not found" }, { status: 404 });
    if (result === "has_bookings") {
      return corsJson(
        { error: "Ce service a des réservations : décochez « Actif » plutôt que de le supprimer." },
        { status: 409 }
      );
    }
    return corsJson({ success: true });
  } catch (error) {
    console.error("Delete service error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("PUT, PATCH, DELETE, OPTIONS");
}
