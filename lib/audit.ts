import prisma from "@/lib/prisma";

/**
 * Journal des actions admin (qui a fait quoi sur quel compte). Best-effort : une trace qui
 * échoue ne doit jamais faire échouer l'action elle-même.
 */
export async function logAdminAction(
  adminUserId: string | number,
  action: string,
  target: { type: string; id?: number | null; userId?: number | null; details?: unknown }
) {
  try {
    const adminId = Number(adminUserId);
    const admin = await prisma.user.findUnique({ where: { id: adminId }, select: { username: true, firstName: true, lastName: true } });
    const adminName = admin ? [admin.firstName, admin.lastName].filter(Boolean).join(" ") || admin.username : null;
    await prisma.adminAuditLog.create({
      data: {
        adminId,
        adminName,
        action,
        targetType: target.type,
        targetId: target.id ?? null,
        userId: target.userId ?? null,
        details: (target.details ?? undefined) as any,
      },
    });
  } catch (error) {
    console.error("Audit log failed:", error);
  }
}

/** Notification dans l'espace client (best-effort). */
export async function notifyUser(userId: number, type: string, title: string, message: string, data?: unknown) {
  try {
    await prisma.notification.create({ data: { userId, type, title, message, data: (data ?? undefined) as any } });
  } catch (error) {
    console.error("Notification failed:", error);
  }
}
