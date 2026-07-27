import { adminCollectionRoute } from "@/lib/admin-crud";
import { parseFlight } from "@/lib/directory-parsers";
import { FlightModel } from "@/src/models/Flight";

const handlers = adminCollectionRoute({
  model: FlightModel,
  entity: "Flight",
  required: ["airline", "fromCountry", "fromCity", "toCountry", "toCity", "departure", "arrival", "price", "type"],
  parse: parseFlight,
});

export const GET = handlers.GET;
export const POST = handlers.POST;
export const OPTIONS = handlers.OPTIONS;
