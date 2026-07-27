import { adminItemRoute } from "@/lib/admin-crud";
import { parseTourismAccommodation } from "@/lib/directory-parsers";
import { TourismAccommodationModel } from "@/src/models/TourismAccommodation";

const handlers = adminItemRoute({
  model: TourismAccommodationModel,
  entity: "Tourism accommodation",
  parse: parseTourismAccommodation,
});

export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
export const OPTIONS = handlers.OPTIONS;
