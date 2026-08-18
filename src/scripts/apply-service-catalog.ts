/**
 * Applique UNIQUEMENT le catalogue catégories/sous-catégories/services.
 *
 * Utile en production : le seed complet reseede pays, universités et fiches
 * (plusieurs minutes, et il touche des données éditées depuis l'admin), alors
 * qu'ici on ne veut synchroniser que le catalogue de services.
 *
 * Idempotent : upserts par clé naturelle, aucune suppression.
 *   npx tsx src/scripts/apply-service-catalog.ts
 */
import { PrismaClient } from '@prisma/client';
import { categoriesData, subcategoriesData, servicesData } from './data/service-catalog';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Synchronisation du catalogue de services…');

  for (const category of categoriesData) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {
        name: category.name,
        description: category.description,
        icon: category.icon,
        isPublic: category.isPublic,
        order: category.order,
      },
      create: category,
    });
  }
  console.log(`  ✅ ${categoriesData.length} catégorie(s)`);

  for (const sub of subcategoriesData) {
    await prisma.subcategory.upsert({
      where: { categoryId_name: { categoryId: sub.categoryId, name: sub.name } },
      update: { order: sub.order, isOther: sub.isOther },
      create: sub,
    });
  }
  console.log(`  ✅ ${subcategoriesData.length} sous-catégorie(s)`);

  for (const service of servicesData) {
    await prisma.service.upsert({
      where: { categoryId_name: { categoryId: service.categoryId, name: service.name } },
      update: service as any,
      create: service as any,
    });
  }
  console.log(`  ✅ ${servicesData.length} service(s)`);

  const publicCount = await prisma.service.count({
    where: { isActive: true, category: { isPublic: true } },
  });
  console.log(`\n📊 Services visibles sur /services : ${publicCount}`);
}

main()
  .catch((e) => {
    console.error('❌', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
