import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";
import { informClient, parseId, requireAdmin } from "@/lib/admin-guard";
import { logAdminAction } from "@/lib/audit";

/**
 * Publier / refuser un avis, répondre publiquement. Le texte du client n'est jamais modifié :
 * seuls le statut, la réponse de Midzo et le motif de refus changent.
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const guard = await requireAdmin(request);
    if (guard.error) return guard.error;
    const id = parseId((await params).id);
    if (!id) return corsJson({ error: "Invalid id" }, { status: 400 });
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) return corsJson({ error: "Not found" }, { status: 404 });
    const b = await request.json().catch(() => ({}));
    if (b?.status && !["pending", "approved", "rejected"].includes(b.status)) {
      return corsJson({ error: "status must be pending|approved|rejected" }, { status: 400 });
    }
    const updated = await prisma.review.update({
      where: { id },
      data: {
        status: b?.status,
        publishedAt: b?.status === "approved" ? review.publishedAt ?? new Date() : b?.status ? null : undefined,
        adminReply: typeof b?.admin_reply === "string" ? b.admin_reply.trim() || null : undefined,
        rejectReason: typeof b?.reject_reason === "string" ? b.reject_reason.trim() || null : undefined,
      },
    });
    await logAdminAction(guard.auth.userId, "review.moderate", { type: "review", id, userId: review.userId, details: { status: b?.status } });
    if (review.userId && b?.status && b.status !== review.status && b.status !== "pending") {
      await informClient(review.userId, b.status === "approved" ? "Votre avis est publié" : "Votre avis n’a pas été publié",
        b.status === "approved" ? "Merci ! Votre avis est maintenant visible sur Midzo." : `Motif : ${updated.rejectReason ?? "non conforme aux conditions de publication"}. Vous pouvez en déposer un nouveau.`);
    }
    return corsJson({ success: true, data: updated });
  } catch (error) {
    console.error("Admin review update error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const guard = await requireAdmin(request);
    if (guard.error) return guard.error;
    const id = parseId((await params).id);
    if (!id) return corsJson({ error: "Invalid id" }, { status: 400 });
    const r = await prisma.review.delete({ where: { id } }).catch(() => null);
    if (!r) return corsJson({ error: "Not found" }, { status: 404 });
    await logAdminAction(guard.auth.userId, "review.delete", { type: "review", id, userId: r.userId });
    return corsJson({ success: true });
  } catch (error) {
    console.error("Admin review delete error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("PATCH, DELETE, OPTIONS");
}
