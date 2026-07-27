import { adminItemRoute } from "@/lib/admin-crud";
import { parseRestaurant } from "@/lib/directory-parsers";
import { RestaurantModel } from "@/src/models/Restaurant";

const handlers = adminItemRoute({
  model: RestaurantModel,
  entity: "Restaurant",
  parse: parseRestaurant,
});

export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
export const OPTIONS = handlers.OPTIONS;
