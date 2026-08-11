/**
 * Normalisation du corps des requêtes « ambassade » (story 4.8).
 *
 * Même contrat que la fiche visa : clés snake_case côté admin, chaîne vide = champ
 * effacé (`null`), clé absente = champ non touché (mise à jour partielle).
 *
 * Vit hors des route files : Next n'autorise que les handlers HTTP en export d'une route.
 */
import { toList, toBool } from "./directory-input";
import type { CreateEmbassyData } from "@/src/models/Embassy";

function text(value: unknown): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const s = String(value).trim();
  return s.length > 0 ? s : null;
}

function list(value: unknown): string[] | undefined {
  const l = toList(value);
  if (l === undefined) return value === null ? [] : undefined;
  return l;
}

/**
 * Lien de recherche Google Maps à partir du nom et de la ville. On génère une
 * RECHERCHE plutôt que des coordonnées : sans adresse exacte vérifiée, une
 * recherche mène au bon endroit alors qu'un point inventé mènerait à côté.
 */
export function buildMapsUrl(name: string, city?: string | null, hostCountry?: string | null) {
  const query = [name, city, hostCountry].filter(Boolean).join(" ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function embassyPayload(body: Record<string, any>): Partial<CreateEmbassyData> {
  const out: Record<string, unknown> = {};
  const has = (key: string) => Object.prototype.hasOwnProperty.call(body, key);
  const set = (key: keyof CreateEmbassyData, value: unknown) => {
    if (value !== undefined) out[key] = value;
  };

  set("country", text(body.country) ?? undefined);
  set("name", text(body.name) ?? undefined);
  set("location", text(body.location));
  set("link", text(body.link));
  set("email", text(body.email));
  set("phone", text(body.phone));
  set("hostCountry", text(body.host_country));
  set("city", text(body.city));
  set("address", text(body.address));
  set("mapsUrl", text(body.maps_url));
  if (has("type")) set("type", text(body.type) ?? "Ambassade");
  if (has("covered_countries")) set("coveredCountries", list(body.covered_countries));
  if (has("is_validated")) set("isValidated", toBool(body.is_validated) ?? false);

  return out as Partial<CreateEmbassyData>;
}
