import { NextRequest, NextResponse } from "next/server";
import { UniversityModel, UniversityFilters } from "@/src/models/University";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const country = searchParams.get("country") || undefined;
    const region = searchParams.get("region") || undefined;
    const city = searchParams.get("city") || undefined;
    const program = searchParams.get("program") || undefined;
    const level = searchParams.get("level") || undefined;
    const search = searchParams.get("search") || undefined;
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const filters: UniversityFilters = {
      country,
      region,
      city,
      programName: program,
      programLevel: level,
      search,
    };

    // Remove undefined filters
    Object.keys(filters).forEach((key) => {
      if (filters[key as keyof UniversityFilters] === undefined) {
        delete filters[key as keyof UniversityFilters];
      }
    });

    const universities = await UniversityModel.findAll(filters);

    // Apply pagination
    const paginatedResults = universities.slice(offset, offset + limit);

    const response = NextResponse.json(
      {
        success: true,
        data: paginatedResults,
        pagination: {
          total: universities.length,
          limit,
          offset,
          hasMore: offset + limit < universities.length,
        },
      },
      { status: 200 }
    );

    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    console.error("Error searching universities:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search universities",
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
