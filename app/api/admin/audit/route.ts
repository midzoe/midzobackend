import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

/** Journal des actions admin, filtrable par client (?user_id=) ; 50 dernières par défaut. */
export async function GET(request: NextRequest) {
  try {
    const guard = await requireAdmin(request);
    if (guard.error) return guard.error;
    const sp = new URL(request.url).searchParams;
    const userId = parseInt(sp.get("user_id") ?? "");
    const limit = Math.min(200, Math.max(1, parseInt(sp.get("limit") ?? "50")));
    const logs = await prisma.adminAuditLog.findMany({
      where: Number.isInteger(userId) ? { userId } : {},
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return corsJson({ success: true, data: logs });
  } catch (error) {
    console.error("Admin audit error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
