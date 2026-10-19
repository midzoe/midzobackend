import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson } from "@/lib/cors";
import prisma from "@/lib/prisma";
import { sendPlainEmail } from "@/lib/email";
import { notifyUser } from "@/lib/audit";

/** 401 sans jeton, 403 sans rôle admin ; sinon l'identité de l'admin. */
export async function requireAdmin(request: NextRequest) {
  const auth = await getAuthWithRole(request);
  if (!auth) return { error: corsJson({ error: "Unauthorized" }, { status: 401 }) };
  if (!isAdmin(auth.role)) return { error: corsJson({ error: "Forbidden" }, { status: 403 }) };
  return { auth };
}

export const parseId = (value: string) => {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
};

export const TRIP_INCLUDE = {
  destinations: { orderBy: { order: "asc" as const } },
  services: { orderBy: { createdAt: "asc" as const } },
  checklistItems: { orderBy: { order: "asc" as const } },
};

const RECORDS = new Set(["study_project", "tourism_project"]);

/** Voyage vu par l'admin : avec l'état de préparation calculé comme pour le client. */
export function withReadiness(trip: any) {
  const services = (trip.services ?? []).filter((s: any) => s.status !== "cancelled" && !RECORDS.has(s.type));
  const items = trip.checklistItems ?? [];
  const total = services.length + items.length;
  const done = services.filter((s: any) => s.status === "done").length + items.filter((i: any) => i.isDone).length;
  return { ...trip, readiness: { total, done, ready: total > 0 && done === total } };
}

/**
 * Prévient le client d'un changement fait par son conseiller : notification dans l'espace
 * client + email (best-effort, jamais bloquant).
 */
export async function informClient(userId: number, title: string, message: string, data?: unknown) {
  await notifyUser(userId, "advisor_update", title, message, data);
  try {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, firstName: true } });
    if (user?.email) {
      const frontend = process.env.FRONTEND_URL || "http://localhost:5173";
      await sendPlainEmail(user.email, `Midzo — ${title}`, [user.firstName ? `Bonjour ${user.firstName},` : "Bonjour,", message], {
        label: "Voir mon espace",
        url: `${frontend}/dashboard`,
      });
    }
  } catch (e) {
    console.error("informClient email failed:", e);
  }
}
