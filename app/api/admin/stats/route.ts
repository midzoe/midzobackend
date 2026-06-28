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
      totalCountries,
      totalNews,
      totalBlog,
      totalVisas,
      totalAccommodations,
      totalNotifications,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isPremium: true } }),
      prisma.country.count(),
      prisma.news.count(),
      prisma.blog.count(),
      prisma.visa.count(),
      prisma.accommodation.count(),
      prisma.notification.count(),
    ]);

    return corsJson({
      success: true,
      stats: {
        users: { total: totalUsers, premium: premiumUsers },
        countries: totalCountries,
        news: totalNews,
        blog: totalBlog,
        visas: totalVisas,
        accommodations: totalAccommodations,
        notifications: totalNotifications,
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
