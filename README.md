# Midzo Backend

Backend API pour l'application Midzo - Companion de voyage global avec Prisma ORM.

## Configuration

### Prérequis
- Node.js 18+
- MySQL 8.0+
- TypeScript

### Installation

1. Installer les dépendances :
```bash
npm install
```

2. Configurer la base de données :
```bash
# Copier le fichier d'exemple
cp .env.example .env

# Modifier .env avec vos paramètres MySQL
DATABASE_URL="mysql://utilisateur:mot_de_passe@localhost:3306/midzo_db"
JWT_SECRET=votre_clé_secrète
```

3. Générer le client Prisma :
```bash
npm run db:generate
```

4. Créer et migrer la base de données :
```bash
npm run db:migrate
```

5. Peupler avec des données d'exemple :
```bash
npm run db:seed
```

## Démarrage

### Mode développement
```bash
npm run dev
```

### Mode production
```bash
npm run build
npm start
```

## Scripts Prisma

- `npm run db:generate` - Générer le client Prisma
- `npm run db:migrate` - Appliquer les migrations
- `npm run db:seed` - Peupler la base de données
- `npm run db:studio` - Interface graphique Prisma Studio

## API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/auth/register` - Inscription utilisateur
- `GET /api/auth/profile` - Profil utilisateur (authentifié)
- `PUT /api/auth/profile` - Mise à jour profil (authentifié)

### Catégories et Services
- `GET /api/categories` - Liste des catégories
- `GET /api/categories/:id` - Détails d'une catégorie
- `GET /api/categories/:id/services` - Services d'une catégorie
- `GET /api/categories/services/all` - Tous les services

### Pays
- `GET /api/countries` - Liste des pays
- `GET /api/countries/:name` - Détails complets d'un pays
- `GET /api/countries/id/:id` - Pays par ID

### Santé
- `GET /health` - Vérification du serveur

## Prisma Schema

### Modèles principaux
- `User` - Utilisateurs avec authentification JWT
- `Category` - Catégories de services
- `Service` - Services par catégorie
- `Country` - Informations pays avec relations
- `CountryQuickFact`, `CountryTradition`, `CountryCuisine`, `CountryPlace`, `CountryTrend` - Détails pays
- `UserBooking` - Réservations utilisateurs

### Utilisateur par défaut
- **Username:** midzo
- **Password:** midzolo

## Technologies utilisées
- **Prisma ORM** - Base de données et migrations
- **Express.js** - Framework web
- **TypeScript** - Langage
- **MySQL** - Base de données
- **JWT** - Authentification
- **bcrypt** - Chiffrement des mots de passe
- **CORS** - Gestion des origines croisées

## Prisma Studio
Accédez à l'interface graphique pour visualiser et gérer vos données :
```bash
npm run db:studio
```

Interface disponible sur : http://localhost:5555