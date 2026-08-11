/**
 * Libellés français des pays, avec l'article ou la préposition qui convient.
 *
 * Les noms sont stockés en anglais en base (`countries.name`, `study_countries.name`).
 * Sans cette table, les messages générés donnaient « un voyage de Senegal vers
 * United Kingdom » dans une phrase française.
 *
 * `from` = « du Togo », « de Côte d'Ivoire » — ce qui suit « un départ ».
 * `the`  = « le Royaume-Uni », « la France » — ce qui suit « pour ».
 *
 * Vit hors des route files : Next n'autorise que les handlers HTTP en export d'une route.
 */

/** Pays d'origine (Afrique). */
const FROM: Record<string, string> = {
  Togo: "du Togo",
  Benin: "du Bénin",
  "Côte d'Ivoire": "de Côte d'Ivoire",
  Senegal: "du Sénégal",
  Guinea: "de Guinée",
  Mali: "du Mali",
  "Burkina Faso": "du Burkina Faso",
  Niger: "du Niger",
  Cameroon: "du Cameroun",
  Chad: "du Tchad",
  Gabon: "du Gabon",
  "Republic of the Congo": "du Congo",
  "DR Congo": "de République démocratique du Congo",
  Nigeria: "du Nigeria",
  Ghana: "du Ghana",
  Kenya: "du Kenya",
  Morocco: "du Maroc",
  Tunisia: "de Tunisie",
  Egypt: "d'Égypte",
  "South Africa": "d'Afrique du Sud",
  Algeria: "d'Algérie",
  Angola: "d'Angola",
  Botswana: "du Botswana",
  Burundi: "du Burundi",
  "Cape Verde": "du Cap-Vert",
  "Central African Republic": "de Centrafrique",
  Comoros: "des Comores",
  Djibouti: "de Djibouti",
  "Equatorial Guinea": "de Guinée équatoriale",
  Eritrea: "d'Érythrée",
  Eswatini: "d'Eswatini",
  Ethiopia: "d'Éthiopie",
  Gambia: "de Gambie",
  "Guinea-Bissau": "de Guinée-Bissau",
  Lesotho: "du Lesotho",
  Liberia: "du Liberia",
  Libya: "de Libye",
  Madagascar: "de Madagascar",
  Malawi: "du Malawi",
  Mauritania: "de Mauritanie",
  Mauritius: "de Maurice",
  Mozambique: "du Mozambique",
  Namibia: "de Namibie",
  Rwanda: "du Rwanda",
  "São Tomé and Príncipe": "de São Tomé-et-Príncipe",
  Seychelles: "des Seychelles",
  "Sierra Leone": "de Sierra Leone",
  Somalia: "de Somalie",
  Sudan: "du Soudan",
  "South Sudan": "du Soudan du Sud",
  Tanzania: "de Tanzanie",
  Uganda: "d'Ouganda",
  Zambia: "de Zambie",
  Zimbabwe: "du Zimbabwe",
};

/** Pays de destination (études) et quelques autres, avec leur article. */
const THE: Record<string, string> = {
  France: "la France",
  Germany: "l'Allemagne",
  Belgium: "la Belgique",
  Netherlands: "les Pays-Bas",
  Italy: "l'Italie",
  Spain: "l'Espagne",
  Portugal: "le Portugal",
  Luxembourg: "le Luxembourg",
  Switzerland: "la Suisse",
  Sweden: "la Suède",
  "United Kingdom": "le Royaume-Uni",
  "United States": "les États-Unis",
  Canada: "le Canada",
  China: "la Chine",
  Morocco: "le Maroc",
  Senegal: "le Sénégal",
  Togo: "le Togo",
  Ghana: "le Ghana",
  Nigeria: "le Nigeria",
  Kenya: "le Kenya",
  "Côte d'Ivoire": "la Côte d'Ivoire",
  Benin: "le Bénin",
  "South Africa": "l'Afrique du Sud",
  Tunisia: "la Tunisie",
  Egypt: "l'Égypte",
};

/** « du Togo ». Retombe sur « de <nom> » pour un pays absent de la table. */
export function countryFrom(name: string): string {
  return FROM[name] ?? `de ${name}`;
}

/** « le Royaume-Uni ». Retombe sur le nom brut pour un pays absent de la table. */
export function countryThe(name: string): string {
  return THE[name] ?? name;
}
