#!/usr/bin/env node
/**
 * One-time seed script for Vercel
 * Exécute le seed seulement si la table est vide
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Vérifier si on a déjà des données
    const userCount = await prisma.user.count();
    const countryCount = await prisma.country.count();

    if (userCount > 0 || countryCount > 0) {
      console.log('✓ Database already seeded, skipping...');
      return;
    }

    console.log('🌱 Seeding database...');

    // Importer et exécuter le seed principal
    const seedModule = await import('./seed.ts');
    if (seedModule.default) {
      await seedModule.default();
    }

    console.log('✅ Seeding complete!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
