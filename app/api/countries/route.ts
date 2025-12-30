import { NextRequest, NextResponse } from "next/server";
import { CountryModel } from "@/src/models/Country";

export async function GET(request: NextRequest) {
  try {
    const countries = await CountryModel.findAll();

    const response = NextResponse.json(
      {
        success: true,
        countries,
      },
      { status: 200 }
    );

    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    console.error("Countries fetch error:", error);
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
