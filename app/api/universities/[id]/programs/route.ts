import { NextRequest, NextResponse } from "next/server";
import { UniversityModel } from "@/src/models/University";

export async function POST(
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
    const { name, level } = body;

    if (!name || !level) {
      return NextResponse.json(
        {
          success: false,
          error: "Program name and level are required",
        },
        { status: 400 }
      );
    }

    // Check if university exists
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

    const program = await UniversityModel.addProgram(universityId, {
      name,
      level,
    });

    const response = NextResponse.json(
      {
        success: true,
        data: program,
      },
      { status: 201 }
    );

    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    console.error("Error adding program:", error);

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
        error: "Failed to add program",
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
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
