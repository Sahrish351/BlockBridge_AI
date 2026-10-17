# BlockBridge AI

> **Find the support. Take the next step.**  
> Built for the **Black Code Collective Hacktoberfest** — **Track 3: Community Development**

BlockBridge AI is an AI-assisted community resource navigation platform built for residents and neighborhood small businesses in under-resourced communities. It moves users from an unstructured, real-world need to an actionable, source-backed roadmap with transparent eligibility guidance and follow-through tracking.

---

## 🌟 Why BlockBridge AI?

In many communities, public resources (LIHEAP energy assistance, commercial gap loans, food pantries, CDFI microloans, job certification programs) are scattered across fragmented agency portals, obscure PDF forms, and expired websites. 

People face severe cognitive load, outdated deadlines, and unclear application prerequisites.

BlockBridge AI solves this through a **zero-hallucination, verified-resource architecture**:
1. **Source-Grounded Recommendations:** Every program is mapped directly to an official government, municipal, or certified nonprofit URL with a "Last Verified" date.
2. **Transparent Uncertainty:** The system never guesses or guarantees eligibility. It explicitly separates **"What We Know"** from **"Items to Confirm with the Provider"**.
3. **From Discovery to Action:** Matches are instantly converted into a step-by-step checklist with prerequisite document lists, direct links, due dates, and PDF/print export.
4. **Civic Quality Seam:** Community organizations and residents can suggest updates or submit new programs through a dedicated Reviewer Moderation Queue.

---

## 🏗️ Architecture & Technology Stack

BlockBridge AI uses a modular monorepo architecture:

- **Frontend (`apps/web`):**
  - **Framework:** React 18 + TypeScript + Vite
  - **Design System:** Tailwind CSS with custom civic editorial design tokens (Warm Ivory `#FAF8F3`, Deep Charcoal `#202720`, Forest Green `#246B52`, Soft Sage `#DCEBE1`, Terracotta `#E98770`)
  - **Typography:** `DM Serif Display` (Editorial Headings) + `DM Sans` (Hyper-legible UI copy)
  - **Icons:** Lucide React
  - **Seam:** Dual-mode API client with instantaneous local deterministic fallback for competition demos
- **Backend (`apps/api`):**
  - **Framework:** FastAPI (Python 3.13) with Pydantic runtime data schemas
  - **Endpoints:** Resources search/filter, multi-stage AI orchestration, action plan persistence, moderation queue
- **Data Engine (`sample-data/`):**
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
```

### 2. Configure Environment
```bash
cp .env.example .env
```
*(No third-party API keys are required to test the core experience; deterministic verified fixtures run out of the box).*

### 3. Launch Web Application
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 4. (Optional) Run FastAPI Backend
```bash
cd apps/api
pip install -r requirements.txt
python main.py
```
API runs on `http://127.0.0.1:8000/api` with interactive OpenAPI docs at `http://127.0.0.1:8000/docs`.

---

## 📖 Key Documentation

- [`docs/PRD.md`](docs/PRD.md) — Master Product Requirements Document
- [`docs/VISUAL_DESIGN_PROMPT.md`](docs/VISUAL_DESIGN_PROMPT.md) — Visual excellence guidelines & tokens
- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) — Detailed design system & CSS specifications
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — Technical diagrams & orchestration flow
- [`docs/DEMO_SCRIPT.md`](docs/DEMO_SCRIPT.md) — 3-minute hackathon presentation script & judge walkthrough

---

## 🛡️ Responsible AI & Community Notice

BlockBridge AI operates strictly as an informational and navigation guide:
- The AI helps interpret user needs and structure checklists; it **never guarantees benefits eligibility or approves applications**.
- Provider staff always make official benefits determinations.
- We do not request or store sensitive personal information such as Social Security numbers, banking passwords, or immigration papers.

> **Disclaimer:** BlockBridge AI helps people discover and organize community resources. It is not a government agency, grant provider, legal adviser, or emergency service. Resource details and eligibility can change. Always confirm requirements, availability, and deadlines with the official provider. Recommendations are informational and do not guarantee eligibility or assistance.
