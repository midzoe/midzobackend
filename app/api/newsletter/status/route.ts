import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";
import { NewsletterSubscriberModel } from "@/src/models/NewsletterSubscriber";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Story 8.7 : état d'abonnement (study/tourism) pour pré-remplir l'UI newsletter.
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = (searchParams.get("email") || "").trim();
    if (!email || !EMAIL_RE.test(email)) {
      return corsJson({ error: "valid email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { newsletterStudy: true, newsletterTourism: true },
    });
    if (user) {
      return corsJson({ success: true, study: user.newsletterStudy, tourism: user.newsletterTourism });
    }

    const sub = await NewsletterSubscriberModel.findByEmail(email);
    return corsJson({ success: true, study: sub?.study ?? false, tourism: sub?.tourism ?? false });
  } catch (error) {
    console.error("Newsletter status error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
