import { adminCollectionRoute } from "@/lib/admin-crud";
import { parseTouristSite } from "@/lib/directory-parsers";
import { TouristSiteModel } from "@/src/models/TouristSite";

const handlers = adminCollectionRoute({
  model: TouristSiteModel,
  entity: "Tourist site",
  required: ["name", "country", "location", "category"],
  parse: parseTouristSite,
});

export const GET = handlers.GET;
export const POST = handlers.POST;
export const OPTIONS = handlers.OPTIONS;
