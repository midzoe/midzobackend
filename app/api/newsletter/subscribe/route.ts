import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";
import { NewsletterSubscriberModel } from "@/src/models/NewsletterSubscriber";

const VALID_TYPES = ["study", "tourism"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Story 8.4 (FR31) : abonnement newsletter par type (study|tourism).
// Utilisateur existant → flags sur User ; sinon → NewsletterSubscriber (email seul).
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type } = body;
    const email = typeof body?.email === "string" ? body.email.trim() : "";

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
          newsletterStudy: type === "study" ? true : undefined,
          newsletterTourism: type === "tourism" ? true : undefined,
        },
      });
    } else {
      await NewsletterSubscriberModel.setSubscription(email, type, true);
    }

    return corsJson({ success: true, message: `Subscribed to ${type} newsletter` });
  } catch (error) {
    console.error("Newsletter subscribe error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("POST, OPTIONS");
}
