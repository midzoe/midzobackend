import { NextRequest, NextResponse } from "next/server";
import { UserModel } from "@/src/models/User";
import { generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password, first_name, last_name, phone } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Username, email, and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await UserModel.findByUsername(username);
    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 409 }
      );
    }

    const existingEmail = await UserModel.findByEmail(email);
    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    const newUser = await UserModel.create({
      username,
      email,
      password,
      firstName: first_name,
      lastName: last_name,
      phone,
    });

    const token = generateToken(newUser.id);

    const response = NextResponse.json(
      {
        success: true,
        token,
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
        },
      },
      { status: 201 }
    );

    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
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
