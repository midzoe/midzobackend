import { adminCollectionRoute } from "@/lib/admin-crud";
import { parseRestaurant } from "@/lib/directory-parsers";
import { RestaurantModel } from "@/src/models/Restaurant";

const handlers = adminCollectionRoute({
  model: RestaurantModel,
  entity: "Restaurant",
  required: ["name", "country", "location", "cuisine", "priceRange"],
  parse: parseRestaurant,
});

export const GET = handlers.GET;
export const POST = handlers.POST;
export const OPTIONS = handlers.OPTIONS;
