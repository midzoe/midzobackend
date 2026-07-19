// Seed initial des ambassades (story 4.1).
// Une ambassade par pays validé (Country.isValidated = true, cf. seed.ts : les 12 fiches
// complètes de countryDetailsSeed). `country` = nom du pays (cohérent avec Visa.originCountry
// / destinationCountry qui stockent le nom, pas d'FK). Données de départ éditables via l'admin.

export interface EmbassySeed {
  country: string;
  name: string;
  location?: string;
  link?: string;
  email?: string;
  phone?: string;
}

export const embassiesSeed: EmbassySeed[] = [
  {
    country: "France",
    name: "Ambassade de France",
    location: "Paris, France",
    link: "https://www.diplomatie.gouv.fr",
  },
  {
    country: "United Kingdom",
    name: "Embassy of the United Kingdom",
    location: "London, United Kingdom",
    link: "https://www.gov.uk/world/organisations",
  },
  {
    country: "United States",
    name: "Embassy of the United States",
    location: "Washington, D.C., United States",
    link: "https://travel.state.gov",
  },
  {
    country: "Canada",
    name: "Embassy of Canada",
    location: "Ottawa, Canada",
    link: "https://www.canada.ca/en/immigration-refugees-citizenship.html",
  },
  {
    country: "Germany",
    name: "Embassy of Germany",
    location: "Berlin, Germany",
    link: "https://www.auswaertiges-amt.de",
  },
  {
    country: "Netherlands",
    name: "Embassy of the Netherlands",
    location: "The Hague, Netherlands",
    link: "https://www.netherlandsworldwide.nl",
  },
  {
    country: "Spain",
    name: "Embassy of Spain",
    location: "Madrid, Spain",
    link: "https://www.exteriores.gob.es",
  },
  {
    country: "Sweden",
    name: "Embassy of Sweden",
    location: "Stockholm, Sweden",
    link: "https://www.swedenabroad.se",
  },
  {
    country: "Switzerland",
    name: "Embassy of Switzerland",
    location: "Bern, Switzerland",
    link: "https://www.eda.admin.ch",
  },
  {
    country: "Portugal",
    name: "Embassy of Portugal",
    location: "Lisbon, Portugal",
    link: "https://www.portaldiplomatico.mne.gov.pt",
  },
  {
    country: "China",
    name: "Embassy of China",
    location: "Beijing, China",
    link: "http://www.mfa.gov.cn/eng",
  },
  {
    country: "Italy",
    name: "Embassy of Italy",
    location: "Rome, Italy",
    link: "https://www.esteri.it",
  },
];
