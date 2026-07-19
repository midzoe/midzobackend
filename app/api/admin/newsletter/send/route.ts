import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";
import { NewsletterSubscriberModel } from "@/src/models/NewsletterSubscriber";
import { sendNewsletterCampaign } from "@/lib/email";

const VALID_TYPES = ["study", "tourism"];

// Story 8.5 (FR33) : campagne newsletter segmentée par type. Gardé isAdmin.
// Destinataires = utilisateurs abonnés (flag User) + abonnés email seuls (NewsletterSubscriber),
// dédupliqués. Envoi best-effort, journalisé.
export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const b = await request.json();
    const type = b?.type;
    const subject = typeof b?.subject === "string" ? b.subject.trim() : "";
    const body = typeof b?.body === "string" ? b.body.trim() : "";

    if (!type || !VALID_TYPES.includes(type)) {
      return corsJson({ error: 'type must be "study" or "tourism"' }, { status: 400 });
    }
    if (!subject || !body) {
      return corsJson({ error: "subject and body are required" }, { status: 400 });
    }

    const users = await prisma.user.findMany({
      where: type === "study" ? { newsletterStudy: true } : { newsletterTourism: true },
      select: { email: true },
    });
    const subs = await NewsletterSubscriberModel.recipientsForType(type);

    const recipients = Array.from(
      new Set([...users.map((u) => u.email), ...subs].map((e) => e.toLowerCase()))
    );

    const html = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color:#1a1a2e;">${subject}</h2>
        <div style="color:#333; white-space: pre-wrap;">${body}</div>
        <p style="color:#999; font-size:12px; margin-top:24px;">Vous recevez cet email car vous êtes abonné à la newsletter Midzo (${type}).</p>
      </div>`;

    const result = await sendNewsletterCampaign(recipients, subject, html, body);

    console.log(`[NEWSLETTER] Campaign "${subject}" (${type}) by admin ${auth.userId}: sent=${result.sent} failed=${result.failed} total=${recipients.length}`);

    return corsJson({
      success: true,
      data: { type, recipients: recipients.length, sent: result.sent, failed: result.failed },
    });
  } catch (error) {
    console.error("Newsletter send error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("POST, OPTIONS");
}
