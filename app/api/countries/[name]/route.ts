import { NextRequest, NextResponse } from "next/server";
import { CountryModel } from "@/src/models/Country";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const country = await CountryModel.findByName(decodeURIComponent(name));

    if (!country) {
      return NextResponse.json(
        { error: "Country not found" },
        { status: 404 }
      );
    }

    const response = NextResponse.json(
      {
        success: true,
        country,
      },
      { status: 200 }
    );

    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    console.error("Country details fetch error:", error);
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
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
