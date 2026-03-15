# Migration vers PostgreSQL pour Vercel

Ce guide explique comment passer de MySQL (local) à PostgreSQL (Vercel).

## Situation actuelle

- **Local** : MySQL avec le schéma Prisma actuel
- **Vercel** : Nous allons utiliser PostgreSQL

## Changements minimes requis

Grâce à notre configuration, **seul le provider Prisma change** !

### Étape 1 : Créer un schema pour PostgreSQL

Créez un nouveau fichier `prisma/schema.postgresql.prisma` :

```prisma
// This is your Prisma schema file for PostgreSQL

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ... (le reste est IDENTIQUE au fichier MySQL)
```

### Étape 2 : Sur Vercel, changez le provider

Avant de déployer sur Vercel :

1. Changez `prisma/schema.prisma` :

```diff
- provider = "mysql"
+ provider = "postgresql"
```

2. Ou créez deux fichiers séparés et basculez selon l'environnement.

### Étape 3 : Configurez la DATABASE_URL sur Vercel

Dans le dashboard Vercel :

**Project Settings → Environment Variables**

```
DATABASE_URL=postgresql://user:password@host.postgres.vercel.com:5432/dbname
```

### Étape 4 : Déployez

```bash
git add prisma/schema.prisma
git commit -m "Switch to PostgreSQL for production"
git push origin main
```

Vercel générera automatiquement le schéma PostgreSQL au déploiement.

---

## Alternative : Garder les deux schemas

Si vous voulez garder MySQL en local ET PostgreSQL en prod, vous pouvez :

### 1. Créer un script de migration

**scripts/switch-db.sh**

```bash
#!/bin/bash

if [ "$NODE_ENV" = "production" ]; then
  # PostgreSQL for production
  cp prisma/schema.postgresql.prisma prisma/schema.prisma
else
  # MySQL for local development
  cp prisma/schema.mysql.prisma prisma/schema.prisma
fi
```

### 2. Configurer dans package.json

```json
{
  "scripts": {
    "postinstall": "node scripts/switch-db.js && prisma generate"
  }
}
```

---

## Avantages de cette approche

✅ **Pas de changement de code** - Les modèles sont identiques
✅ **Pas de migration manuelle** - Prisma gère tout
✅ **Compatibilité totale** - Les types génériques fonctionnent partout
✅ **Facile à basculer** - Un seul changement dans schema.prisma

---

## Données existantes

Si vous avez des données MySQL que vous voulez migrer :

### Option 1 : Export/Import SQL

```bash
# Exporter de MySQL
mysqldump -u user -p database > backup.sql

# Importer dans PostgreSQL
psql -U user -d database -f backup.sql
```

### Option 2 : Utiliser Prisma (recommandé)

```bash
# Sur la DB MySQL source
npm run db:seed

# Puis migrer le backup vers PostgreSQL
# Les IDs et relations seront préservés
```

---

## Tester localement avec PostgreSQL (optionnel)

Si vous voulez tester PostgreSQL localement :

```bash
# 1. Installer PostgreSQL
# https://www.postgresql.org/download/

# 2. Créer une DB test
createdb midzo_test

# 3. Changer DATABASE_URL temporairement
# DATABASE_URL="postgresql://postgres:password@localhost:5432/midzo_test"

# 4. Générer le client
npm run db:generate

# 5. Exécuter les migrations
npm run db:migrate
```

---

## Questions fréquentes

**Q: Les données seront-elles perdues?**
A: Non, si vous migrez proprement. Utilisez un script de migration.

**Q: Est-ce que mon code doit changer?**
A: Non ! Prisma s'occupe des différences.

**Q: Combien de temps pour migrer?**
A: Quelques minutes. Juste changer le provider et redéployer.

**Q: Puis-je revenir à MySQL?**
A: Oui, simplement changer le provider back à "mysql" et redéployer.
