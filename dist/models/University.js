import prisma from '../config/database.js';
import { Prisma } from '@prisma/client';
export class UniversityModel {
    // Mapping of regions to countries for study purposes
    static getCountriesByRegion(region) {
        const regionMap = {
            'europe': ['France', 'Germany', 'Netherlands', 'Italy', 'Belgium', 'Luxembourg', 'Estonia']
        };
        return regionMap[region.toLowerCase()] || [];
    }
    static async findAll(filters = {}) {
        try {
            const where = {};
            // Handle region vs country logic
            if (filters.region && !filters.country) {
                // If only region is specified, get all universities in that region
                const regionCountries = this.getCountriesByRegion(filters.region);
                if (regionCountries.length > 0) {
                    where.country = {
                        in: regionCountries
                    };
                }
            }
            else if (filters.country) {
                // If country is specified, filter by specific country
                where.country = {
                    contains: filters.country
                };
            }
            if (filters.city) {
                where.city = {
                    contains: filters.city
                };
            }
            if (filters.search) {
                where.OR = [
                    {
                        name: {
                            contains: filters.search
                        }
                    },
                    {
                        specialty: {
                            contains: filters.search
                        }
                    }
                ];
            }
            if (filters.programName || filters.programLevel) {
                where.programs = {
                    some: {
                        ...(filters.programName && {
                            name: {
                                contains: filters.programName
                            }
                        }),
                        ...(filters.programLevel && {
                            level: {
                                equals: filters.programLevel
                            }
                        })
                    }
                };
            }
            const universities = await prisma.university.findMany({
                where,
                include: {
                    programs: true
                },
                orderBy: {
                    name: 'asc'
                }
            });
            return universities;
        }
        catch (error) {
            throw new Error(`Failed to fetch universities: ${error}`);
        }
    }
    static async findById(id) {
        try {
            const university = await prisma.university.findUnique({
                where: { id },
                include: {
                    programs: true
                }
            });
            return university;
        }
        catch (error) {
            throw new Error(`Failed to find university: ${error}`);
        }
    }
    static async findByName(name) {
        try {
            const university = await prisma.university.findUnique({
                where: { name },
                include: {
                    programs: true
                }
            });
            return university;
        }
        catch (error) {
            throw new Error(`Failed to find university: ${error}`);
        }
    }
    static async getCountries() {
        try {
            const countries = await prisma.university.findMany({
                select: {
                    country: true
                },
                distinct: ['country'],
                orderBy: {
                    country: 'asc'
                }
            });
            return countries.map(u => u.country);
        }
        catch (error) {
            throw new Error(`Failed to fetch countries: ${error}`);
        }
    }
    static async getCitiesByCountry(country) {
        try {
            const cities = await prisma.university.findMany({
                where: {
                    country: {
                        equals: country
                    }
                },
                select: {
                    city: true
                },
                distinct: ['city'],
                orderBy: {
                    city: 'asc'
                }
            });
            return cities.map(u => u.city);
        }
        catch (error) {
            throw new Error(`Failed to fetch cities: ${error}`);
        }
    }
    static async getPrograms() {
        try {
            const programs = await prisma.universityProgram.findMany({
                select: {
                    name: true,
                    level: true
                },
                distinct: ['name', 'level'],
                orderBy: [
                    { name: 'asc' },
                    { level: 'asc' }
                ]
            });
            return programs;
        }
        catch (error) {
            throw new Error(`Failed to fetch programs: ${error}`);
        }
    }
    static async create(universityData) {
        try {
            const university = await prisma.university.create({
                data: universityData
            });
            return university;
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new Error('University name already exists');
                }
            }
            throw new Error(`Failed to create university: ${error}`);
        }
    }
    static async addProgram(universityId, programData) {
        try {
            const program = await prisma.universityProgram.create({
                data: {
                    ...programData,
                    universityId
                }
            });
            return program;
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new Error('Program already exists for this university');
                }
            }
            throw new Error(`Failed to add program: ${error}`);
        }
    }
    static async update(id, updates) {
        try {
            const university = await prisma.university.update({
                where: { id },
                data: updates
            });
            return university;
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    return null;
                }
            }
            throw new Error(`Failed to update university: ${error}`);
        }
    }
    static async delete(id) {
        try {
            await prisma.university.delete({
                where: { id }
            });
            return true;
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    return false;
                }
            }
            throw new Error(`Failed to delete university: ${error}`);
        }
    }
}
//# sourceMappingURL=University.js.map