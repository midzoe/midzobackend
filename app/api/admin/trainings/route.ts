import { adminCollectionRoute } from "@/lib/admin-crud";
import { parseTraining } from "@/lib/directory-parsers";
import { TrainingModel } from "@/src/models/Training";

const handlers = adminCollectionRoute({
  model: TrainingModel,
  entity: "Training",
  required: ["provider", "country", "course"],
  parse: parseTraining,
});

export const GET = handlers.GET;
export const POST = handlers.POST;
export const OPTIONS = handlers.OPTIONS;
