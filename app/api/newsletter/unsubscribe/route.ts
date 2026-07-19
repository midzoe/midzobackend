import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";
import { NewsletterSubscriberModel } from "@/src/models/NewsletterSubscriber";

const VALID_TYPES = ["study", "tourism"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Story 8.4 (FR32) : désabonnement par type. Utilisateur → flags User ; sinon NewsletterSubscriber.
// GET supporté pour les liens « se désabonner » dans les emails (?email=&type=).
async function handle(email: string, type: string) {
  if (!type || !VALID_TYPES.includes(type)) {
    return corsJson({ error: 'type must be "study" or "tourism"' }, { status: 400 });
  }
  if (!email || !EMAIL_RE.test(email)) {
    return corsJson({ error: "valid email is required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (user) {
    await prisma.user.update({
      where: { email },
      data: {
        newsletterStudy: type === "study" ? false : undefined,
        newsletterTourism: type === "tourism" ? false : undefined,
      },
    });
  } else {
    const existing = await NewsletterSubscriberModel.findByEmail(email);
    if (existing) await NewsletterSubscriberModel.setSubscription(email, type as any, false);
  }

  return corsJson({ success: true, message: `Unsubscribed from ${type} newsletter` });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    return await handle(email, body?.type);
  } catch (error) {
    console.error("Newsletter unsubscribe error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = (searchParams.get("email") || "").trim();
    return await handle(email, searchParams.get("type") || "");
  } catch (error) {
    console.error("Newsletter unsubscribe error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, POST, OPTIONS");
}
