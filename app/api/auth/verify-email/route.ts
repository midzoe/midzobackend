import { NextRequest, NextResponse } from "next/server";
import { UserModel } from "@/src/models/User";
import { generateToken } from "@/lib/auth";

const STATUS_MAP: Record<string, number> = {
  "user not found": 404,
  "already verified": 400,
  "invalid code": 400,
  "code expired": 400,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { success: false, error: "email and code are required" },
        { status: 400 }
      );
    }

    const result = await UserModel.verifyEmail(email, code);

    if (!result.success) {
      const status = STATUS_MAP[result.error!] ?? 400;
      return NextResponse.json(
        { success: false, error: result.error },
        { status }
      );
    }

    const token = generateToken(result.user!.id);

    return NextResponse.json(
      { success: true, token, user: result.user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify email error:", error);
    return NextResponse.json(
      { success: false, error: "internal server error" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
