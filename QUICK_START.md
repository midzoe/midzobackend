# ⚡ Quick Start Guide

## Mode développement local (MySQL)

```bash
npm install && npm run dev
```

Voilà ! Le serveur s'exécute à http://localhost:3000

## Mode production (PostgreSQL sur Vercel)

```bash
git push origin main
```

Vercel se charge du reste automatiquement.

---

## Endpoints disponibles

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/auth/profile` - Get profile (needs token)
- `PUT /api/auth/profile` - Update profile (needs token)

### Categories
- `GET /api/categories` - List all
- `GET /api/categories/[id]` - Get by ID
- `GET /api/categories/[id]/services` - Get services
- `GET /api/categories/services/all` - All services

### Countries
- `GET /api/countries` - List all
- `GET /api/countries/[name]` - Get by name
- `GET /api/countries/id/[id]` - Get by ID

### Universities
- `GET /api/universities` - List all
- `GET /api/universities/search` - Search
- `GET /api/universities/[id]` - Get by ID
- `GET /api/universities/countries` - List countries
- `GET /api/universities/programs` - List programs
- `POST /api/universities` - Create new
- `PUT /api/universities/[id]` - Update
- `DELETE /api/universities/[id]` - Delete

---

## Changer de base de données

### MySQL (local)
```bash
cp prisma/schema.mysql.prisma prisma/schema.prisma
npm run db:generate
```

### PostgreSQL (production)
```bash
cp prisma/schema.postgresql.prisma prisma/schema.prisma
npm run db:generate
```

---

## Variables d'environnement

```env
# Database
DATABASE_URL=...
DATABASE_PROVIDER=mysql|postgresql

# Server
PORT=3001
NODE_ENV=development|production

# Auth
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24h

# CORS
FRONTEND_URL=...
```

---

## Commands

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server
npm run db:migrate       # Run migrations
npm run db:seed          # Seed database
npm run db:generate      # Generate Prisma client
npm run db:studio        # Open Prisma Studio
```

---

## C'est tout ! 🎉

L'application est prête à développer et déployer.
