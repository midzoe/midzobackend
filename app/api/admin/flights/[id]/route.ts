import { adminItemRoute } from "@/lib/admin-crud";
import { parseFlight } from "@/lib/directory-parsers";
import { FlightModel } from "@/src/models/Flight";

const handlers = adminItemRoute({
  model: FlightModel,
  entity: "Flight",
  parse: parseFlight,
});

export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
export const OPTIONS = handlers.OPTIONS;
