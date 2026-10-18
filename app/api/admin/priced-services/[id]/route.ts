import { adminItemRoute } from "@/lib/admin-crud";
import { parsePricedService } from "@/lib/directory-parsers";
import { PricedServiceModel } from "@/src/models/PricedService";

const handlers = adminItemRoute({
  model: PricedServiceModel,
  entity: "PricedService",
  parse: parsePricedService,
});

export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
export const OPTIONS = handlers.OPTIONS;
