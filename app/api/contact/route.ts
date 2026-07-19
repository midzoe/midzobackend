import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { authenticateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ContactMessageModel } from "@/src/models/ContactMessage";
import { sendContactNotificationEmail } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Story 8.1 (FR28) : enregistre un message de contact + notifie l'équipe par email.
// Public. Si un token valide accompagne la requête, on capture userId + isPremium (insights 8.3).
export async function POST(request: NextRequest) {
  try {
    const b = await request.json();
    const name = typeof b?.name === "string" ? b.name.trim() : "";
    const email = typeof b?.email === "string" ? b.email.trim() : "";
    const message = typeof b?.message === "string" ? b.message.trim() : "";

    if (!name || !email || !message) {
      return corsJson({ error: "name, email and message are required" }, { status: 400 });
    }
    if (!EMAIL_RE.test(email)) {
      return corsJson({ error: "invalid email" }, { status: 400 });
    }

    // Contexte utilisateur (optionnel) pour l'insight client vs premium.
    let userId: number | undefined;
    let isPremium = false;
    const decoded = authenticateRequest(request);
    if (decoded) {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(decoded.userId) },
        select: { id: true, isPremium: true },
      });
      if (user) {
        userId = user.id;
        isPremium = user.isPremium;
      }
    }

    const saved = await ContactMessageModel.create({
      name,
      email,
      subject: typeof b?.subject === "string" ? b.subject : undefined,
      category: typeof b?.category === "string" ? b.category : undefined,
      subcategory: typeof b?.subcategory === "string" ? b.subcategory : undefined,
      message,
      userId,
      isPremium,
    });

    // Email interne best-effort : ne fait jamais échouer l'enregistrement.
    try {
      await sendContactNotificationEmail({
        name,
        email,
        subject: saved.subject,
        category: saved.category,
        subcategory: saved.subcategory,
        message,
        isPremium,
      });
    } catch (e) {
      console.error("Contact notification email failed:", e);
    }

    return corsJson({ success: true, id: saved.id }, { status: 201 });
  } catch (error) {
    console.error("Contact submit error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("POST, OPTIONS");
}
