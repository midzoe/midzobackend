import prisma from '../../lib/prisma';

// Types temporaires - seront remplacés par les vrais types Prisma une fois générés
export type CategoryType = any;
export type ServiceType = any;
export type CategoryWithServices = CategoryType & { services: ServiceType[] };

export class CategoryModel {
  // Catalogue public uniquement (professional/business sont isPublic=false).
  static async findAll(): Promise<CategoryType[]> {
    try {
      const categories = await prisma.category.findMany({
        where: { isPublic: true },
        include: {
          subcategories: {
            orderBy: { order: 'asc' }
          }
        },
        orderBy: { order: 'asc' }
      });

      return categories;
    } catch (error) {
      throw new Error(`Failed to fetch categories: ${error}`);
    }
  }

  static async findById(id: string): Promise<CategoryType | null> {
    try {
      const category = await prisma.category.findUnique({
        where: { id },
        include: {
          subcategories: {
            orderBy: { order: 'asc' }
          }
        }
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
        orderBy: { order: 'asc' }
      });
      
      return services;
    } catch (error) {
      throw new Error(`Failed to fetch services for category: ${error}`);
    }
  }

  static async updateService(
    id: number,
    data: { deliveryMode?: string; name?: string; description?: string }
  ): Promise<ServiceType | null> {
    try {
      const service = await prisma.service.update({
        where: { id },
        data,
      });

      return service;
    } catch (error: any) {
      // P2025 = enregistrement à mettre à jour introuvable
      if (error?.code === 'P2025') {
        return null;
      }
      throw new Error(`Failed to update service: ${error}`);
    }
  }

  // Services des catégories publiques, dans l'ordre du catalogue : `order` pilote
  // l'affichage et la séquence d'étapes du TripWizard.
  static async findAllServices(): Promise<ServiceType[]> {
    try {
      const services = await prisma.service.findMany({
        where: { category: { isPublic: true } },
        orderBy: [
          { categoryId: 'asc' },
          { order: 'asc' }
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
            orderBy: { order: 'asc' }
          }
        },
        orderBy: { order: 'asc' }
      });
      
      return categories;
    } catch (error) {
      throw new Error(`Failed to fetch categories with services: ${error}`);
    }
  }
}

