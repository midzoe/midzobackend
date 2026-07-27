import { adminCollectionRoute } from "@/lib/admin-crud";
import { parseBank } from "@/lib/directory-parsers";
import { BankModel } from "@/src/models/Bank";

const handlers = adminCollectionRoute({
  model: BankModel,
  entity: "Bank",
  required: ["name", "country"],
  parse: parseBank,
});

export const GET = handlers.GET;
export const POST = handlers.POST;
export const OPTIONS = handlers.OPTIONS;
