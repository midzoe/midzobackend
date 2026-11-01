import { adminItemRoute } from "@/lib/admin-crud";
import { parseBank } from "@/lib/directory-parsers";
import { BankModel } from "@/src/models/Bank";
import { withAutoTranslate } from "@/lib/translate";

const handlers = adminItemRoute({
  model: BankModel,
  entity: "Bank",
  parse: parseBank,
});

export const PUT = withAutoTranslate(handlers.PUT);
export const DELETE = handlers.DELETE;
export const OPTIONS = handlers.OPTIONS;
