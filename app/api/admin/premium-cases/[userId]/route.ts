import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";
import { PremiumCaseModel } from "@/src/models/PremiumCase";
import { logAdminAction } from "@/lib/audit";
import { informClient } from "@/lib/admin-guard";

const STATUS_LABELS: Record<string, string> = { open: "ouvert", in_progress: "en cours de traitement", closed: "clôturé" };

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
      select: {
        id: true, amountCents: true, currency: true, status: true, paidAt: true, createdAt: true,
        offerLabel: true, installments: true, installmentsPaid: true, method: true,
      },
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

    const before = await PremiumCaseModel.getOrCreate(uid);
    const updated = await PremiumCaseModel.update(uid, {
      status: b?.status,
      notes: typeof b?.notes === "string" ? b.notes : undefined,
      assignedTo: typeof b?.assignedTo === "string" ? b.assignedTo : undefined,
      clientMessage: typeof b?.clientMessage === "string" ? b.clientMessage : undefined,
      nextStep: typeof b?.nextStep === "string" ? b.nextStep : undefined,
    });
    await logAdminAction(auth.userId, "case.update", { type: "premium_case", id: updated.id, userId: uid, details: b });

    // Le client est prévenu de ce qui le concerne : statut, message, prochaine étape (jamais les notes internes).
    const changes: string[] = [];
    if (b?.status && b.status !== before.status) changes.push(`Votre dossier est ${STATUS_LABELS[b.status]}.`);
    if (typeof b?.clientMessage === "string" && b.clientMessage.trim() && b.clientMessage.trim() !== (before.clientMessage ?? "")) {
      changes.push(`Message de votre conseiller : ${b.clientMessage.trim()}`);
    }
    if (typeof b?.nextStep === "string" && b.nextStep.trim() && b.nextStep.trim() !== (before.nextStep ?? "")) {
      changes.push(`Prochaine étape : ${b.nextStep.trim()}`);
    }
    if (changes.length) await informClient(uid, "Votre dossier avance", changes.join(" "), { case_id: updated.id });
    return corsJson({ success: true, data: updated });
  } catch (error) {
    console.error("Premium case update error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, PUT, OPTIONS");
}
