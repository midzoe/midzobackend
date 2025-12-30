import prisma from '../../lib/prisma';

// Types temporaires - seront remplacés par les vrais types Prisma une fois générés
export type CategoryType = any;
export type ServiceType = any;
export type CategoryWithServices = CategoryType & { services: ServiceType[] };

export class CategoryModel {
  static async findAll(): Promise<CategoryType[]> {
    try {
      const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' }
      });
      
      return categories;
    } catch (error) {
      throw new Error(`Failed to fetch categories: ${error}`);
    }
  }

  static async findById(id: string): Promise<CategoryType | null> {
    try {
      const category = await prisma.category.findUnique({
        where: { id }
      });
      
      return category;
    } catch (error) {
      throw new Error(`Failed to find category: ${error}`);
    }
  }

  static async findServicesbyCategory(categoryId: string): Promise<ServiceType[]> {
    try {
      const services = await prisma.service.findMany({
        where: { categoryId },
        orderBy: { name: 'asc' }
      });
      
      return services;
    } catch (error) {
      throw new Error(`Failed to fetch services for category: ${error}`);
    }
  }

  static async findAllServices(): Promise<ServiceType[]> {
    try {
      const services = await prisma.service.findMany({
        orderBy: [
          { categoryId: 'asc' },
          { name: 'asc' }
        ]
      });
      
      return services;
    } catch (error) {
      throw new Error(`Failed to fetch services: ${error}`);
    }
  }

  static async findCategoriesWithServices(): Promise<CategoryWithServices[]> {
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
    } catch (error) {
      throw new Error(`Failed to fetch categories with services: ${error}`);
    }
  }
}

