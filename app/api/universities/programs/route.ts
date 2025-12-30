import { NextRequest, NextResponse } from "next/server";
import { UniversityModel } from "@/src/models/University";

export async function GET(request: NextRequest) {
  try {
    const programs = await UniversityModel.getPrograms();

    // Group programs by name for better frontend handling
    const groupedPrograms = programs.reduce(
      (acc, program) => {
        if (!acc[program.name]) {
          acc[program.name] = [];
        }
        if (!acc[program.name].includes(program.level)) {
          acc[program.name].push(program.level);
        }
        return acc;
      },
      {} as Record<string, string[]>
    );

    const response = NextResponse.json(
      {
        success: true,
        data: {
          raw: programs,
          grouped: groupedPrograms,
          programNames: Object.keys(groupedPrograms).sort(),
          levels: [...new Set(programs.map((p) => p.level))].sort(),
        },
      },
      { status: 200 }
    );

    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    console.error("Error fetching programs:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch programs",
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
