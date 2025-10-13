export type CategoryType = any;
export type ServiceType = any;
export type CategoryWithServices = CategoryType & {
    services: ServiceType[];
};
export declare class CategoryModel {
    static findAll(): Promise<CategoryType[]>;
    static findById(id: string): Promise<CategoryType | null>;
    static findServicesbyCategory(categoryId: string): Promise<ServiceType[]>;
    static findAllServices(): Promise<ServiceType[]>;
    static findCategoriesWithServices(): Promise<CategoryWithServices[]>;
}
export { CategoryModel as default, CategoryType as Category, ServiceType as Service };
//# sourceMappingURL=Category.d.ts.map