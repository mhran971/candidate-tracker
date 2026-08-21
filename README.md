# Candidate Tracker 🎯

A modern full-stack Recruitment & Candidate Tracking system built with TypeScript, React 18, Fastify 4, Prisma ORM, and PostgreSQL.

---

## 🏗️ Architecture & Monorepo Structure

```
candidate-tracker/
├── apps/
│   ├── api/          # Fastify 4 backend with Type-Provider-Zod & Prisma
│   └── web/          # React 18 + Vite frontend with TanStack Query & shadcn/ui
├── packages/
│   └── shared/       # Single source of truth: Zod schemas & inferred TypeScript types
├── docker-compose.yml # PostgreSQL 15 container
└── README.md
```

---

## 🧠 Key Architectural Decisions & Engineering Log

> *This section is maintained continuously as decisions are made to document rationale, trade-offs, and technical choices.*

### Decision 1: Single Source of Truth via `@candidate-tracker/shared`
- **Choice**: Centralized Zod schemas in `packages/shared` consumed by both Fastify backend routes and React frontend forms/hooks.
- **Rationale**: Guarantees zero schema drift between API validation and client form handling. Types are inferred using `z.infer` with strict zero-`any` rule.
- **Trade-off**: Requires monorepo workspaces setup, but eliminates duplicated DTO interfaces completely.

### Decision 2: Cross-Entity Search via Server-Side SQL JOIN
- **Choice**: Cross-entity search in `/api/applications` searches across `Application` fields (`job_title`, `company`, `source`, `notes`) and linked `Candidate` fields (`name`, `email`, `location`) using database JOIN with parameterized queries.
- **Rationale**: Efficient database query execution, accurate pagination, and avoids heavy JavaScript array filtering on the server.

### Decision 3: Server-Side Aggregations for Dashboard Metrics
- **Choice**: Dashboard metrics (`totalCandidates`, `totalApplications`, `applicationsByStatus`, `hiredThisMonth`, `rejectionRate`, `weeklyApplications`) computed strictly on PostgreSQL via `COUNT`, `GROUP BY`, and indexed date filters.
- **Rationale**: Minimal payload transfer and high performance regardless of record scale.

### Decision 4: Soft Delete for Candidates with Query Filtering
- **Choice**: Candidates have `deleted_at` timestamp. Queries filter `deleted_at IS NULL` to exclude soft-deleted candidates while preserving historical application relations.

### Decision 5: Schema-First Route Definition with Type Provider
- **Choice**: Used `fastify-type-provider-zod` with route handlers split per operation (`create.ts`, `list.ts`, `get.ts`, `update.ts`, `delete.ts`).
- **Rationale**: Keeps each endpoint modular, isolated, readable, and 100% type-safe from request body/query to response envelope.

---

## 📡 API Endpoints Matrix

### Candidates (`/api/candidates`)
- `POST /api/candidates` — Create candidate (validates email uniqueness, returns 201 / 409)
- `GET /api/candidates` — Paginated list with multi-field search (`name`, `email`, `location`, `phone`)
- `GET /api/candidates/:id` — Candidate profile with all associated applications
- `PATCH /api/candidates/:id` — Update candidate fields with email conflict check
- `DELETE /api/candidates/:id` — Soft-delete candidate (sets `deleted_at`)

### Applications (`/api/applications`)
- `POST /api/applications` — Create application linked to candidate (validates candidate exists, returns 201 / 404)
- `GET /api/applications` — **Cross-Entity Search** via server-side SQL JOIN across `job_title`, `company`, `source`, `notes`, `candidate.name`, `candidate.email`, `candidate.location`, with status and date range filtering
- `GET /api/applications/:id` — Single application with linked candidate details
- `PATCH /api/applications/:id` — Update application with candidate reassignment check
- `DELETE /api/applications/:id` — Hard delete application (returns 200 / 404)

### Dashboard (`/api/dashboard`)
- `GET /api/dashboard` — Aggregated metrics: `totalCandidates`, `totalApplications`, `applicationsByStatus`, `hiredThisMonth`, `rejectionRate`, `latestApplications`, `weeklyApplications` (8-week trend)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ or 20+
- Docker & Docker Compose (for PostgreSQL)

### 2. Quick Setup Commands
```bash
# 1. Install all dependencies across workspaces
npm install

# 2. Start PostgreSQL container
docker compose up -d

# 3. Apply database migrations and seed initial dataset
npm run db:migrate
npm run db:seed

# 4. Start Fastify API (port 3001)
npm run dev:api

# 5. Start Vite Frontend (port 5173)
npm run dev:web

# 6. Run all test suites
npm test
```

---

## 🧪 Testing Strategy
- **API Route Tests**: Vitest with Fastify `inject()` for testing HTTP status codes (201, 200, 400, 404, 409) without spawning network sockets.
- **Schema Unit Tests**: Validating shared Zod schemas against edge cases, valid inputs, and malformed payloads.

---

## 🚢 Deployment (Vercel & Docker)
- **Frontend**: Ready for deployment on **Vercel** / **Netlify** with standard Vite SPA routing.
- **Backend API**: Containerized with Dockerfile or deployable to Railway / Render / Fly.io with PostgreSQL.
