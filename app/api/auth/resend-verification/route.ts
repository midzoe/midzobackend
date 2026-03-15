import { NextRequest, NextResponse } from "next/server";
import { UserModel } from "@/src/models/User";
import { sendVerificationEmail } from "@/lib/email";

const STATUS_MAP: Record<string, number> = {
  "user not found": 404,
  "already verified": 400,
  "too many requests": 429,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "email is required" },
        { status: 400 }
      );
    }

    const check = await UserModel.canResendCode(email);

    if (!check.allowed) {
      const status = STATUS_MAP[check.error!] ?? 400;
      return NextResponse.json(
        { success: false, error: check.error },
        { status }
      );
    }

    const code = await UserModel.createVerificationCode(email);

    try {
      await sendVerificationEmail(email, code);
    } catch (emailError) {
      console.error("Failed to resend verification email:", emailError);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Resend verification error:", error);
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
