import { NextRequest, NextResponse } from "next/server";
import { UniversityModel } from "@/src/models/University";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const universityId = parseInt(id);

    if (isNaN(universityId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid university ID",
        },
        { status: 400 }
      );
    }

    const university = await UniversityModel.findById(universityId);

    if (!university) {
      return NextResponse.json(
        {
          success: false,
          error: "University not found",
        },
        { status: 404 }
      );
    }

    const response = NextResponse.json(
      {
        success: true,
        data: university,
      },
      { status: 200 }
    );

    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    console.error("Error fetching university:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch university",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const universityId = parseInt(id);

    if (isNaN(universityId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid university ID",
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, city, country, website, applicationUrl, specialty } = body;

    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (city !== undefined) updates.city = city;
    if (country !== undefined) updates.country = country;
    if (website !== undefined) updates.website = website;
    if (applicationUrl !== undefined) updates.applicationUrl = applicationUrl;
    if (specialty !== undefined) updates.specialty = specialty;

    const university = await UniversityModel.update(universityId, updates);

    if (!university) {
      return NextResponse.json(
        {
          success: false,
          error: "University not found",
        },
        { status: 404 }
      );
    }

    const response = NextResponse.json(
      {
        success: true,
        data: university,
      },
      { status: 200 }
    );

    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    console.error("Error updating university:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update university",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const universityId = parseInt(id);

    if (isNaN(universityId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid university ID",
        },
        { status: 400 }
      );
    }

    const deleted = await UniversityModel.delete(universityId);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: "University not found",
        },
        { status: 404 }
      );
    }

    const response = NextResponse.json(
      {
        success: true,
        message: "University deleted successfully",
      },
      { status: 200 }
    );

    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    console.error("Error deleting university:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete university",
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
      "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
