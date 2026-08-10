/**
 * Contrôles partagés par POST /admin/visa et PUT /admin/visa/[id].
 *
 * Story 4.2 : la destination devait être un pays validé de la table `countries`.
 * Story 4.7 : les destinations d'une fiche visa sont les pays de la partie « études »
 * — or certains (Belgique, Luxembourg) existent dans `study_countries` sans être
 * validés dans `countries`, ce qui refusait leur création. On accepte donc l'un OU
 * l'autre référentiel, et l'ambassade reste contrôlée « compétente » (même pays).
 *
 * Vit hors des route files : Next n'autorise que les handlers HTTP en export d'une route.
 */
import prisma from "./prisma";
import { CountryModel } from "@/src/models/Country";
import { EmbassyModel } from "@/src/models/Embassy";

/** Renvoie un message d'erreur (→ 400) ou `null` si la fiche est recevable. */
export async function validateVisaRule(
  destinationCountry: string,
  embassyId?: number | null
): Promise<string | null> {
  const isKnownDestination =
    (await CountryModel.isValidatedByName(destinationCountry)) ||
    (await prisma.studyCountry.count({
      where: { name: destinationCountry, isValidated: true },
    })) > 0;

  if (!isKnownDestination) {
    return "destination_country doit être un pays validé (liste des pays ou pays d'étude)";
  }

  if (embassyId != null) {
    const embassy = await EmbassyModel.findById(embassyId);
    if (!embassy) return "embassy_id introuvable";
    if (embassy.country !== destinationCountry) {
      return "ambassade non compétente pour cette destination";
    }
  }

  return null;
}
