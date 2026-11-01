import { adminCollectionRoute } from "@/lib/admin-crud";
import { parseBank } from "@/lib/directory-parsers";
import { BankModel } from "@/src/models/Bank";
import { withAutoTranslate } from "@/lib/translate";

const handlers = adminCollectionRoute({
  model: BankModel,
  entity: "Bank",
  required: ["name", "country"],
  parse: parseBank,
});

export const GET = handlers.GET;
export const POST = withAutoTranslate(handlers.POST);
export const OPTIONS = handlers.OPTIONS;
