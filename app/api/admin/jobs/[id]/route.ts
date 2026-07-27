import { adminItemRoute } from "@/lib/admin-crud";
import { parseJob } from "@/lib/directory-parsers";
import { JobModel } from "@/src/models/Job";

const handlers = adminItemRoute({
  model: JobModel,
  entity: "Job",
  parse: parseJob,
});

export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
export const OPTIONS = handlers.OPTIONS;
