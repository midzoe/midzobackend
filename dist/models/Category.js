import prisma from '../config/database.js';
export class CategoryModel {
    static async findAll() {
        try {
            const categories = await prisma.category.findMany({
                orderBy: { name: 'asc' }
            });
            return categories;
        }
        catch (error) {
            throw new Error(`Failed to fetch categories: ${error}`);
        }
    }
    static async findById(id) {
        try {
            const category = await prisma.category.findUnique({
                where: { id }
            });
            return category;
        }
        catch (error) {
            throw new Error(`Failed to find category: ${error}`);
        }
    }
    static async findServicesbyCategory(categoryId) {
        try {
            const services = await prisma.service.findMany({
                where: { categoryId },
                orderBy: { name: 'asc' }
            });
            return services;
        }
        catch (error) {
            throw new Error(`Failed to fetch services for category: ${error}`);
        }
    }
    static async findAllServices() {
        try {
            const services = await prisma.service.findMany({
                orderBy: [
                    { categoryId: 'asc' },
                    { name: 'asc' }
                ]
            });
            return services;
        }
        catch (error) {
            throw new Error(`Failed to fetch services: ${error}`);
        }
    }
    static async findCategoriesWithServices() {
        try {
            const categories = await prisma.category.findMany({
                include: {
                    services: {
                        orderBy: { name: 'asc' }
                    }
                },
                orderBy: { name: 'asc' }
            });
            return categories;
        }
        catch (error) {
            throw new Error(`Failed to fetch categories with services: ${error}`);
        }
    }
}
// Export des types pour compatibilité
export { CategoryModel as default };
//# sourceMappingURL=Category.js.map