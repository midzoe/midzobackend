import { NextRequest } from "next/server";
import { corsJson, corsOptions } from "@/lib/cors";
import { authenticateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { VisaModel } from "@/src/models/Visa";
import { NotificationModel } from "@/src/models/Notification";

type EmbassyBlock = {
  id: number;
  country: string;
  name: string;
  location: string | null;
  link: string | null;
  email: string | null;
  phone: string | null;
} | null;

// Story 4.3 : message en langage naturel, localisé FR/EN. `lang` non-`fr` → `en`.
function buildVisaMessage(params: {
  lang: "fr" | "en";
  visaRequired: boolean | null;
  nationality: string;
  destination: string;
  processingTime: string | null;
  embassy: EmbassyBlock;
}): string {
  const { lang, visaRequired, nationality, destination, processingTime, embassy } = params;
  const fr = lang === "fr";

  if (visaRequired === null) {
    return fr
      ? `Aucune information de visa n'est disponible pour un voyage de ${nationality} vers ${destination}.`
      : `No visa information is available for travel from ${nationality} to ${destination}.`;
  }

  let msg = visaRequired
    ? fr
      ? `Un visa est requis pour voyager de ${nationality} vers ${destination}.`
      : `A visa is required to travel from ${nationality} to ${destination}.`
    : fr
      ? `Aucun visa n'est requis pour voyager de ${nationality} vers ${destination}.`
      : `No visa is required to travel from ${nationality} to ${destination}.`;

  if (visaRequired && processingTime) {
    msg += fr
      ? ` Délai de traitement estimé : ${processingTime}.`
      : ` Estimated processing time: ${processingTime}.`;
  }

  if (embassy) {
    const where = embassy.location ? ` (${embassy.location})` : "";
    msg += fr
      ? ` Adressez-vous à ${embassy.name}${where}.`
      : ` Contact ${embassy.name}${where}.`;
  }

  return msg;
}

/** Liste JSON stockée en base → tableau de chaînes (tolère l'absence et le format libre). */
function asList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(v => String(v)).filter(Boolean);
  if (typeof value === "string" && value.trim()) {
    return value.split(/\r?\n|,/).map(v => v.trim()).filter(Boolean);
  }
  return [];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const nationality = searchParams.get("nationality");
    const destination = searchParams.get("destination");
    const visaType = searchParams.get("type");
    const lang = searchParams.get("lang") === "fr" ? "fr" : "en";

    if (!nationality || !destination) {
      return corsJson(
        { error: "nationality and destination query params are required" },
        { status: 400 }
      );
    }

    // Gate 9.2 / FR37 : une fiche non validée ne guide pas un dossier réel.
    const visaInfo = await VisaModel.findByRoutePublic(nationality, destination, visaType);

    const visaRequired: boolean | null = visaInfo?.visaRequired ?? null;
    const processingTime = visaInfo?.processingTime ?? null;

    const embassy: EmbassyBlock = visaInfo?.embassy
      ? {
          id: visaInfo.embassy.id,
          country: visaInfo.embassy.country,
          name: visaInfo.embassy.name,
          location: visaInfo.embassy.location,
          link: visaInfo.embassy.link,
          email: visaInfo.embassy.email,
          phone: visaInfo.embassy.phone,
        }
      : null;

    const message = buildVisaMessage({
      lang,
      visaRequired,
      nationality,
      destination,
      processingTime,
      embassy,
    });

    // Story 4.4 : auth OPTIONNELLE — un premium connecté déclenche une alerte visa
    // (idempotente par destination). Sans token / non premium → comportement inchangé.
    let alertCreated = false;
    if (visaRequired === true) {
      const auth = authenticateRequest(request);
      if (auth) {
        const user = await prisma.user.findUnique({
          where: { id: parseInt(auth.userId) },
          select: { isPremium: true },
        });
        if (user?.isPremium) {
          const title = lang === "fr" ? "Alerte visa" : "Visa alert";
          const res = await NotificationModel.createVisaAlertIfAbsent(
            parseInt(auth.userId),
            destination,
            title,
            message
          );
          alertCreated = res.created;
        }
      }
    }

    // Story 4.7 : la fiche complète — ce que la personne doit savoir et fournir pour
    // obtenir le visa. Regroupée par thème pour que le site l'affiche telle quelle.
    const requirements = visaInfo
      ? {
          visaType: visaInfo.visaType,
          costs: {
            cost: visaInfo.cost,
            currency: visaInfo.currency,
            processingTime: visaInfo.processingTime,
            visaValidity: visaInfo.visaValidity,
            entriesType: visaInfo.entriesType,
            maxStay: visaInfo.maxStay,
          },
          documents: {
            list: asList(visaInfo.documentsRequired),
            passportValidity: visaInfo.passportValidity,
            photoSpec: visaInfo.photoSpec,
            applicationFormUrl: visaInfo.applicationFormUrl,
          },
          personal: {
            fundsAmount: visaInfo.fundsAmount,
            proofOfFunds: visaInfo.proofOfFunds,
            accommodationProof: visaInfo.accommodationProof,
            insuranceRequired: visaInfo.insuranceRequired,
            insuranceMinCoverage: visaInfo.insuranceMinCoverage,
            languageRequirement: visaInfo.languageRequirement,
            admissionLetterRequired: visaInfo.admissionLetterRequired,
            guarantorRequired: visaInfo.guarantorRequired,
            criminalRecordRequired: visaInfo.criminalRecordRequired,
            medicalExamRequired: visaInfo.medicalExamRequired,
            vaccinations: visaInfo.vaccinations,
            returnTicketRequired: visaInfo.returnTicketRequired,
          },
          procedure: {
            whereToApply: visaInfo.whereToApply,
            appointmentUrl: visaInfo.appointmentUrl,
            biometricsRequired: visaInfo.biometricsRequired,
            interviewRequired: visaInfo.interviewRequired,
            steps: asList(visaInfo.applicationSteps),
          },
          goodToKnow: {
            commonRefusalReasons: asList(visaInfo.commonRefusalReasons),
            notes: visaInfo.notes,
            officialSourceUrl: visaInfo.officialSourceUrl,
            lastVerifiedAt: visaInfo.lastVerifiedAt,
          },
        }
      : null;

    // Champs conservés pour rétro-compatibilité + nouveaux champs (visaRequired, message, embassy).
    const warnings: string[] = [];
    if (visaRequired) warnings.push("Visa required — apply before departure.");
    if (processingTime) warnings.push(`Estimated processing time: ${processingTime}`);
    if (!visaInfo) warnings.push("No visa data available for this route.");

    return corsJson({
      success: true,
      nationality,
      destination,
      lang,
      // Nouveaux champs (story 4.3)
      visaRequired,
      message,
      embassy,
      // Story 4.7 : fiche détaillée
      requirements,
      // Story 4.4 : indique si une alerte premium a été créée à cette évaluation
      alertCreated,
      // Rétro-compatibilité
      visa_required: visaRequired,
      travel_advisory: visaInfo?.notes ?? null,
      estimated_cost: visaInfo?.cost ?? null,
      documents_needed: asList(visaInfo?.documentsRequired),
      warnings,
    });
  } catch (error) {
    console.error("Travel check error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("GET, OPTIONS");
}
