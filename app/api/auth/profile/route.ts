import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { UserModel } from "@/src/models/User";

export async function GET(request: NextRequest) {
  try {
    const auth = authenticateRequest(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });

    const user = await UserModel.findById(parseInt(auth.userId));
    if (!user) return corsJson({ error: "User not found" }, { status: 404 });

    return corsJson({ success: true, user });
  } catch (error) {
    console.error("Profile error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = authenticateRequest(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const {
      first_name,
      last_name,
      email,
      phone,
      nationality,
      country_of_residence,
      languages,
      newsletter_study,
      newsletter_tourism,
    } = body;

    // L'email ne se change pas ici : sans mot de passe ni nouvelle vérification, un jeton volé
    // suffirait à détourner le compte. Le changement passe par /auth/change-email.
    if (typeof email === "string" && email.trim()) {
      const current = await UserModel.findById(parseInt(auth.userId));
      if (current && current.email.toLowerCase() !== email.trim().toLowerCase()) {
        return corsJson({ error: "email change requires /auth/change-email" }, { status: 400 });
      }
    }

    const updatedUser = await UserModel.update(parseInt(auth.userId), {
      firstName: first_name,
      lastName: last_name,
      phone,
      nationality,
      countryOfResidence: country_of_residence,
      languages,
      newsletterStudy: newsletter_study,
      newsletterTourism: newsletter_tourism,
    });

    if (!updatedUser) return corsJson({ error: "User not found" }, { status: 404 });

    return corsJson({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, PUT, OPTIONS");
}
