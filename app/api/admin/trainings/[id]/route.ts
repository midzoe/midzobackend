import { adminItemRoute } from "@/lib/admin-crud";
import { parseTraining } from "@/lib/directory-parsers";
import { TrainingModel } from "@/src/models/Training";

const handlers = adminItemRoute({
  model: TrainingModel,
  entity: "Training",
  parse: parseTraining,
});

export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
export const OPTIONS = handlers.OPTIONS;
