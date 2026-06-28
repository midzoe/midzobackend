import { NextRequest, NextResponse } from "next/server";
import { UserModel } from "@/src/models/User";
import { generateToken } from "@/lib/auth";
import { corsOptions } from "@/lib/cors";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username) {
      return NextResponse.json({ success: false, error: "username is required" }, { status: 400 });
    }
    if (!password) {
      return NextResponse.json({ success: false, error: "password is required" }, { status: 400 });
    }

    const user = await UserModel.validatePassword(username, password);

    if (!user) {
      return NextResponse.json({ success: false, error: "invalid credentials" }, { status: 401 });
    }

    if (!user.emailVerified) {
      return NextResponse.json({ success: false, error: "email not verified" }, { status: 403 });
    }

    const token = generateToken(user.id);

    const response = NextResponse.json(
      {
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone,
          role: user.role,
          is_premium: user.is_premium,
          nationality: user.nationality,
          country_of_residence: user.country_of_residence,
        },
      },
      { status: 200 }
    );
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false, error: "internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("POST, OPTIONS");
}
