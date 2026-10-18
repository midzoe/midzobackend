import { adminCollectionRoute } from "@/lib/admin-crud";
import { parsePricedService } from "@/lib/directory-parsers";
import { PricedServiceModel } from "@/src/models/PricedService";

const handlers = adminCollectionRoute({
  model: PricedServiceModel,
  entity: "PricedService",
  required: ["code", "family", "name", "priceCents"],
  parse: parsePricedService,
});

export const GET = handlers.GET;
export const POST = handlers.POST;
export const OPTIONS = handlers.OPTIONS;
