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
      // Story 9.4 : contacts, newsletter, file de validation.
      totalContacts,
      newContacts,
      newsletterStudy,
      newsletterTourism,
      draftStudyCountries,
      draftTourismCountries,
      draftTourismPrograms,
      draftCountries,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isPremium: true } }),
      prisma.news.count(),
      prisma.blog.count(),
      prisma.studyCountry.count(),
      prisma.tourismCountry.count(),
      prisma.visa.count(),
      prisma.accommodation.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { status: "new" } }),
      prisma.user.count({ where: { newsletterStudy: true } }),
      prisma.user.count({ where: { newsletterTourism: true } }),
      prisma.studyCountry.count({ where: { isValidated: false } }),
      prisma.tourismCountry.count({ where: { isValidated: false } }),
      prisma.tourismProgram.count({ where: { isValidated: false } }),
      prisma.country.count({ where: { isValidated: false } }),
    ]);

    const pendingValidation =
      draftStudyCountries + draftTourismCountries + draftTourismPrograms + draftCountries;

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
        // Story 9.4 — insights supplémentaires
        total_contacts: totalContacts,
        new_contacts: newContacts,
        newsletter_study: newsletterStudy,
        newsletter_tourism: newsletterTourism,
        pending_validation: pendingValidation,
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
