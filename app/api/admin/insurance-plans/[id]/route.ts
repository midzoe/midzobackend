import { adminItemRoute } from "@/lib/admin-crud";
import { parseInsurancePlan } from "@/lib/directory-parsers";
import { InsurancePlanModel } from "@/src/models/InsurancePlan";

const handlers = adminItemRoute({
  model: InsurancePlanModel,
  entity: "Insurance plan",
  parse: parseInsurancePlan,
});

export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
export const OPTIONS = handlers.OPTIONS;
