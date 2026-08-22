# Candidate Tracker 🎯

A high-performance, full-stack Recruitment & Candidate Tracking platform built with TypeScript, React 18, Fastify 4, Prisma ORM, and PostgreSQL.

🌐 **Live Production Deployment**: [https://reliable-hummingbird-cfb316.netlify.app](https://reliable-hummingbird-cfb316.netlify.app)

---

## 🏗️ Architecture & Monorepo Structure

```
candidate-tracker/
├── apps/
│   ├── api/              # Fastify 4 backend with Type-Provider-Zod & Prisma
│   └── web/              # React 18 + Vite frontend with TanStack Query & Tailwind CSS
├── packages/
│   └── shared/           # Single source of truth: Zod schemas & TypeScript types
├── docker-compose.yml     # Local PostgreSQL 15 container
├── .env.example          # Template for environment variables (Zero secrets in repo)
├── netlify.toml          # Production Netlify configuration
├── vercel.json           # Production Vercel configuration
└── README.md
```

---

## 🚀 Quick Start Guide (Local Development)

### 1. Prerequisites
- **Node.js**: v18+ or v20+
- **Docker & Docker Compose**: (for local PostgreSQL instance)

### 2. Step-by-Step Local Setup

```bash
# 1. Clone repository and install dependencies
git clone https://github.com/mhran971/candidate-tracker.git
cd candidate-tracker
npm install

# 2. Configure Environment Variables
cp .env.example .env

# 3. Start Local PostgreSQL Database via Docker
docker compose up -d

# 4. Generate Prisma Client, Apply Migrations & Seed Sample Data
npm run prisma:generate
npm run db:migrate
npm run db:seed

# 5. Start Both Applications (Backend & Frontend) in Development Mode
npm run dev

# Or start individually:
# npm run dev:api    # Fastify API runs on http://localhost:3001
# npm run dev:web    # React App runs on http://localhost:5173
```

### 3. Verify Local Services
- **Web Application**: Open [http://localhost:5173](http://localhost:5173) in your browser.
- **Fastify API Server**: Accessible on [http://localhost:3001](http://localhost:3001).
- **API Health Check**: [http://localhost:3001/api/health](http://localhost:3001/api/health) -> `{"status":"ok"}`.
- **Prisma Studio**: `npm run db:studio` -> GUI on [http://localhost:5555](http://localhost:5555).

---

## ⚙️ Environment Variables (`.env.example`)

Copy `.env.example` to `.env` before starting the application:

```env
# ==========================================
# 1. DATABASE CONFIGURATION (Prisma ORM)
# ==========================================
# For Local Development (PostgreSQL in Docker):
DATABASE_URL="postgresql://dev:dev@localhost:5432/candidate_tracker"

# ==========================================
# 2. BACKEND / SERVER CONFIGURATION
# ==========================================
NODE_ENV=development
PORT=3001
HOST=0.0.0.0
CORS_ORIGIN=*

# ==========================================
# 3. FRONTEND CONFIGURATION (Vite)
# ==========================================
# In local development, Vite automatically proxies /api to http://localhost:3001
VITE_API_URL=http://localhost:3001
```

> 🔒 **Security Notice**: No secrets, private API keys, or `.env` files are tracked in this repository. All sensitive parameters are configured via environment variables.

---

## 🧠 Architectural Decisions & Engineering Rationale

### Decision 1: Monorepo with Shared Zod Validation (`@candidate-tracker/shared`)
- **Choice**: All DTO schemas, query filters, and domain types are defined once in `packages/shared` using Zod and TypeScript `z.infer`.
- **Rationale**: Completely eliminates schema drift between the Fastify backend and the React frontend. Any change to a model validation rule is automatically enforced across both client and server at compile time.

### Decision 2: Cross-Entity Search via Server-Side SQL JOIN
- **Choice**: Cross-entity search in `/api/applications` queries across `Application` fields (`jobTitle`, `company`, `source`, `notes`) and linked `Candidate` fields (`name`, `email`, `location`) using PostgreSQL indexed `ILIKE`/`contains` and database relational joins.
- **Rationale**: Offloads search filtering to the database engine with accurate pagination metadata, avoiding inefficient in-memory JavaScript filtering.

### Decision 3: Server-Side Aggregations for Dashboard Metrics
- **Choice**: Dashboard KPIs (`totalCandidates`, `totalApplications`, `applicationsByStatus`, `rejectionRate`, `weeklyTrend`) are computed directly on PostgreSQL using parallel aggregations (`COUNT`, `GROUP BY`, date range filters).
- **Rationale**: Minimal network payload and predictable, fast response times regardless of table growth.

### Decision 4: Soft Delete for Candidates with Relation Integrity
- **Choice**: Candidate entities use a `deletedAt` timestamp for soft deletion.
- **Rationale**: Ensures historical application records remain intact and audit logs are preserved, while active queries exclude soft-deleted profiles.

### Decision 5: TanStack Query v5 Server State & Optimistic Kanban Updates
- **Choice**: All client-side data fetching and caching uses TanStack Query v5. Kanban board stage transitions update the UI optimistically and automatically revert if the server mutation fails.
- **Rationale**: Provides an instantaneous, snappy user experience with automated caching and zero duplicate network requests.

### Decision 6: WCAG AAA High-Contrast Light & Dark Theme System
- **Choice**: Custom CSS design tokens with tailored HSL color palettes and high-contrast status badges (`applied`, `screening`, `interview`, `offer`, `hired`, `rejected`) that adapt seamlessly across light and dark modes.
- **Rationale**: Ensures maximum visual comfort, crisp readability, and full accessibility compliance.

---

## 📡 API Endpoints Matrix

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check & uptime status |
| `GET` | `/api/dashboard` | Aggregated dashboard metrics & 8-week application trends |
| `GET` | `/api/candidates` | Paginated candidate directory with multi-field search |
| `POST` | `/api/candidates` | Create new candidate profile (enforces unique email) |
| `GET` | `/api/candidates/:id` | Candidate profile details with all linked applications |
| `PATCH` | `/api/candidates/:id` | Update candidate profile details |
| `DELETE` | `/api/candidates/:id` | Soft delete candidate profile |
| `GET` | `/api/applications` | **Cross-Entity Search** across job & candidate fields with status/date filters |
| `POST` | `/api/applications` | Create application linked to a candidate |
| `GET` | `/api/applications/:id` | Detailed application record with candidate relations |
| `PATCH` | `/api/applications/:id` | Update application stage, salary, notes, or candidate link |
| `DELETE` | `/api/applications/:id` | Delete application record |

---

## 🧪 Verification & Type Safety

### TypeScript Compilation (Zero Errors)
```bash
# Run TypeScript compilation checks across all workspaces:
npx tsc --noEmit
npm run build
```

### Automated API & Unit Tests
```bash
# Run test suite across all packages:
npm test
```

---

## 💭 What We Would Implement With Extra Time

1. **AI-Powered Resume Parsing & Matching**:
   - Automated PDF/DOCX parsing using OpenAI or Gemini embeddings to extract candidate skills, experience, and match score against job descriptions.
2. **Real-time Collaboration via WebSockets / Supabase Realtime**:
   - Live cursor presence and instant Kanban updates across multiple hiring team members without manual page refreshes.
3. **Automated Email & Calendar Pipeline**:
   - Automated candidate notification emails upon status changes (e.g., Interview invitation, Offer letter) and Google/Outlook Calendar scheduling integration.
4. **Role-Based Access Control (RBAC)**:
   - Multi-role permissions matrix (Admin, Senior Recruiter, Hiring Manager, Reviewer) with granular action permissions.
5. **Cursor-Based Keyset Pagination**:
   - Transition high-volume endpoints from offset (`skip/take`) to cursor keyset pagination for scaling to millions of records with constant `O(1)` query performance.
