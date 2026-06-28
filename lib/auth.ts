import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

const JWT_SECRET: string = process.env.JWT_SECRET || "your_jwt_secret_key_here";
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || "24h";

export function generateToken(userId: number | string) {
  return jwt.sign({ userId: String(userId) }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as any);
}

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded;
  } catch {
    return null;
  }
}

export function getTokenFromHeader(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}

export function authenticateRequest(request: NextRequest) {
  const token = getTokenFromHeader(request);
  if (!token) return null;
  return verifyToken(token);
}

export async function getAuthWithRole(request: NextRequest) {
  const decoded = authenticateRequest(request);
  if (!decoded) return null;

  const user = await prisma.user.findUnique({
    where: { id: parseInt(decoded.userId) },
    select: { role: true },
  });

  if (!user) return null;
  return { userId: decoded.userId, role: user.role };
}

export function isAdmin(role: string) {
  return role === "admin" || role === "superadmin";
}

export function isSuperAdmin(role: string) {
  return role === "superadmin";
}
