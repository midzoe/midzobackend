import { NextRequest, NextResponse } from "next/server";
import { UniversityModel } from "@/src/models/University";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ country: string }> }
) {
  try {
    const { country } = await params;
    const cities = await UniversityModel.getCitiesByCountry(country);

    const response = NextResponse.json(
      {
        success: true,
        data: cities,
      },
      { status: 200 }
    );

    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    console.error("Error fetching cities:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch cities",
      },
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
