import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";
import { sendPlainEmail } from "@/lib/email";
import { logAdminAction, notifyUser } from "@/lib/audit";
import { parseId, requireAdmin } from "@/lib/admin-guard";

/**
 * Réponse du conseiller à une demande : email au client, historique conservé dans le message,
 * notification dans l'espace client s'il a un compte. La demande passe en « lu ».
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const guard = await requireAdmin(request);
    if (guard.error) return guard.error;
    const id = parseId((await params).id);
    if (!id) return corsJson({ error: "Invalid id" }, { status: 400 });
    const message = await prisma.contactMessage.findUnique({ where: { id } });
    if (!message) return corsJson({ error: "Message not found" }, { status: 404 });

    const b = await request.json().catch(() => ({}));
    const text = typeof b?.body === "string" ? b.body.trim() : "";
    if (text.length < 2) return corsJson({ error: "body is required" }, { status: 400 });

    const admin = await prisma.user.findUnique({ where: { id: Number(guard.auth.userId) }, select: { username: true, firstName: true, lastName: true } });
    const adminName = admin ? [admin.firstName, admin.lastName].filter(Boolean).join(" ") || admin.username : "Conseiller MIDZO";

    await sendPlainEmail(message.email, `Re: ${message.subject ?? "Votre demande MIDZO"}`, [
      `Bonjour ${message.name},`,
      text,
      `${adminName} — MIDZO`,
      `— Votre message du ${message.createdAt.toLocaleDateString("fr-FR")} —\n${message.message}`,
    ]);

    const replies = Array.isArray(message.replies) ? (message.replies as any[]) : [];
    const entry = { body: text, admin: adminName, sent_at: new Date().toISOString() };
    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { replies: [...replies, entry] as any, repliedAt: new Date(), status: message.status === "new" ? "read" : message.status },
    });

    const account = message.userId
      ? { id: message.userId }
      : await prisma.user.findFirst({ where: { email: { equals: message.email, mode: "insensitive" } }, select: { id: true } });
    if (account) await notifyUser(account.id, "advisor_reply", "Réponse de votre conseiller", text, { contact_message_id: id });

    await logAdminAction(guard.auth.userId, "contact.reply", { type: "contact_message", id, userId: account?.id ?? null, details: { subject: message.subject } });
    return corsJson({ success: true, data: updated });
  } catch (error) {
    console.error("Admin contact reply error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("POST, OPTIONS");
}
