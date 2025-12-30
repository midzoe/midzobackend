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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, city, country, website, applicationUrl, specialty } = body;

    if (!name || !city || !country) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, city, and country are required",
        },
        { status: 400 }
      );
    }

    const university = await UniversityModel.create({
      name,
      city,
      country,
      website,
      applicationUrl,
      specialty,
    });

    const response = NextResponse.json(
      {
        success: true,
        data: university,
      },
      { status: 201 }
    );

    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    console.error("Error creating university:", error);

    if (error instanceof Error && error.message.includes("already exists")) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create university",
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
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
