import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { validatePackageBody, toPackageData } from "@/lib/package-input";
import { PackageModel, InvalidCategoriesError } from "@/src/models/Package";

async function requireAdmin(request: NextRequest) {
  const auth = await getAuthWithRole(request);
  if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });
  return null;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const denied = await requireAdmin(request);
    if (denied) return denied;

    const { id } = await params;
    const pkg = await PackageModel.findById(parseInt(id));
    if (!pkg) return corsJson({ error: "Package not found" }, { status: 404 });

    return corsJson({ success: true, package: pkg });
  } catch (error) {
    console.error("Admin get package error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const denied = await requireAdmin(request);
    if (denied) return denied;

    const { id } = await params;
    const body = await request.json();
    const error = validatePackageBody(body, { partial: true });
    if (error) return corsJson({ error }, { status: 400 });

    const updated = await PackageModel.update(parseInt(id), toPackageData(body));
    if (!updated) return corsJson({ error: "Package not found" }, { status: 404 });

    return corsJson({ success: true, package: updated });
  } catch (error: any) {
    if (error instanceof InvalidCategoriesError) {
      return corsJson({ error: error.message }, { status: 400 });
    }
    if (error.code === "P2002") {
      return corsJson({ error: "package name already exists" }, { status: 400 });
    }
    console.error("Admin update package error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const denied = await requireAdmin(request);
    if (denied) return denied;

    const { id } = await params;
    const deleted = await PackageModel.delete(parseInt(id));
    if (!deleted) return corsJson({ error: "Package not found" }, { status: 404 });

    return corsJson({ success: true });
  } catch (error) {
    console.error("Admin delete package error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, PUT, DELETE, OPTIONS");
}
