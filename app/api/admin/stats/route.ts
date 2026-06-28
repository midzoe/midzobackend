import { NextRequest } from "next/server";
import { getAuthWithRole, isAdmin } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthWithRole(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(auth.role)) return corsJson({ error: "Forbidden" }, { status: 403 });

    const [
      totalUsers,
      premiumUsers,
      totalNews,
      totalBlogs,
      totalStudyCountries,
      totalTourismCountries,
      totalVisas,
      totalAccommodations,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isPremium: true } }),
      prisma.news.count(),
      prisma.blog.count(),
      prisma.studyCountry.count(),
      prisma.tourismCountry.count(),
      prisma.visa.count(),
      prisma.accommodation.count(),
    ]);

    return corsJson({
      success: true,
      data: {
        total_users: totalUsers,
        premium_users: premiumUsers,
        total_news: totalNews,
        total_blogs: totalBlogs,
        total_study_countries: totalStudyCountries,
        total_tourism_countries: totalTourismCountries,
        total_visas: totalVisas,
        total_accommodations: totalAccommodations,
        // aliases for frontend compatibility
        total_countries: totalStudyCountries + totalTourismCountries,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
