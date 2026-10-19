import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

/** Modération des avis : ?status=pending|approved|rejected (tous par défaut). */
export async function GET(request: NextRequest) {
  try {
    const guard = await requireAdmin(request);
    if (guard.error) return guard.error;
    const status = new URL(request.url).searchParams.get("status");
    const rows = await prisma.review.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: "desc" },
      take: 200,
      include: { user: { select: { id: true, email: true } } },
    });
    const counts = await prisma.review.groupBy({ by: ["status"], _count: { _all: true } });
    return corsJson({ success: true, data: rows, counts: Object.fromEntries(counts.map((c) => [c.status, c._count._all])) });
  } catch (error) {
    console.error("Admin reviews error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
