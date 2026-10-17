import { adminItemRoute } from "@/lib/admin-crud";
import { parseVocationalTraining } from "@/lib/directory-parsers";
import { VocationalTrainingModel } from "@/src/models/VocationalTraining";

const handlers = adminItemRoute({
  model: VocationalTrainingModel,
  entity: "VocationalTraining",
  parse: parseVocationalTraining,
});

export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
export const OPTIONS = handlers.OPTIONS;
