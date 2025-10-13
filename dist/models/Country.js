import prisma from '../config/database.js';
export class CountryModel {
    static async findAll() {
        try {
            const countries = await prisma.country.findMany({
                orderBy: { name: 'asc' }
            });
            return countries;
        }
        catch (error) {
            throw new Error(`Failed to fetch countries: ${error}`);
        }
    }
    static async findByName(name) {
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
        }
        catch (error) {
            throw new Error(`Failed to find country details: ${error}`);
        }
    }
    static async findById(id) {
        try {
            const country = await prisma.country.findUnique({
                where: { id }
            });
            return country;
        }
        catch (error) {
            throw new Error(`Failed to find country: ${error}`);
        }
    }
    static async findByIdWithDetails(id) {
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
        }
        catch (error) {
            throw new Error(`Failed to find country with details: ${error}`);
        }
    }
    static async searchCountries(searchTerm) {
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
        }
        catch (error) {
            throw new Error(`Failed to search countries: ${error}`);
        }
    }
    // Helper methods for individual country components
    static async findQuickFacts(countryId) {
        try {
            const facts = await prisma.countryQuickFact.findMany({
                where: { countryId }
            });
            return facts;
        }
        catch (error) {
            throw new Error(`Failed to fetch country quick facts: ${error}`);
        }
    }
    static async findTraditions(countryId) {
        try {
            const traditions = await prisma.countryTradition.findMany({
                where: { countryId }
            });
            return traditions;
        }
        catch (error) {
            throw new Error(`Failed to fetch country traditions: ${error}`);
        }
    }
    static async findCuisine(countryId) {
        try {
            const cuisine = await prisma.countryCuisine.findMany({
                where: { countryId }
            });
            return cuisine;
        }
        catch (error) {
            throw new Error(`Failed to fetch country cuisine: ${error}`);
        }
    }
    static async findPlaces(countryId) {
        try {
            const places = await prisma.countryPlace.findMany({
                where: { countryId }
            });
            return places;
        }
        catch (error) {
            throw new Error(`Failed to fetch country places: ${error}`);
        }
    }
    static async findTrends(countryId) {
        try {
            const trends = await prisma.countryTrend.findMany({
                where: { countryId }
            });
            return trends;
        }
        catch (error) {
            throw new Error(`Failed to fetch country trends: ${error}`);
        }
    }
}
// Export des types pour compatibilité
export { CountryModel as default };
//# sourceMappingURL=Country.js.map