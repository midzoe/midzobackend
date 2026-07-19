import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { validatePackageBody, toPackageData } from "@/lib/package-input";
import { PackageModel, InvalidCategoriesError } from "@/src/models/Package";

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const packages = await PackageModel.findAllAdmin();
    return corsJson({ success: true, data: packages, total: packages.length });
  } catch (error) {
    console.error("Admin list packages error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const error = validatePackageBody(body);
    if (error) return corsJson({ error }, { status: 400 });

    const created = await PackageModel.create(toPackageData(body));
    return corsJson({ success: true, package: created }, { status: 201 });
  } catch (error: any) {
    if (error instanceof InvalidCategoriesError) {
      return corsJson({ error: error.message }, { status: 400 });
    }
    if (error.code === "P2002") {
      return corsJson({ error: "package name already exists" }, { status: 400 });
    }
    console.error("Admin create package error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, POST, OPTIONS");
}
