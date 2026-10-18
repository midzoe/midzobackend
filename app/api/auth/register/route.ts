import { NextRequest, NextResponse } from "next/server";
import { UserModel } from "@/src/models/User";
import { sendVerificationEmail } from "@/lib/email";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password, first_name, last_name, phone } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "email is required" },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { success: false, error: "password is required" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: "invalid email format" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "password too short" },
        { status: 400 }
      );
    }

    const existingEmail = await UserModel.findByEmail(email);
    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: "email already exists" },
        { status: 400 }
      );
    }

    // Le site ne demande pas d'identifiant : il est tiré du début de l'email et suffixé pour
    // les adresses homonymes (jean@gmail.com, jean@yahoo.fr). Un identifiant choisi
    // explicitement reste, lui, unique.
    const derived = email.split("@")[0].replace(/[^a-z0-9_]/gi, "_");
    let finalUsername = username || derived;
    if (await UserModel.findByUsername(finalUsername)) {
      if (username && username !== derived) {
        return NextResponse.json(
          { success: false, error: "username already exists" },
          { status: 400 }
        );
      }
      finalUsername = await UserModel.availableUsername(email);
    }

    await UserModel.create({
      username: finalUsername,
      email,
      password,
      firstName: first_name,
      lastName: last_name,
      phone,
    });

    const code = await UserModel.createVerificationCode(email);

    try {
      await sendVerificationEmail(email, code);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
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
