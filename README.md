# BlockBridge AI

> **Find the support. Take the next step.**  
> Built for the **Black Code Collective Hacktoberfest** — **Track 3: Community Development**  
> GitHub Repository: [https://github.com/Sahrish351/BlockBridge_AI.git](https://github.com/Sahrish351/BlockBridge_AI.git)

BlockBridge AI is an editorial-grade, AI-assisted community resource navigation platform built for residents and neighborhood small businesses in under-resourced communities. It moves users from an unstructured, real-world need to an actionable, source-backed roadmap with transparent eligibility guidance, role-specific follow-through trackers, and verified human curation.

---

## 🌟 Why BlockBridge AI?

In many urban communities, public resources (LIHEAP energy subsidies, CDFI microloans, food pantry mobile distributions, technical training cohorts, commercial lease retention funds) are scattered across fragmented agency portals, obscure PDF forms, and expired websites.

Community members face severe cognitive load, outdated deadlines, and unclear application prerequisites.

BlockBridge AI solves this through a **zero-hallucination, verified-resource architecture**:
1. **Source-Grounded AI Recommendations:** Recommendations are powered by Google Gemini (`gemini-flash-latest`), strictly grounded in 12 authentic, human-verified public programs from the Atlanta/Georgia region with official source links.
2. **Transparent Uncertainty:** The system never guesses or guarantees eligibility. It explicitly separates **"What We Know (From Official Sources)"** from **"Items to Confirm with the Provider"**.
3. **Role-Specific Dashboards:** Distinct workspaces for **Small Businesses** (commercial leases, capital readiness, $10k–$40k grant targets) and **Residents** (utility relief, emergency food pantry mobile distributions, housing voucher prerequisites).
4. **Interactive Action Plans:** Matches convert into step-by-step checklists with prerequisite document lists, personal notes, status progression, and browser printing/PDF export.
5. **Real Authentication & Reviewer Personas:** Integrated with Supabase Auth for persistent sessions, protected routes, and 1-click test personas for hackathon judges.
6. **Civic Moderation Seam:** Community organizations can submit programs through a dedicated Partner Portal, with human-in-the-loop verification in the Civic Reviewer Queue before listings appear publicly.

---

## 🏗️ Architecture & Technology Stack

BlockBridge AI uses a modular monorepo architecture:

- **Frontend (`apps/web`):**
  - **Framework:** React 18 + TypeScript + Vite
  - **Design System:** Tailwind CSS with custom civic editorial design tokens (Warm Ivory `#FAF8F3`, Deep Charcoal `#202720`, Forest Green `#246B52`, Soft Sage `#DCEBE1`, Terracotta `#E98770`)
  - **Typography:** `DM Serif Display` (Editorial Headings) + `DM Sans` (Clean UI copy)
  - **Icons:** Lucide React (no emoji used as substitutes for interface icons)
  - **Photography:** High-quality, verified community and small-business photography from Unsplash
  - **Auth & Route Guards:** Supabase Auth client (`@supabase/supabase-js`) + `<ProtectedRoute>` with role-based access control
- **Backend (`apps/api`):**
  - **Framework:** FastAPI (Python 3.11-3.13) with Pydantic runtime schemas
  - **AI Pipeline:** Google Generative AI REST integration (Gemini 2.5 Flash) with strict Atlanta catalogue grounding and automatic fallback
  - **Database & Persistence:** **Supabase PostgreSQL** with active Row-Level Security (RLS) across 8 public tables for user action plans, checklist tasks, saved resources, community error reports, and partner submissions. SQLite (`apps/api/blockbridge.db`) provides an offline deterministic test double for CI/CD test suites (`pytest`).
  - **Security:** Strict CORS origin whitelisting + Vercel deployment regex, role enforcement dependency (`require_admin_role`), and PostgreSQL RLS tenant isolation.
  - **Testing:** Automated `pytest` test suite with 100% passing tests
- **Verified Data Engine (`sample-data/`):**
  - 12 authentic, human-verified public programs from the Atlanta/Georgia region (Invest Atlanta, Russell Center, LIHEAP, ACFB, ACE CDFI, Urban League, SCORE, etc.)

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Sahrish351/BlockBridge_AI.git
cd BlockBridge_AI

# Install frontend dependencies
npm install

# Install backend dependencies
cd apps/api
pip install -r requirements.txt
cd ../..
```

### 2. Configure Environment Files
Both `.env` files are pre-configured with active development credentials (and strictly excluded from Git tracking via `.gitignore`):

- `apps/web/.env`:
  ```ini
  VITE_SUPABASE_URL=https://maooldqymmxvoeubnrdc.supabase.co
  VITE_SUPABASE_ANON_KEY=sb_publishable_Ootxcl1QoBCswO3K3CDZ_w_pg2GGWBs
  ```

- `apps/api/.env`:
  ```ini
  PORT=8000
  HOST=127.0.0.1
  GEMINI_MODEL=gemini-flash-latest
  GEMINI_API_KEY=YOUR_GEMINI_API_KEY
  ```

### 3. Launch the Application

#### Terminal 1 — React Frontend (Vite):
```bash
npm run dev --workspace=blockbridge-web
```
Opens at **[http://localhost:5173](http://localhost:5173)**.

#### Terminal 2 — FastAPI Backend (Uvicorn):
```bash
cd apps/api
python main.py
```
API runs on `http://127.0.0.1:8000` with interactive Swagger docs at `http://127.0.0.1:8000/docs`.

---

## 🌐 Production Deployment Guide

### 1. Frontend Deployment (Vercel)
- **Framework Preset**: Vite
- **Root Directory**: `apps/web` (or `./` if deploying from monorepo root)
- **Build Command**: `npm run build`
- **Output Directory**: `dist` (or `apps/web/dist` if root is `./`)
- **SPA Rewrites**: Handled automatically via `vercel.json`
- **Environment Variables**:
  - `VITE_API_URL`: Your Render backend API URL (e.g. `https://blockbridge-api.onrender.com/api`)
  - `VITE_SUPABASE_URL`: `https://maooldqymmxvoeubnrdc.supabase.co`
  - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
  - `VITE_APP_NAME`: `BlockBridge AI`
  - `VITE_DEMO_MODE`: `true` (enables 1-click test personas for hackathon judges)

### 2. Backend Deployment (Render)
- **Environment**: Python
- **Root Directory**: `apps/api` (or deploy via root `render.yaml` Blueprint)
- **Build Command**: `pip install -r requirements.txt` (or `pip install -r apps/api/requirements.txt` from root)
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT` (or `cd apps/api && uvicorn main:app --host 0.0.0.0 --port $PORT` from root)
- **Health Check Path**: `/api/health`
- **Environment Variables**:
  - `PYTHON_VERSION`: `3.11.9`
  - `CORS_ORIGINS`: Comma-separated allowed frontend domains (e.g. `https://blockbridge-ai.vercel.app,http://localhost:5173`)
  - `GEMINI_API_KEY`: Your Google Gemini API Key
  - `SUPABASE_URL`: `https://maooldqymmxvoeubnrdc.supabase.co`
  - `SUPABASE_ANON_KEY`: Your Supabase anon key

---

## 🧪 Testing & Verification

### Run Backend Automated Tests (Pytest)
```bash
cd apps/api
pytest -v test_api.py
```
*Result: 9 of 9 tests pass covering health, search, AI matching, action plan CRUD, admin authorization, and partner submissions.*

### Run Frontend Typecheck & Production Build
```bash
npm run build --workspace=blockbridge-web
```
*Result: Clean compilation with 0 TypeScript errors.*

---

## 🎯 Judge & Reviewer Walkthrough (3-Minute Tour)

1. **Editorial Landing Page (`/`)**:
   - Inspect the split hero, editorial photography, and interactive checklist preview.
   - Review the two tailored user pathways: **Residents Seeking Assistance** and **Small Businesses Seeking Support**.
2. **1-Click Reviewer Authentication (`/login`)**:
   - On the Sign In page, scroll to the **1-Click Test Sign In (Hackathon Demo)** panel:
     - Click **"Resident Persona"** to log in as Keisha Jenkins (Single-earner resident).
     - Click **"Business Owner"** to log in as Marcus Vance (Vance Community Roasters & Café).
     - Click **"Civic Reviewer"** to log in as the moderator.
3. **Role-Specific Dashboards (`/app`)**:
   - Switch between **Resident View** and **Small Business View** to see capital targets vs utility relief schedules.
4. **Action Plan Roadmap (`/app/plans/plan-01`)**:
   - Check off steps, add personal notes, add custom steps, or click **Print / Export PDF**.
5. **Community Partner Portal (`/community-partners`)**:
   - Submit a new civic program and view submission history with status badges (`Pending Review`, `Verified & Approved`).
6. **Civic Moderation Queue (`/admin`)**:
   - Sign in as **Civic Reviewer** to inspect the protected queue, approve/reject partner submissions, review user error reports, and audit stale resources.

---

## 📖 Project Documentation

- [`docs/PRD.md`](docs/PRD.md) — Master Product Requirements Document
- [`docs/VISUAL_DESIGN_PROMPT.md`](docs/VISUAL_DESIGN_PROMPT.md) — Visual excellence guidelines & design direction
- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) — Detailed design system & CSS specifications
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — Technical diagrams & orchestration flow
- [`docs/DEMO_SCRIPT.md`](docs/DEMO_SCRIPT.md) — Step-by-step hackathon pitch & judge Q&A guide
- [`docs/IMPLEMENTATION_AUDIT.md`](docs/IMPLEMENTATION_AUDIT.md) — Feature gap analysis & implementation audit
- [`docs/IMPLEMENTATION_STATUS.md`](docs/IMPLEMENTATION_STATUS.md) — Quality gate verification & status report

---

## 🛡️ Responsible AI & Community Notice

BlockBridge AI operates strictly as an informational and navigation guide:
- The AI helps interpret user needs and structure checklists; it **never guarantees benefits eligibility or approves applications**.
- Provider staff always make official benefits determinations.
- We do not request or store sensitive personal information such as Social Security numbers, banking passwords, or immigration papers.

> **Disclaimer:** BlockBridge AI helps people discover and organize community resources. It is not a government agency, grant provider, legal adviser, or emergency service. Resource details and eligibility can change. Always confirm requirements, availability, and deadlines with the official provider. Recommendations are informational and do not guarantee eligibility or assistance.
