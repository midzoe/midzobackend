import { NextRequest, NextResponse } from "next/server";
import { CategoryModel } from "@/src/models/Category";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if category exists
    const category = await CategoryModel.findById(id);
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const services = await CategoryModel.findServicesbyCategory(id);

    const response = NextResponse.json(
      {
        success: true,
        category,
        services,
      },
      { status: 200 }
    );

    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    console.error("Services fetch error:", error);
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
