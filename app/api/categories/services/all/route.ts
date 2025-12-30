import { NextRequest, NextResponse } from "next/server";
import { CategoryModel } from "@/src/models/Category";

export async function GET(request: NextRequest) {
  try {
    const services = await CategoryModel.findAllServices();

    // Group services by category for easier frontend consumption
    const servicesByCategory = services.reduce(
      (acc, service) => {
        if (!acc[service.categoryId]) {
          acc[service.categoryId] = [];
        }
        acc[service.categoryId].push(service);
        return acc;
      },
      {} as { [key: string]: any[] }
    );

    const response = NextResponse.json(
      {
        success: true,
        services,
        servicesByCategory,
      },
      { status: 200 }
    );

    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    console.error("All services fetch error:", error);
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
