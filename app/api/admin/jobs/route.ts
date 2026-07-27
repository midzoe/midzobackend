import { adminCollectionRoute } from "@/lib/admin-crud";
import { parseJob } from "@/lib/directory-parsers";
import { JobModel } from "@/src/models/Job";

const handlers = adminCollectionRoute({
  model: JobModel,
  entity: "Job",
  required: ["title", "company", "country", "location", "type"],
  parse: parseJob,
});

export const GET = handlers.GET;
export const POST = handlers.POST;
export const OPTIONS = handlers.OPTIONS;
