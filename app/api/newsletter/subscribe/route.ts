import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";

const VALID_TYPES = ["study", "tourism"];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, email } = body;

    if (!type || !VALID_TYPES.includes(type)) {
      return corsJson({ error: 'type must be "study" or "tourism"' }, { status: 400 });
    }
    if (!email) return corsJson({ error: "email is required" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (!user) return corsJson({ error: "No account found for this email" }, { status: 404 });

    await prisma.user.update({
      where: { email },
      data: {
        newsletterStudy: type === "study" ? true : undefined,
        newsletterTourism: type === "tourism" ? true : undefined,
      },
    });

    return corsJson({ success: true, message: `Subscribed to ${type} newsletter` });
  } catch (error) {
    console.error("Newsletter subscribe error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("POST, OPTIONS");
}
