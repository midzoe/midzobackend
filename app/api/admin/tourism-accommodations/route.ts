import { adminCollectionRoute } from "@/lib/admin-crud";
import { parseTourismAccommodation } from "@/lib/directory-parsers";
import { TourismAccommodationModel } from "@/src/models/TourismAccommodation";

const handlers = adminCollectionRoute({
  model: TourismAccommodationModel,
  entity: "Tourism accommodation",
  required: ["name", "country", "city", "type", "priceRange"],
  parse: parseTourismAccommodation,
});

export const GET = handlers.GET;
export const POST = handlers.POST;
export const OPTIONS = handlers.OPTIONS;
