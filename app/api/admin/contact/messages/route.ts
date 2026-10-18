import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { corsJson, corsOptions } from "@/lib/cors";
import { ContactMessageModel } from "@/src/models/ContactMessage";

// Story 8.3 : liste admin des messages de contact (filtrable status/catégorie).
export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;
    const category = searchParams.get("category") || undefined;
    const items: any[] = await ContactMessageModel.findAll({ status, category });

    // Rattachement au compte client : par l'auteur connecté, sinon par l'email (insensible à la casse).
    const emails = [...new Set(items.map((m) => String(m.email ?? "").toLowerCase()).filter(Boolean))];
    const accounts = emails.length
      ? await prisma.user.findMany({
          where: { OR: emails.map((e) => ({ email: { equals: e, mode: "insensitive" as const } })) },
          select: { id: true, email: true },
        })
      : [];
    const byEmail = new Map(accounts.map((u) => [u.email.toLowerCase(), u.id]));
    const data = items.map((m) => ({
      ...m,
      account_user_id: m.userId ?? m.user_id ?? byEmail.get(String(m.email ?? "").toLowerCase()) ?? null,
    }));
    return corsJson({ success: true, data, total: data.length });
  } catch (error) {
    console.error("Admin list contact messages error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
