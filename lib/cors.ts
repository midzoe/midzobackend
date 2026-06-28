import { NextResponse } from "next/server";

export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export function corsJson(data: unknown, init?: ResponseInit) {
  const response = NextResponse.json(data, init);
  Object.entries(CORS_HEADERS).forEach(([k, v]) => response.headers.set(k, v));
  return response;
}

export function corsOptions(methods = "GET, POST, PUT, PATCH, DELETE, OPTIONS") {
  return new NextResponse(null, {
    status: 200,
    headers: { ...CORS_HEADERS, "Access-Control-Allow-Methods": methods },
  });
}
