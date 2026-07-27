import { adminItemRoute } from "@/lib/admin-crud";
import { parseServiceProvider } from "@/lib/directory-parsers";
import { ServiceProviderModel } from "@/src/models/ServiceProvider";

const handlers = adminItemRoute({
  model: ServiceProviderModel,
  entity: "Service provider",
  parse: parseServiceProvider,
});

export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
export const OPTIONS = handlers.OPTIONS;
