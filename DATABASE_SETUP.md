# Database Configuration Guide

Ce projet est configuré pour utiliser **MySQL en local** et **PostgreSQL sur Vercel**.

## Configuration locale (MySQL)

### Variables d'environnement (.env)

```env
DATABASE_URL="mysql://root:password@localhost:3306/midzo"
DATABASE_PROVIDER="mysql"
```

### Étapes de démarrage

```bash
# 1. Installer les dépendances
npm install

# 2. Générer le client Prisma
npm run db:generate

# 3. Exécuter les migrations
npm run db:migrate

# 4. (Optionnel) Remplir la base de données
npm run db:seed

# 5. Lancer le serveur
npm run dev
```

---

## Configuration Vercel (PostgreSQL)

### Variables d'environnement sur Vercel

Dans le dashboard Vercel, configurer :

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
DATABASE_PROVIDER="postgresql"
NODE_ENV="production"
JWT_SECRET="your_secret_key"
JWT_EXPIRES_IN="24h"
```

### Déploiement

1. Push le code vers GitHub
2. Connectez à Vercel et sélectionnez le repo
3. Vercel détecte automatiquement Next.js
4. Ajouter les variables d'environnement dans **Project Settings → Environment Variables**
5. Déployer !

---

## Differences MySQL vs PostgreSQL dans Prisma

Grâce à la configuration actuelle :

- ✅ **Pas de modification du code** nécessaire
- ✅ **Pas de migration de schéma** requise
- ✅ **Les types génériques** fonctionnent avec les deux

### Détails techniques

- Les `@db.VarChar()` et `@db.Text` ont été supprimés
- Prisma utilise les types génériques (`String`, `Int`, etc.)
- Le provider est défini par `DATABASE_PROVIDER` en variable d'environnement

---

## Passage de MySQL à PostgreSQL

Si vous avez besoin de migrer les données :

```bash
# Exporter les données MySQL
mysqldump -u user -p dbname > backup.sql

# Importer dans PostgreSQL
psql -U user -d dbname -f backup.sql
```

Sinon, avec Prisma, simplement :
1. Changer `DATABASE_URL` vers PostgreSQL
2. Changer `DATABASE_PROVIDER` à `"postgresql"`
3. Relancer les migrations : `npm run db:migrate`

---

## Vérifier la configuration

```bash
# Voir le provider actuel
echo $DATABASE_PROVIDER

# Tester la connexion
npx prisma db execute --stdin < /dev/null
```
