import { adminCollectionRoute } from "@/lib/admin-crud";
import { parseVocationalTraining } from "@/lib/directory-parsers";
import { VocationalTrainingModel } from "@/src/models/VocationalTraining";

const handlers = adminCollectionRoute({
  model: VocationalTrainingModel,
  entity: "VocationalTraining",
  required: ["occupation", "domain", "employer", "country", "city"],
  parse: parseVocationalTraining,
});

export const GET = handlers.GET;
export const POST = handlers.POST;
export const OPTIONS = handlers.OPTIONS;
