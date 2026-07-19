import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";
import { PremiumCaseModel } from "@/src/models/PremiumCase";

const VALID_STATUS = ["open", "in_progress", "closed"];

// Story 9.3 (FR38) : dossier premium d'un utilisateur (suivi séparé). Gardé isAdmin.
export async function GET(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const { userId } = await params;
    const uid = Number(userId);
    if (!Number.isInteger(uid)) return corsJson({ error: "invalid userId" }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { id: uid },
      select: { id: true, email: true, firstName: true, lastName: true, isPremium: true, premiumSince: true },
    });
    if (!user) return corsJson({ error: "User not found" }, { status: 404 });

    const kase = await PremiumCaseModel.getOrCreate(uid);
    const purchases = await prisma.purchase.findMany({
      where: { userId: uid },
      orderBy: { createdAt: "desc" },
      select: { id: true, amountCents: true, currency: true, status: true, paidAt: true, createdAt: true },
    });

    return corsJson({ success: true, data: { user, case: kase, purchases } });
  } catch (error) {
    console.error("Premium case get error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const { userId } = await params;
    const uid = Number(userId);
    if (!Number.isInteger(uid)) return corsJson({ error: "invalid userId" }, { status: 400 });

    const b = await request.json();
    if (b?.status && !VALID_STATUS.includes(b.status)) {
      return corsJson({ error: "status must be open|in_progress|closed" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: uid }, select: { id: true } });
    if (!user) return corsJson({ error: "User not found" }, { status: 404 });

    const updated = await PremiumCaseModel.update(uid, {
      status: b?.status,
      notes: typeof b?.notes === "string" ? b.notes : undefined,
      assignedTo: typeof b?.assignedTo === "string" ? b.assignedTo : undefined,
    });
    return corsJson({ success: true, data: updated });
  } catch (error) {
    console.error("Premium case update error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, PUT, OPTIONS");
}
