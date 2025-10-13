import { University, UniversityProgram } from '@prisma/client';
export type UniversityWithPrograms = University & {
    programs: UniversityProgram[];
};
export interface CreateUniversityData {
    name: string;
    city: string;
    country: string;
    website?: string;
    applicationUrl?: string;
    specialty?: string;
}
export interface CreateProgramData {
    name: string;
    level: string;
}
export interface UniversityFilters {
    country?: string;
    region?: string;
    city?: string;
    programName?: string;
    programLevel?: string;
    search?: string;
}
export declare class UniversityModel {
    private static getCountriesByRegion;
    static findAll(filters?: UniversityFilters): Promise<UniversityWithPrograms[]>;
    static findById(id: number): Promise<UniversityWithPrograms | null>;
    static findByName(name: string): Promise<UniversityWithPrograms | null>;
    static getCountries(): Promise<string[]>;
    static getCitiesByCountry(country: string): Promise<string[]>;
    static getPrograms(): Promise<{
        name: string;
        level: string;
    }[]>;
    static create(universityData: CreateUniversityData): Promise<University>;
    static addProgram(universityId: number, programData: CreateProgramData): Promise<UniversityProgram>;
    static update(id: number, updates: Partial<CreateUniversityData>): Promise<University | null>;
    static delete(id: number): Promise<boolean>;
}
//# sourceMappingURL=University.d.ts.map