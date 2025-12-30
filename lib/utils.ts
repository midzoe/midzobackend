import { NextResponse } from "next/server";

export function successResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status });
}

export function errorResponse(message: string, status: number = 500) {
  return NextResponse.json({ error: message }, { status });
}

export function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}
