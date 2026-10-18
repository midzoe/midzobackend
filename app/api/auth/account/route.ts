import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";
import { UserModel } from "@/src/models/User";

/**
 * Suppression de son propre compte (droit à l'effacement, RGPD). Mot de passe exigé.
 * Voyages, achats, notifications et dossier suivent en cascade. Un administrateur ne peut
 * pas supprimer son compte ainsi (il doit d'abord perdre son rôle) : on évite un panneau
 * sans administrateur par erreur.
 */
export async function DELETE(request: NextRequest) {
  try {
    const auth = authenticateRequest(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    const id = parseInt(auth.userId);

    const body = await request.json().catch(() => ({}));
    if (!body?.password) return corsJson({ error: "password is required" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { id }, select: { role: true } });
    if (!user) return corsJson({ error: "User not found" }, { status: 404 });
    if (user.role !== "user") return corsJson({ error: "admin accounts cannot be self-deleted" }, { status: 403 });
    if (!(await UserModel.checkPassword(id, body.password))) return corsJson({ error: "invalid password" }, { status: 400 });

    await prisma.user.delete({ where: { id } });
    return corsJson({ success: true });
  } catch (error) {
    console.error("Account deletion error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("DELETE, OPTIONS");
}
