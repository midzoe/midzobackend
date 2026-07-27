import { adminCollectionRoute } from "@/lib/admin-crud";
import { parseServiceProvider } from "@/lib/directory-parsers";
import { ServiceProviderModel } from "@/src/models/ServiceProvider";

const handlers = adminCollectionRoute({
  model: ServiceProviderModel,
  entity: "Service provider",
  required: ["provider", "country", "serviceType"],
  parse: parseServiceProvider,
});

export const GET = handlers.GET;
export const POST = handlers.POST;
export const OPTIONS = handlers.OPTIONS;
