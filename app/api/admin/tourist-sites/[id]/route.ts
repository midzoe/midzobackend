import { adminItemRoute } from "@/lib/admin-crud";
import { parseTouristSite } from "@/lib/directory-parsers";
import { TouristSiteModel } from "@/src/models/TouristSite";

const handlers = adminItemRoute({
  model: TouristSiteModel,
  entity: "Tourist site",
  parse: parseTouristSite,
});

export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
export const OPTIONS = handlers.OPTIONS;
