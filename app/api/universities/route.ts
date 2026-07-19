import { NextRequest, NextResponse } from "next/server";
import { UniversityModel, UniversityFilters } from "@/src/models/University";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: UniversityFilters = {
      country: searchParams.get("country") || undefined,
      region: searchParams.get("region") || undefined,
      city: searchParams.get("city") || undefined,
      programName: searchParams.get("program") || undefined,
      programLevel: searchParams.get("level") || undefined,
      search: searchParams.get("search") || undefined,
    };

    // Remove undefined filters
    Object.keys(filters).forEach((key) => {
      if (filters[key as keyof UniversityFilters] === undefined) {
        delete filters[key as keyof UniversityFilters];
      }
    });

    const universities = await UniversityModel.findAll(filters);

    const response = NextResponse.json(
      {
        success: true,
        data: universities,
        count: universities.length,
      },
      { status: 200 }
    );

    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    console.error("Error fetching universities:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch universities",
      },
      { status: 500 }
    );
  }
}

// Story 5.1 : la création d'université passe désormais par la route admin gardée
// `POST /api/admin/universities`. L'ancien POST public non authentifié a été retiré.

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
