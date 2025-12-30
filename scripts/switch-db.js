#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const schemaDir = path.join(__dirname, '../prisma');
const schemaPath = path.join(schemaDir, 'schema.prisma');
const mysqlSchemaPath = path.join(schemaDir, 'schema.mysql.prisma');
const postgresSchemaPath = path.join(schemaDir, 'schema.postgresql.prisma');

// Déterminer quel schéma utiliser en fonction de l'environnement
const isProduction = process.env.NODE_ENV === 'production';
const isPostgres = process.env.DATABASE_PROVIDER === 'postgresql';

let sourceSchema;

if (isPostgres || isProduction) {
  // PostgreSQL pour production ou si explicitly configured
  if (!fs.existsSync(postgresSchemaPath)) {
    // Si pas de fichier séparé, utiliser le courant (supposément PostgreSQL)
    console.log('✓ Using PostgreSQL schema (schema.prisma)');
    process.exit(0);
  }
  sourceSchema = postgresSchemaPath;
  console.log('✓ Switching to PostgreSQL schema');
} else {
  // MySQL pour développement local
  if (!fs.existsSync(mysqlSchemaPath)) {
    console.log('✓ Using current schema (development mode)');
    process.exit(0);
  }
  sourceSchema = mysqlSchemaPath;
  console.log('✓ Switching to MySQL schema');
}

try {
  const content = fs.readFileSync(sourceSchema, 'utf-8');
  fs.writeFileSync(schemaPath, content, 'utf-8');
  console.log(`✓ Schema switched successfully from ${path.basename(sourceSchema)}`);
} catch (error) {
  console.error('✗ Error switching schema:', error.message);
  process.exit(1);
}
