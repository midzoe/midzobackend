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
export declare class CountryModel {
    static findAll(): Promise<CountryType[]>;
    static findByName(name: string): Promise<CountryDetail | null>;
    static findById(id: number): Promise<CountryType | null>;
    static findByIdWithDetails(id: number): Promise<CountryDetail | null>;
    static searchCountries(searchTerm: string): Promise<CountryType[]>;
    static findQuickFacts(countryId: number): Promise<CountryQuickFactType[]>;
    static findTraditions(countryId: number): Promise<CountryTraditionType[]>;
    static findCuisine(countryId: number): Promise<CountryCuisineType[]>;
    static findPlaces(countryId: number): Promise<CountryPlaceType[]>;
    static findTrends(countryId: number): Promise<CountryTrendType[]>;
}
export { CountryModel as default, CountryType as Country, CountryQuickFactType as CountryQuickFact, CountryTraditionType as CountryTradition, CountryCuisineType as CountryCuisine, CountryPlaceType as CountryPlace, CountryTrendType as CountryTrend };
//# sourceMappingURL=Country.d.ts.map