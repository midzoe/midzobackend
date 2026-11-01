import { adminItemRoute } from "@/lib/admin-crud";
import { parseVocationalTraining } from "@/lib/directory-parsers";
import { VocationalTrainingModel } from "@/src/models/VocationalTraining";
import { withAutoTranslate } from "@/lib/translate";

const handlers = adminItemRoute({
  model: VocationalTrainingModel,
  entity: "VocationalTraining",
  parse: parseVocationalTraining,
});

export const PUT = withAutoTranslate(handlers.PUT);
export const DELETE = handlers.DELETE;
export const OPTIONS = handlers.OPTIONS;
