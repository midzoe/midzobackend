import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";
import { logAdminAction } from "@/lib/audit";

/**
 * Suivi d'un paiement HORS LIGNE : échéance supplémentaire reçue, note, référence, annulation.
 * Les paiements carte (method = stripe) ne se modifient pas ici : Stripe fait foi.
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });
    const id = Number((await params).id);
    const purchase = Number.isInteger(id) ? await prisma.purchase.findUnique({ where: { id } }) : null;
    if (!purchase) return corsJson({ error: "Purchase not found" }, { status: 404 });
    if (purchase.method === "stripe") return corsJson({ error: "card payments are managed by Stripe" }, { status: 409 });

    const b = await request.json().catch(() => ({}));
    const paid = b?.installments_paid !== undefined ? Number(b.installments_paid) : undefined;
    if (paid !== undefined && (!Number.isInteger(paid) || paid < 0 || paid > purchase.installments)) {
      return corsJson({ error: `installments_paid must be between 0 and ${purchase.installments}` }, { status: 400 });
    }
    if (b?.status && !["paid", "past_due", "cancelled"].includes(b.status)) {
      return corsJson({ error: "status must be paid|past_due|cancelled" }, { status: 400 });
    }
    const updated = await prisma.purchase.update({
      where: { id },
      data: {
        installmentsPaid: paid,
        status: b?.status,
        reference: typeof b?.reference === "string" ? b.reference.trim() || null : undefined,
        note: typeof b?.note === "string" ? b.note.trim() || null : undefined,
      },
    });
    await logAdminAction(auth.userId, "purchase.update", { type: "purchase", id, userId: purchase.userId, details: b });
    return corsJson({ success: true, data: { id: updated.id, installments_paid: updated.installmentsPaid, status: updated.status } });
  } catch (error) {
    console.error("Admin update purchase error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("PATCH, OPTIONS");
}
