# 🌱 Guide pour remplir la base de données

## Problème
Après le déploiement sur Vercel, la base de données est vide (pas de tables ni de données).

## Solution
Tu dois exécuter 2 commandes :

### 1️⃣ Créer les tables (migrations)

```bash
npx prisma migrate deploy
```

Cela crée toutes les tables dans PostgreSQL sur Vercel.

### 2️⃣ Remplir les données (seed)

```bash
npm run db:seed
```

Cela ajoute les données de test (utilisateurs, pays, universités, etc.).

---

## Exécuter depuis Vercel

### Option 1 : Via la CLI Vercel

```bash
# Se connecter à Vercel
vercel env pull

# Exécuter les migrations et seed
npx prisma migrate deploy
npm run db:seed
```

### Option 2 : Via le dashboard Vercel

1. Allez à **Settings → Buildpacks**
2. Ajoutez un custom buildpack qui exécute les migrations
3. Ou créez un endpoint API pour déclencher le seed

---

## Scripts disponibles

| Command | What it does |
|---------|-------------|
| `npm run db:seed` | Seed complet (utilisateurs, pays, universités, etc.) |
| `npm run db:seed src/scripts/seed-european-universities.ts` | Seed uniquement universités européennes |
| `npx prisma migrate deploy` | Créer les tables (migrations) |
| `npx prisma db execute --stdin` | Exécuter du SQL custom |

---

## Structure du seed

Le seed principal (`seed.ts`) ajoute :

### Users
- Username: `midzo`
- Password: `midzolo`
- Email: `midzo@example.com`

### Categories (Services)
- Flights
- Hotels
- Tours
- Restaurants
- etc.

### Countries (4)
- France (7 universités)
- Italy (6 universités)
- Belgium (4 universités)
- Luxembourg (1 université)

### Universities (26)
- Avec programmes Bachelor/Master
- Avec URLs et détails complets

### Countries Details
- Quick facts
- Traditions
- Cuisine
- Famous places
- Latest trends

---

## Après le seed

Teste qu'les données sont présentes :

```bash
# Vérifier les utilisateurs
curl https://votre-domain.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"midzo","password":"midzolo"}'

# Vérifier les catégories
curl https://votre-domain.vercel.app/api/categories

# Vérifier les pays
curl https://votre-domain.vercel.app/api/countries

# Vérifier les universités
curl https://votre-domain.vercel.app/api/universities
```

---

## Ajouter des données manuelles

Tu peux aussi ajouter des données via l'API :

```bash
# Créer une nouvelle université
curl -X POST https://votre-domain.vercel.app/api/universities \
  -H "Content-Type: application/json" \
  -d '{
    "name": "University of Oxford",
    "city": "Oxford",
    "country": "United Kingdom",
    "website": "https://www.ox.ac.uk",
    "specialty": "Higher Education"
  }'
```

---

## Utiliser Prisma Studio

Pour explorer/modifier les données visuellement :

```bash
npx prisma studio
```

Cela ouvre une UI à `http://localhost:5555` où tu peux :
- Voir toutes les tables
- Ajouter/modifier/supprimer des données
- Exécuter des requêtes SQL

**Note** : Prisma Studio ne fonctionne qu'en local, pas sur Vercel.

---

## Reset complet (Attention ⚠️)

Si tu veux repartir de zéro :

```bash
# Supprimer TOUTES les données
npx prisma migrate reset

# Cela va :
# 1. Supprimer la DB
# 2. Recréer les tables
# 3. Exécuter le seed automatiquement
```

**⚠️ Cette commande est DESTRUCTIVE - toutes les données seront perdues !**

---

## Checklist

- [ ] `npx prisma migrate deploy` exécuté
- [ ] `npm run db:seed` exécuté
- [ ] Health check répond : `/api/health`
- [ ] Catégories chargées : `/api/categories`
- [ ] Pays chargés : `/api/countries`
- [ ] Universités chargées : `/api/universities`

---

**C'est tout ! Votre DB est remplie.** 🎉
