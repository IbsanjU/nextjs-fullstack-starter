# Next.js Fullstack Starter

A production-ready Next.js fullstack starter template with **centralized configuration**, Docker support, and zero-config Vercel deployment.

## 🌟 Key Features

- ✅ **Single Config Module** - All environment variables managed in one place (`src/config/`)
- ✅ **Next.js 14+ App Router** - Latest Next.js with TypeScript
- ✅ **Prisma ORM** - Type-safe database access with PostgreSQL
- ✅ **Docker Ready** - Local development with Docker Compose
- ✅ **Vercel Ready** - Deploy with zero code changes
- ✅ **Repository Pattern** - Clean architecture with services and repositories
- ✅ **Tailwind CSS** - Utility-first CSS framework
- ✅ **Vitest** - Fast unit testing
- ✅ **TypeScript Strict** - Full type safety
- ✅ **Prettier + ESLint** - Code formatting and linting

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose (for local database)
- npm or yarn

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd nextjs-fullstack-starter
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local` with your settings (defaults work for local development).

### 3. Start Database

```bash
# Start PostgreSQL in Docker
npm run docker:up

# Wait a few seconds for database to be ready
# Then run migrations
npm run db:migrate

# Optional: Seed with sample data
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 📁 Project Structure

```
.
├── app/                      # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── api/
│       ├── health/route.ts   # Health check endpoint
│       └── users/route.ts    # User CRUD endpoints
├── src/
│   ├── config/               # ⭐ SINGLE SOURCE OF TRUTH
│   │   ├── index.ts         # Config module (exports config object)
│   │   └── schema.ts        # Zod validation schema
│   ├── modules/
│   │   └── users/           # User domain module
│   │       ├── user.types.ts
│   │       ├── user.repository.ts
│   │       └── user.service.ts
│   ├── lib/
│   │   └── prisma.ts        # Prisma client singleton
│   ├── services/
│   │   └── logger.ts        # Centralized logger
│   └── types/
│       └── api.ts           # Shared API types
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Database seeding
├── docker/
│   └── postgres/
│       └── init.sql         # Database initialization
├── docker-compose.yml        # Docker services
├── Dockerfile               # Production Docker image
├── .env.example             # Environment template
└── README.md
```

## ⚙️ Configuration System

### The Single Config Rule

**All configuration is centralized in `src/config/`**. This is the **ONLY** place that reads `process.env`.

```typescript
// ✅ CORRECT - Import config
import config, { isProd, dbEnabled } from '@/config'

if (isProd) {
  // production logic
}

// ❌ WRONG - Never read process.env directly
if (process.env.NODE_ENV === 'production') {
  // ...
}
```

### Environment Variables

| Variable              | Values                                          | Default                 | Description             |
| --------------------- | ----------------------------------------------- | ----------------------- | ----------------------- |
| `APP_ENV`             | `local`, `development`, `staging`, `production` | `local`                 | Application environment |
| `NEXT_PUBLIC_APP_URL` | URL string                                      | `http://localhost:3000` | Public app URL          |
| `LOG_LEVEL`           | `debug`, `info`, `warn`, `error`                | `info`                  | Logging verbosity       |
| `ENABLE_DB`           | `true`, `false`                                 | `true`                  | Enable/disable database |
| `LOCAL_DB`            | `true`, `false`                                 | `true`                  | Use local vs remote DB  |
| `DATABASE_URL`        | PostgreSQL connection string                    | See `.env.example`      | Database connection     |

### Config Helpers

```typescript
import { isProd, isDev, dbEnabled, canUseDatabase } from '@/config'

// Environment checks
isProd // APP_ENV === 'production'
isDev // APP_ENV === 'local' or 'development'

// Database checks
dbEnabled // ENABLE_DB === true
canUseDatabase() // Node runtime + DB enabled
```

## 🗄️ Database

### Local Development (Docker)

```bash
# Start PostgreSQL
npm run docker:up

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Open Prisma Studio
npm run db:studio

# Stop database
npm run docker:down
```

**.env.local:**

```env
ENABLE_DB=true
LOCAL_DB=true
DATABASE_URL=postgresql://app:app@localhost:5432/app?schema=public
```

### Remote Database (Neon, Supabase, etc.)

1. Create a PostgreSQL database on your provider
2. Update `.env.local`:

```env
ENABLE_DB=true
LOCAL_DB=false
DATABASE_URL=postgresql://user:password@host.region.provider.com:5432/dbname?sslmode=require
```

3. Run migrations:

```bash
npm run db:migrate:deploy
```

### Database Modes

The app supports running **without a database** for testing:

```env
ENABLE_DB=false
```

Routes will return mock data instead of querying the database.

## 🐳 Docker

### Development (Database Only)

**Recommended**: Run only PostgreSQL in Docker, Next.js on host

```bash
npm run docker:up    # Start PostgreSQL
npm run dev          # Run Next.js on host
```

### Full Stack in Docker

Run both database and app in Docker:

```bash
npm run docker:app
```

The app will be available at `http://localhost:3000`.

## 📦 API Endpoints

### Health Check

```bash
GET /api/health
```

Response:

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "environment": "local",
    "database": {
      "enabled": true,
      "canConnect": true
    }
  }
}
```

### Users

```bash
# Get all users
GET /api/users

# Create user
POST /api/users
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe"
}
```

## 🚀 Vercel Deployment

### 1. Push to GitHub

```bash
git push origin main
```

### 2. Import to Vercel

1. Go to [Vercel](https://vercel.com)
2. Import your repository
3. Add environment variables

### 3. Configure Environment Variables

In Vercel dashboard, add:

```env
# Required
APP_ENV=production
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Optional (defaults work)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
LOG_LEVEL=info
ENABLE_DB=true
LOCAL_DB=false
```

### 4. Deploy

Vercel will automatically:

- Install dependencies
- Generate Prisma Client (`prisma generate` in build step)
- Build Next.js
- Deploy

### Prisma + Vercel Pitfalls

✅ **Solution implemented in this starter:**

1. **Build Command**: `prisma generate` is included in the `build` script
2. **Output Mode**: `next.config.js` uses `output: 'standalone'` for Docker
3. **Runtime**: Database routes use `export const runtime = 'nodejs'`
4. **External Packages**: Prisma packages are externalized in `next.config.js`

## 🧪 Testing

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run
```

Tests are located alongside source files (e.g., `user.service.test.ts`).

## 📝 Scripts Reference

| Script                      | Description                    |
| --------------------------- | ------------------------------ |
| `npm run dev`               | Start development server       |
| `npm run build`             | Build for production           |
| `npm start`                 | Start production server        |
| `npm run lint`              | Run ESLint                     |
| `npm run format`            | Format code with Prettier      |
| `npm test`                  | Run tests in watch mode        |
| `npm run db:generate`       | Generate Prisma Client         |
| `npm run db:migrate`        | Run database migrations (dev)  |
| `npm run db:migrate:deploy` | Run migrations (production)    |
| `npm run db:seed`           | Seed database with sample data |
| `npm run db:studio`         | Open Prisma Studio             |
| `npm run docker:up`         | Start PostgreSQL in Docker     |
| `npm run docker:down`       | Stop Docker services           |
| `npm run docker:app`        | Run full stack in Docker       |

## 🎨 Code Style

This project uses:

- **Prettier** - Code formatting
- **ESLint** - Linting
- **TypeScript Strict** - Type safety

Format code:

```bash
npm run format
```

## 🏗️ Architecture

### Layered Architecture

```
Route Handler → Service → Repository → Database
```

- **Route Handlers** (`app/api/*/route.ts`): Handle HTTP requests/responses
- **Services** (`src/modules/*/service.ts`): Business logic
- **Repositories** (`src/modules/*/repository.ts`): Data access
- **Types** (`src/modules/*/types.ts`): Domain types

### Why This Structure?

1. **Separation of Concerns** - Each layer has a single responsibility
2. **Testability** - Easy to mock dependencies
3. **Maintainability** - Changes are isolated
4. **Type Safety** - End-to-end TypeScript

## 🔒 Runtime Safety

Routes that use the database must specify Node.js runtime:

```typescript
// app/api/users/route.ts
export const runtime = 'nodejs' // Required for Prisma

export async function GET() {
  // Safe to use Prisma here
}
```

Edge runtime routes cannot use Prisma.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

MIT

## 🙋 Support

For issues and questions, please open an issue on GitHub.

---

**Made with ❤️ using Next.js, Prisma, and TypeScript**
