import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET: string = process.env.JWT_SECRET || "your_jwt_secret_key_here";
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || "24h";

export function generateToken(userId: number | string) {
  return jwt.sign({ userId: String(userId) }, JWT_SECRET, { 
    expiresIn: JWT_EXPIRES_IN 
  } as any);
}

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded;
  } catch (error) {
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
  if (!token) {
    return null;
  }
  return verifyToken(token);
}
