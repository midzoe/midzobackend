import { NextRequest, NextResponse } from "next/server";
import { CategoryModel } from "@/src/models/Category";

export async function GET(request: NextRequest) {
  try {
    const categories = await CategoryModel.findAll();

    const response = NextResponse.json(
      {
        success: true,
        categories,
      },
      { status: 200 }
    );

    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    console.error("Categories fetch error:", error);
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
