# Arbres de décision — API Midzo

Ce document décrit **ce qui est implémenté** dans `app/api/**` et le **flux de décision** de chaque route (méthode, validation, auth, réponse).

> **Stack** : Next.js 15 App Router → `route.ts` → `src/models/*` → Prisma → PostgreSQL  
> **Préfixe** : toutes les routes sont sous `/api/...`  
> **CORS** : `OPTIONS` + en-têtes `Access-Control-Allow-Origin: *` sur la plupart des routes

---

## 1. Arbre global (quel chemin appeler ?)

```mermaid
flowchart TD
  START([Requête HTTP]) --> PREF{Chemin commence par ?}

  PREF -->|/api/health| H[Health]
  PREF -->|/api/auth/*| A[Auth]
  PREF -->|/api/categories/*| C[Catégories & services]
  PREF -->|/api/countries/*| CO[Pays]
  PREF -->|/api/universities/*| U[Universités]

  H --> H_GET[GET → DB ping]

  A --> A_REG[POST register]
  A --> A_VER[POST verify-email]
  A --> A_RES[POST resend-verification]
  A --> A_LOG[POST login]
  A --> A_PRO[GET/PUT profile]

  C --> C_LIST[GET /categories]
  C --> C_ID[GET /categories/:id]
  C --> C_SVC[GET /categories/:id/services]
  C --> C_ALL[GET /categories/services/all]

  CO --> CO_LIST[GET /countries]
  CO --> CO_NAME[GET /countries/:name]
  CO --> CO_ID[GET /countries/id/:id]

  U --> U_ROOT[GET/POST /universities]
  U --> U_SEARCH[GET /universities/search]
  U --> U_META[GET countries / cities / programs / regions]
  U --> U_ID[GET/PUT/DELETE /universities/:id]
  U --> U_PROG[POST /universities/:id/programs]
```

---

## 2. Légende

| Symbole | Signification |
|--------|----------------|
| ✅ | Implémenté (route handler existant) |
| 🔓 | Public (pas de JWT) |
| 🔐 | JWT requis (`Authorization: Bearer <token>`) |
| ❌ | Non implémenté (modèle Prisma seulement ou absent) |

**Format de réponse habituel**

- Succès auth / universités : `{ success: true, ... }`
- Succès catégories / pays : `{ success: true, categories \| country \| services, ... }`
- Erreur : `{ success: false, error: "..." }` ou `{ error: "..." }` selon la route
- Health : `{ status, timestamp, database }`

---

## 3. Inventaire complet (implémenté vs non)

| Domaine | Route | Méthode | Auth | Statut | Modèle / fichier |
|---------|-------|---------|------|--------|------------------|
| Santé | `/api/health` | GET | 🔓 | ✅ | `lib/prisma` |
| Auth | `/api/auth/register` | POST | 🔓 | ✅ | `UserModel`, `lib/email` |
| Auth | `/api/auth/verify-email` | POST | 🔓 | ✅ | `UserModel`, `lib/auth` |
| Auth | `/api/auth/resend-verification` | POST | 🔓 | ✅ | `UserModel`, `lib/email` |
| Auth | `/api/auth/login` | POST | 🔓 | ✅ | `UserModel`, `lib/auth` |
| Auth | `/api/auth/profile` | GET, PUT | 🔐 | ✅ | `authenticateRequest`, `UserModel` |
| Catégories | `/api/categories` | GET | 🔓 | ✅ | `CategoryModel` |
| Catégories | `/api/categories/:id` | GET | 🔓 | ✅ | `CategoryModel` |
| Catégories | `/api/categories/:id/services` | GET | 🔓 | ✅ | `CategoryModel` |
| Catégories | `/api/categories/services/all` | GET | 🔓 | ✅ | `CategoryModel` |
| Pays | `/api/countries` | GET | 🔓 | ✅ | `CountryModel` |
| Pays | `/api/countries/:name` | GET | 🔓 | ✅ | `CountryModel` (détails + relations) |
| Pays | `/api/countries/id/:id` | GET | 🔓 | ✅ | `CountryModel` (sans relations) |
| Universités | `/api/universities` | GET, POST | 🔓 | ✅ | `UniversityModel` |
| Universités | `/api/universities/search` | GET | 🔓 | ✅ | `UniversityModel` + pagination mémoire |
| Universités | `/api/universities/:id` | GET, PUT, DELETE | 🔓 | ✅ | `UniversityModel` |
| Universités | `/api/universities/:id/programs` | POST | 🔓 | ✅ | `UniversityModel.addProgram` |
| Universités | `/api/universities/countries` | GET | 🔓 | ✅ | `UniversityModel.getCountries` |
| Universités | `/api/universities/cities/:country` | GET | 🔓 | ✅ | `UniversityModel.getCitiesByCountry` |
| Universités | `/api/universities/programs` | GET | 🔓 | ✅ | `UniversityModel.getPrograms` |
| Universités | `/api/universities/regions` | GET | 🔓 | ✅ | Liste statique `["Europe"]` |
| **Réservations** | `/api/bookings` ou similaire | — | — | ❌ | `UserBooking` en schéma, pas de route |
| **Actualités** | `/api/news` ou similaire | — | — | ❌ | `News` en schéma, pas de route |
| Catégories | CRUD POST/PUT/DELETE | — | — | ❌ | Lecture seule |
| Pays | CRUD POST/PUT/DELETE | — | — | ❌ | Lecture seule |

Toutes les routes listées ✅ exposent aussi **`OPTIONS`** pour le preflight CORS.

---

## 4. Auth — arbres de décision

### 4.1 `POST /api/auth/register`

```mermaid
flowchart TD
  R([POST /api/auth/register]) --> B[Parse JSON body]
  B --> E1{email présent ?}
  E1 -->|non| E400a[400 email required]
  E1 -->|oui| E2{password présent ?}
  E2 -->|non| E400b[400 password required]
  E2 -->|oui| E3{format email valide ?}
  E3 -->|non| E400c[400 invalid email]
  E3 -->|oui| E4{password length >= 6 ?}
  E4 -->|non| E400d[400 password too short]
  E4 -->|oui| E5{email déjà en DB ?}
  E5 -->|oui| E400e[400 email exists]
  E5 -->|non| U1[username = body.username OU dérivé de email]
  U1 --> E6{username existe ?}
  E6 -->|oui| E400f[400 username exists]
  E6 -->|non| C[UserModel.create — bcrypt password]
  C --> CODE[UserModel.createVerificationCode — code 6 chiffres hashé, expiry 15 min]
  CODE --> MAIL{EMAIL_USER + EMAIL_PASS configurés ?}
  MAIL -->|non| LOG[Log code en console DEV]
  MAIL -->|oui| SEND[sendVerificationEmail]
  LOG --> OK[201 success true]
  SEND --> OK
  SEND -.->|échec SMTP| OK
```

**Implémenté** : inscription + envoi code (ou log dev). **Pas de JWT** à l’inscription.

---

### 4.2 `POST /api/auth/verify-email`

```mermaid
flowchart TD
  V([POST /api/auth/verify-email]) --> B[body: email, code]
  B --> E1{email et code ?}
  E1 -->|non| E400[400 required]
  E1 -->|oui| VM[UserModel.verifyEmail]
  VM --> R{result.success ?}
  R -->|non| MAP[404 user / 400 already verified / invalid / expired]
  R -->|oui| JWT[generateToken user.id]
  JWT --> OK[200 success + token + user]
```

---

### 4.3 `POST /api/auth/resend-verification`

```mermaid
flowchart TD
  R([POST /api/auth/resend-verification]) --> B[body: email]
  B --> E1{email ?}
  E1 -->|non| E400[400]
  E1 -->|oui| CAN[UserModel.canResendCode]
  CAN --> A{allowed ?}
  A -->|non| E[404 / 400 / 429 too many requests]
  A -->|oui| NEW[createVerificationCode + email]
  NEW --> OK[200 success true]
```

Délai minimum entre deux envois : **60 secondes**.

---

### 4.4 `POST /api/auth/login`

```mermaid
flowchart TD
  L([POST /api/auth/login]) --> B[body: username, password]
  B --> E1{username et password ?}
  E1 -->|non| E400[400]
  E1 -->|oui| VAL[UserModel.validatePassword]
  VAL --> U{user trouvé et password OK ?}
  U -->|non| E401[401 invalid credentials]
  U -->|oui| EV{emailVerified ?}
  EV -->|non| E403[403 email not verified]
  EV -->|oui| JWT[generateToken]
  JWT --> OK[200 token + user]
```

---

### 4.5 `GET` / `PUT /api/auth/profile`

```mermaid
flowchart TD
  P([GET ou PUT /api/auth/profile]) --> AUTH[authenticateRequest — Bearer JWT]
  AUTH --> T{token valide ?}
  T -->|non| E401[401 Unauthorized]
  T -->|oui| GET_PUT{méthode ?}

  GET_PUT -->|GET| FIND[UserModel.findById]
  FIND --> F{user ?}
  F -->|non| E404[404]
  F -->|oui| OKG[200 success + user]

  GET_PUT -->|PUT| BODY[body: first_name, last_name, email, phone]
  BODY --> UPD[UserModel.update]
  UPD --> U{updated ?}
  U -->|non| E404b[404]
  U -->|oui| OKP[200 success + user]
```

---

## 5. Catégories & services — lecture seule

### 5.1 `GET /api/categories`

```mermaid
flowchart TD
  G([GET /api/categories]) --> M[CategoryModel.findAll]
  M --> OK[200 success + categories]
  M -.->|erreur| E500[500]
```

### 5.2 `GET /api/categories/:id`

```mermaid
flowchart TD
  G([GET /api/categories/:id]) --> M[CategoryModel.findById]
  M --> F{trouvé ?}
  F -->|non| E404[404 Category not found]
  F -->|oui| OK[200 success + category]
```

### 5.3 `GET /api/categories/:id/services`

```mermaid
flowchart TD
  G([GET .../services]) --> C[findById — catégorie existe ?]
  C -->|non| E404[404]
  C -->|oui| S[findServicesbyCategory]
  S --> OK[200 category + services]
```

### 5.4 `GET /api/categories/services/all`

```mermaid
flowchart TD
  G([GET .../services/all]) --> A[findAllServices]
  A --> GRP[reduce → servicesByCategory]
  GRP --> OK[200 services + servicesByCategory]
```

**IDs catégories connus (seed)** : `study`, `professional`, `tourism`, `business`.

---

## 6. Pays — lecture seule

### 6.1 `GET /api/countries`

Liste tous les pays (sans sous-détails).

### 6.2 `GET /api/countries/:name`

```mermaid
flowchart TD
  G([GET /api/countries/:name]) --> DEC[decodeURIComponent name]
  DEC --> M[CountryModel.findByName + include]
  M --> F{trouvé ?}
  F -->|non| E404[404]
  F -->|oui| OK[200 country + quickFacts + traditions + cuisine + places + trends]
```

### 6.3 `GET /api/countries/id/:id`

Même chose mais **par ID numérique**, **sans** les relations incluses (`findById` seulement).

---

## 7. Universités — CRUD partiel + filtres

### 7.1 `GET /api/universities`

**Query params** (tous optionnels) :

| Param | Map vers filtre |
|-------|-----------------|
| `country` | `filters.country` (contains) |
| `region` | `filters.region` → liste pays Europe si pas de `country` |
| `city` | `filters.city` (contains) |
| `program` | `filters.programName` |
| `level` | `filters.programLevel` (equals) |
| `search` | nom ou specialty (contains) |

```mermaid
flowchart TD
  G([GET /api/universities]) --> Q[Parse searchParams]
  Q --> F[UniversityModel.findAll filters]
  F --> OK[200 data + count]
```

### 7.2 `GET /api/universities/search`

Identique aux filtres de `GET /universities`, puis **pagination en mémoire** :

- `limit` (défaut 50), `offset` (défaut 0)
- Réponse : `data`, `pagination.total`, `hasMore`

### 7.3 `POST /api/universities`

```mermaid
flowchart TD
  P([POST /api/universities]) --> B[name, city, country requis]
  B --> V{valid ?}
  V -->|non| E400[400]
  V -->|oui| C[UniversityModel.create]
  C --> DUP{nom déjà existant ?}
  DUP -->|oui| E409[409]
  DUP -->|non| OK[201 data university]
```

### 7.4 `GET / PUT / DELETE /api/universities/:id`

```mermaid
flowchart TD
  ID([/api/universities/:id]) --> PARSE{id numérique ?}
  PARSE -->|non| E400[400 Invalid ID]

  PARSE -->|GET| GET[findById + programs]
  GET --> F1{existe ?}
  F1 -->|non| E404
  F1 -->|oui| OK1[200]

  PARSE -->|PUT| PUT[body partiel → update]
  PUT --> F2{existe ?}
  F2 -->|non| E404
  F2 -->|oui| OK2[200]

  PARSE -->|DELETE| DEL[delete]
  DEL --> F3{supprimé ?}
  F3 -->|non| E404
  F3 -->|oui| OK3[200 message]
```

### 7.5 `POST /api/universities/:id/programs`

Body : `name`, `level` (ex. `Bachelor`, `Master`) → `UniversityModel.addProgram`. Conflit unique → **409**.

### 7.6 Routes utilitaires universités

| Route | Comportement |
|-------|----------------|
| `GET /universities/countries` | Liste distincte des `country` en DB |
| `GET /universities/cities/:country` | Villes pour un pays (equals) |
| `GET /universities/programs` | Programmes distincts + regroupement `grouped` |
| `GET /universities/regions` | **Statique** : `["Europe"]` |

**Région `europe` dans `UniversityModel`** : France, Germany, Netherlands, Italy, Belgium, Luxembourg, Estonia.

---

## 8. Santé

### `GET /api/health`

```mermaid
flowchart TD
  H([GET /api/health]) --> Q[prisma.$queryRaw SELECT 1]
  Q --> OK{OK ?}
  OK -->|oui| H200[200 healthy + database connected]
  OK -->|non| H503[503 unhealthy + error message]
```

---

## 9. Flux utilisateur typique (frontend)

```mermaid
sequenceDiagram
  participant F as Frontend
  participant API as API Midzo
  participant DB as PostgreSQL

  Note over F,DB: Inscription
  F->>API: POST /auth/register
  API->>DB: create user (emailVerified=false)
  API->>F: 201 success

  F->>API: POST /auth/verify-email {email, code}
  API->>DB: mark verified
  API->>F: 200 + JWT

  Note over F,DB: Ou connexion
  F->>API: POST /auth/login
  API->>F: 200 + JWT

  Note over F,DB: Données app
  F->>API: GET /categories (public)
  F->>API: GET /countries/France (public)
  F->>API: GET /universities/search?country=Germany (public)

  Note over F,DB: Profil
  F->>API: GET /auth/profile (Bearer JWT)
  API->>F: 200 user
```

---

## 10. Modèles Prisma sans API (candidats features)

```mermaid
flowchart LR
  subgraph Implémenté
    User
    Category
    Service
    Country
    University
    UniversityProgram
  end

  subgraph Schéma seulement
    News
    UserBooking
  end

  User --> UserBooking
  Service --> UserBooking
```

Pour ajouter une feature sur `UserBooking` ou `News`, le chemin standard sera :

1. `prisma/schema.prisma` (si changement schéma)
2. `src/models/Booking.ts` ou `News.ts`
3. `app/api/bookings/route.ts` (etc.)
4. Protéger avec `authenticateRequest` si données utilisateur

---

## 11. Fichiers source par route

| Route | Fichier handler |
|-------|-----------------|
| `/api/health` | `app/api/health/route.ts` |
| `/api/auth/*` | `app/api/auth/*/route.ts` |
| `/api/categories/*` | `app/api/categories/**/route.ts` |
| `/api/countries/*` | `app/api/countries/**/route.ts` |
| `/api/universities/*` | `app/api/universities/**/route.ts` |

**Couche métier** : `src/models/User.ts`, `Category.ts`, `Country.ts`, `University.ts`  
**Infra** : `lib/prisma.ts`, `lib/auth.ts`, `lib/email.ts`  
**Middleware** : `middleware.ts` (OPTIONS sur `/api/:path*`)

---

*Dernière mise à jour : aligné sur le code du dépôt `midzobackend`.*
