import { adminCollectionRoute } from "@/lib/admin-crud";
import { parseInsurancePlan } from "@/lib/directory-parsers";
import { InsurancePlanModel } from "@/src/models/InsurancePlan";
import { withAutoTranslate } from "@/lib/translate";

const handlers = adminCollectionRoute({
  model: InsurancePlanModel,
  entity: "Insurance plan",
  required: ["provider", "country"],
  parse: parseInsurancePlan,
});

export const GET = handlers.GET;
export const POST = withAutoTranslate(handlers.POST);
export const OPTIONS = handlers.OPTIONS;
