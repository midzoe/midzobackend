import prisma from '../../lib/prisma';

// Types temporaires - seront remplacés par les vrais types Prisma une fois générés
export type CategoryType = any;
export type ServiceType = any;
export type CategoryWithServices = CategoryType & { services: ServiceType[] };

export interface CategoryInput {
  id: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  isPublic?: boolean;
  order?: number;
}

export interface ServiceInput {
  name: string;
  displayName?: string | null;
  description?: string | null;
  image?: string | null;
  learnMoreLink?: string | null;
  translationKey?: string | null;
  isExternal?: boolean;
  deliveryMode?: string;
  steps?: string[] | null;
  isActive?: boolean;
  order?: number;
  categoryId?: string;
}

/**
 * Ne retient que les champs réellement fournis : un PATCH partiel envoyé par
 * l'admin ne doit pas remettre à `null` les colonnes qu'il n'a pas touchées.
 */
function pickServiceData(data: Partial<ServiceInput>) {
  const out: Record<string, unknown> = {};
  const keys: (keyof ServiceInput)[] = [
    'name', 'displayName', 'description', 'image', 'learnMoreLink',
    'translationKey', 'isExternal', 'deliveryMode', 'steps', 'isActive',
    'order', 'categoryId',
  ];
  for (const k of keys) {
    if (data[k] !== undefined) out[k] = data[k];
  }
  return out;
}

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
        where: { categoryId, isActive: true },
        orderBy: { order: 'asc' }
      });
      
      return services;
    } catch (error) {
      throw new Error(`Failed to fetch services for category: ${error}`);
    }
  }

  static async updateService(
    id: number,
    data: Partial<ServiceInput>
  ): Promise<ServiceType | null> {
    try {
      // `undefined` = champ non fourni (Prisma l'ignore) ; un PATCH partiel
      // ne doit pas écraser les colonnes absentes du corps de requête.
      const service = await prisma.service.update({
        where: { id },
        data: pickServiceData(data),
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
        where: { category: { isPublic: true }, isActive: true },
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

  // ---------------------------------------------------------------------------
  // Administration du catalogue (catégories + services)
  // Contrairement aux lectures publiques, ces méthodes voient TOUT : catégories
  // masquées (isPublic=false) et services désactivés (isActive=false).
  // ---------------------------------------------------------------------------

  static async findAllForAdmin(): Promise<CategoryType[]> {
    return prisma.category.findMany({
      include: {
        subcategories: { orderBy: { order: 'asc' } },
        _count: { select: { services: true } },
      },
      orderBy: { order: 'asc' },
    });
  }

  static async createCategory(data: CategoryInput): Promise<CategoryType> {
    return prisma.category.create({
      data: {
        id: data.id,
        name: data.name,
        description: data.description ?? null,
        icon: data.icon ?? null,
        isPublic: data.isPublic ?? true,
        order: data.order ?? 0,
      },
    });
  }

  static async updateCategory(
    id: string,
    data: Partial<CategoryInput>
  ): Promise<CategoryType | null> {
    try {
      return await prisma.category.update({
        where: { id },
        data: {
          ...(data.name !== undefined ? { name: data.name } : {}),
          ...(data.description !== undefined ? { description: data.description } : {}),
          ...(data.icon !== undefined ? { icon: data.icon } : {}),
          ...(data.isPublic !== undefined ? { isPublic: data.isPublic } : {}),
          ...(data.order !== undefined ? { order: data.order } : {}),
        },
      });
    } catch (error: any) {
      if (error?.code === 'P2025') return null;
      throw error;
    }
  }

  /**
   * Suppression refusée tant que la catégorie porte des services : la cascade
   * Prisma n'est pas définie sur `Service.category`, et supprimer en silence
   * des services facturés serait pire qu'une erreur explicite.
   */
  static async deleteCategory(id: string): Promise<'ok' | 'not_found' | 'has_services'> {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { services: true } } },
    });
    if (!category) return 'not_found';
    if ((category as any)._count.services > 0) return 'has_services';
    await prisma.category.delete({ where: { id } });
    return 'ok';
  }

  static async findAllServicesForAdmin(categoryId?: string): Promise<ServiceType[]> {
    return prisma.service.findMany({
      where: categoryId ? { categoryId } : {},
      orderBy: [{ categoryId: 'asc' }, { order: 'asc' }],
    });
  }

  static async createService(data: ServiceInput): Promise<ServiceType> {
    return prisma.service.create({
      data: {
        name: data.name,
        categoryId: data.categoryId!,
        displayName: data.displayName ?? null,
        description: data.description ?? null,
        image: data.image ?? null,
        learnMoreLink: data.learnMoreLink ?? null,
        translationKey: data.translationKey ?? null,
        isExternal: data.isExternal ?? false,
        deliveryMode: data.deliveryMode ?? 'online',
        steps: (data.steps ?? undefined) as any,
        isActive: data.isActive ?? true,
        order: data.order ?? 0,
      },
    });
  }

  static async deleteService(id: number): Promise<'ok' | 'not_found' | 'has_bookings'> {
    const service = await prisma.service.findUnique({
      where: { id },
      include: { _count: { select: { bookings: true } } },
    });
    if (!service) return 'not_found';
    // Un service réservé reste en base : on le désactive plutôt que de casser
    // l'historique de réservation qui le référence.
    if ((service as any)._count.bookings > 0) return 'has_bookings';
    await prisma.service.delete({ where: { id } });
    return 'ok';
  }
}

