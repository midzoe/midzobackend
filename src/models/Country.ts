import prisma from '../config/database.js';

// Types temporaires - seront remplacés par les vrais types Prisma une fois générés
export type CountryType = any;
export type CountryQuickFactType = any;
export type CountryTraditionType = any;
export type CountryCuisineType = any;
export type CountryPlaceType = any;
export type CountryTrendType = any;

export interface CountryDetail extends CountryType {
  quickFacts: CountryQuickFactType[];
  traditions: CountryTraditionType[];
  cuisine: CountryCuisineType[];
  places: CountryPlaceType[];
  trends: CountryTrendType[];
}

export class CountryModel {
  static async findAll(): Promise<CountryType[]> {
    try {
      const countries = await prisma.country.findMany({
        orderBy: { name: 'asc' }
      });
      
      return countries;
    } catch (error) {
      throw new Error(`Failed to fetch countries: ${error}`);
    }
  }

  static async findByName(name: string): Promise<CountryDetail | null> {
    try {
      const country = await prisma.country.findUnique({
        where: { name },
        include: {
          quickFacts: true,
          traditions: true,
          cuisine: true,
          places: true,
          trends: true
        }
      });
      
      return country;
    } catch (error) {
      throw new Error(`Failed to find country details: ${error}`);
    }
  }

  static async findById(id: number): Promise<CountryType | null> {
    try {
      const country = await prisma.country.findUnique({
        where: { id }
      });
      
      return country;
    } catch (error) {
      throw new Error(`Failed to find country: ${error}`);
    }
  }

  static async findByIdWithDetails(id: number): Promise<CountryDetail | null> {
    try {
      const country = await prisma.country.findUnique({
        where: { id },
        include: {
          quickFacts: true,
          traditions: true,
          cuisine: true,
          places: true,
          trends: true
        }
      });
      
      return country;
    } catch (error) {
      throw new Error(`Failed to find country with details: ${error}`);
    }
  }

  static async searchCountries(searchTerm: string): Promise<CountryType[]> {
    try {
      const countries = await prisma.country.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm } },
            { code: { contains: searchTerm } }
          ]
        },
        orderBy: { name: 'asc' }
      });
      
      return countries;
    } catch (error) {
      throw new Error(`Failed to search countries: ${error}`);
    }
  }

  // Helper methods for individual country components
  static async findQuickFacts(countryId: number): Promise<CountryQuickFactType[]> {
    try {
      const facts = await prisma.countryQuickFact.findMany({
        where: { countryId }
      });
      
      return facts;
    } catch (error) {
      throw new Error(`Failed to fetch country quick facts: ${error}`);
    }
  }

  static async findTraditions(countryId: number): Promise<CountryTraditionType[]> {
    try {
      const traditions = await prisma.countryTradition.findMany({
        where: { countryId }
      });
      
      return traditions;
    } catch (error) {
      throw new Error(`Failed to fetch country traditions: ${error}`);
    }
  }

  static async findCuisine(countryId: number): Promise<CountryCuisineType[]> {
    try {
      const cuisine = await prisma.countryCuisine.findMany({
        where: { countryId }
      });
      
      return cuisine;
    } catch (error) {
      throw new Error(`Failed to fetch country cuisine: ${error}`);
    }
  }

  static async findPlaces(countryId: number): Promise<CountryPlaceType[]> {
    try {
      const places = await prisma.countryPlace.findMany({
        where: { countryId }
      });
      
      return places;
    } catch (error) {
      throw new Error(`Failed to fetch country places: ${error}`);
    }
  }

  static async findTrends(countryId: number): Promise<CountryTrendType[]> {
    try {
      const trends = await prisma.countryTrend.findMany({
        where: { countryId }
      });
      
      return trends;
    } catch (error) {
      throw new Error(`Failed to fetch country trends: ${error}`);
    }
  }
}

// Export des types pour compatibilité
export { 
  CountryModel as default, 
  CountryType as Country, 
  CountryQuickFactType as CountryQuickFact,
  CountryTraditionType as CountryTradition,
  CountryCuisineType as CountryCuisine,
  CountryPlaceType as CountryPlace,
  CountryTrendType as CountryTrend
};