# BlockBridge AI — UI Implementation & Build Checklist

> **Hackathon Track:** Black Code Collective Hacktoberfest — Track 3: Community Development  
> **Source of Truth:** `docs/PRD.md` (Product Requirements) & `docs/VISUAL_DESIGN_PROMPT.md` (Visual & UX Craft)

---

## 1. Project Overview & Architectural Setup

- [ ] **Repository Structure Setup**
  - [ ] Initialize monorepo / application workspace (`apps/web` React+TypeScript+Tailwind+Vite, `apps/api` FastAPI Python / modular server or unified full-stack architecture with direct client & API integration seam)
  - [ ] Configure TypeScript, Tailwind CSS with custom design tokens, PostCSS, ESLint
  - [ ] Set up Google Fonts (`DM Serif Display` and `DM Sans` / `Inter`) with proper fallbacks
  - [ ] Setup Lucide icon system (`lucide-react`)
  - [ ] Create `.env.example` with clear placeholders and zero exposed secrets
  - [ ] Create `sample-data/resources.demo.json` with 16+ authentic, verified community & small business resources
  - [ ] Create `sample-data/scenarios.demo.json` with realistic demo scenarios (Business Owner & Resident)

---

## 2. Design System & Token Foundation (`docs/DESIGN_SYSTEM.md`)

- [ ] **CSS Variables & Color Tokens**
  - [ ] `--bb-bg: #FAF8F3` (Warm Ivory background)
  - [ ] `--bb-surface: #FFFFFF` (Clean card/modal surface)
  - [ ] `--bb-surface-soft: #F1F3EC` (Supportive neutral tone)
  - [ ] `--bb-ink: #202720` (Deep charcoal primary text)
  - [ ] `--bb-ink-muted: #626A63` (Muted slate secondary text)
  - [ ] `--bb-brand: #246B52` (Deep Forest Green primary action)
  - [ ] `--bb-brand-hover: #18523F` (Deep hover state)
  - [ ] `--bb-brand-soft: #DCEBE1` (Soft sage badge / supportive tint)
  - [ ] `--bb-coral: #E98770` (Warm terracotta accent)
  - [ ] `--bb-coral-soft: #FBE7E0` (Soft coral background)
  - [ ] `--bb-butter: #F5E8B8` (Pale butter highlight)
  - [ ] `--bb-line: #E5E5DC` (Restrained border color)
  - [ ] Functional tokens: `--bb-success: #237A4B`, `--bb-warning: #98651B`, `--bb-danger: #B33A3A`, `--bb-info: #315F91`, `--bb-focus: #276EF1`
- [ ] **Typography Scale**
  - [ ] Display Serif (`DM Serif Display` / `Fraunces`) for hero and major section titles
  - [ ] Body Sans (`DM Sans` / `Inter`) for clean, highly legible UI and editorial text
  - [ ] Clear hierarchical scale: Display XL, H1, H2, H3, Subtitle, Body, Caption, Tag
- [ ] **Core Reusable Components**
  - [ ] `Button` (Primary, Secondary, Outline, Ghost, Danger, with loading and disabled states)
  - [ ] `Badge` / `StatusPill` (Verified, Needs Confirmation, Stale, Demo, Category)
  - [ ] `Card` (Editorial card, Resource card, Pathway card, Plan task item)
  - [ ] `Input`, `Textarea`, `Select`, `Checkbox` with accessible labels and error messages
  - [ ] `Modal` / `Dialog` (accessible with trap focus and escape key handling)
  - [ ] `Toast` notifications for confirmed actions
  - [ ] `Skeleton` loaders for real asynchronous fetches
  - [ ] `EmptyState` component with clear primary action
  - [ ] `DisclaimerBanner` & `DemoModeBadge` for transparent user disclosure

---

## 3. Public Pages & Editorial Landing Page (Phase 1 — P0)

- [ ] **Navigation Header**
  - [ ] Wordmark "BlockBridge" with connection/bridge brand icon
  - [ ] Links: How it Works, Explore Resources, For Organizations, Impact & Trust
  - [ ] Actions: "Explore Demo" (badge), "Find Support" (Primary CTA)
  - [ ] Fully functional mobile hamburger drawer menu
- [ ] **Hero Section (Split Editorial Layout)**
  - [ ] Eyebrow: `COMMUNITY SUPPORT, MADE ACTIONABLE`
  - [ ] Large headline: "Find the support. Take the next step." with brand accent
  - [ ] Clear explanatory copy highlighting dignity, verified sources, and real steps
  - [ ] Primary CTA: "Find Support" → launches guided intake
  - [ ] Secondary CTA: "Explore Demo" → launches interactive sample walkthrough
  - [ ] Reassurance label: "Source-backed resources • Clear next steps • No guesswork"
  - [ ] Custom visual composition: Editorial community imagery + interactive floating sample resource preview card with verification status and mini action checklist
- [ ] **Trust & Verification Strip**
  - [ ] 3 core pillars: Official sources cited, Unknowns labeled openly, Concrete action plans
  - [ ] No fake metrics or unverified logos
- [ ] **Dual Pathway Split**
  - [ ] Pathway 1: "I Need Support" (Housing, food, utilities, workforce, healthcare)
  - [ ] Pathway 2: "I'm Growing a Small Business" (Grants, technical assistance, mentorship, commercial space)
- [ ] **Interactive "How It Works" Section**
  - [ ] Step 1: Tell us your need in plain language
  - [ ] Step 2: Explore verified, local options
  - [ ] Step 3: Understand what to confirm before applying
  - [ ] Step 4: Turn recommendations into an actionable step-by-step checklist
- [ ] **Live Interactive Product Showcase**
  - [ ] Realistic resource card with verified source link, last checked date, "Why this may fit", and "What to confirm"
  - [ ] Connected interactive checklist with checkable items and progress indicator
- [ ] **Editorial Community & Small Business Focus Section**
  - [ ] Warm, high-craft editorial presentation on economic mobility and civic visibility
  - [ ] Dedicated section on dignity, privacy, and Black community & small business empowerment without stereotyping
- [ ] **Community Partner & Organizations Section**
  - [ ] Explanation of how community organizations submit resources or corrections
  - [ ] Direct link to Partner Portal & Submission form
- [ ] **Responsible AI & Verification Engine Section**
  - [ ] 4 AI principles: Source grounding, No hallucinated eligibility, Transparent uncertainty, User in the driver's seat
  - [ ] Live preview of how the AI checks criteria without making authoritative benefits decisions
- [ ] **Final Call to Action**
  - [ ] High-contrast, warm section encouraging one small next step
- [ ] **Comprehensive Civic Footer**
  - [ ] Full navigation links: Resources, How it Works, Standards, Privacy, Terms, Feedback
  - [ ] Mandatory PRD disclaimer text clearly displayed

---

## 4. Resource Catalogue & Search (`/resources`, `/resources/:id` — P0)

- [ ] **Catalogue Browse & Filter Engine**
  - [ ] Category filter pills (Food, Housing, Utilities, Small Business, Workforce, Civic)
  - [ ] Geographic coverage filter (City, State, National)
  - [ ] Audience filter (Residents, Small Businesses, Youth, Seniors)
  - [ ] Search input with keyword matching across title, provider, summary, and tags
  - [ ] Sorting options: Relevance, Last Verified Date, Alphabetical
  - [ ] Verification badges: "Verified Source", "Needs Re-verification", "Unverified Submission"
  - [ ] Empty state with "Broaden your search" and "Suggest a resource"
- [ ] **Resource Detail View (`/resources/:id`)**
  - [ ] Clear program title, provider name, and verified badge
  - [ ] Official source link with external icon and "Last verified on [Date]"
  - [ ] "Why this may fit" summary
  - [ ] Structured Eligibility breakdown: "What we know" vs. "What to confirm with provider"
  - [ ] Required documents checklist (e.g. proof of income, business license)
  - [ ] Direct application URL & deadline information
  - [ ] Actions: "Add to Action Plan", "Save Resource", "Report Outdated Info"
  - [ ] Feedback/Correction modal form

---

## 5. Guided Intake & AI Recommendation Workflow (`/find-support` — P0)

- [ ] **Guided Step-by-Step Intake Form**
  - [ ] Mode selection: Resident vs. Small Business
  - [ ] Location selection (City / ZIP code with sample presets)
  - [ ] Category selection with visual icons
  - [ ] Plain-language need description input with helpful prompt examples
  - [ ] Urgency indicator (Standard, Soon, Immediate)
  - [ ] Optional non-sensitive context
- [ ] **AI Orchestration Pipeline (Inspectable Workflow)**
  - [ ] Stage 1: Understanding your need (Extracts structured criteria)
  - [ ] Stage 2: Searching verified catalogue (Strict catalogue grounding, no made-up programs)
  - [ ] Stage 3: Checking eligibility criteria (Classifies: Likely match, Possible match, Needs confirmation)
  - [ ] Stage 4: Building next steps (Assembles prioritized checklist)
  - [ ] Live visual stage progression showing real work
  - [ ] Fallback deterministic mode if offline or LLM unavailable
- [ ] **Intake Results Presentation**
  - [ ] Match confidence badges with explicit uncertainty reasoning
  - [ ] Direct "Build Action Plan" one-click transition

---

## 6. Action Plan Generator & Progress Tracker (`/app/plans`, `/app/plans/:id` — P0)

- [ ] **Action Plan Builder**
  - [ ] Generates sequential, actionable checklist from selected resources
  - [ ] Prerequisite documents highlighted first (e.g., "Gather utility bills")
  - [ ] Direct application step with official provider links
  - [ ] Follow-up confirmation step
  - [ ] Custom user steps can be added, edited, or removed
- [ ] **Interactive Progress Tracking**
  - [ ] Status updates: `Not Started` → `In Progress` → `Completed` (or `Blocked`)
  - [ ] Dynamic progress bar calculation (e.g., 2 of 5 completed)
  - [ ] Due date assignment & user notes on each step
  - [ ] Print / PDF export view (`/app/plans/:id/print`) formatted for clean printing
  - [ ] Reassurance & celebration upon completing tasks without patronizing UI

---

## 7. User Workspace & Dashboard (`/app` — P0)

- [ ] **Dashboard Home**
  - [ ] Active Action Plans overview with progress percentage
  - [ ] Saved Resources list with quick detail drawer or link
  - [ ] Next urgent step reminder panel
  - [ ] Quick Action: "Start a New Search"
  - [ ] Clear demo session indicator with toggle to test different scenarios
- [ ] **Authentication Experience (`/login`, `/register`)**
  - [ ] Branded, high-polish sign-in and sign-up forms
  - [ ] Demo Mode 1-click preset access ("Demo Resident", "Demo Small Business", "Demo Reviewer")
  - [ ] Client validation with accessible error alerts

---

## 8. Community Partner Portal & Admin Reviewer Queue (`/partner`, `/admin` — P1)

- [ ] **Partner Portal (`/partner`)**
  - [ ] Informational guide on verification standards
  - [ ] Resource submission form with required source URL, provider info, and eligibility fields
  - [ ] Submission tracking list (Pending, Under Review, Approved, Needs Info)
- [ ] **Admin / Reviewer Workspace (`/admin`)**
  - [ ] Queue of pending resource submissions and user error reports
  - [ ] Side-by-side verification review against official source
  - [ ] Actions: Approve & Publish, Request Information, Reject
  - [ ] Stale resource audit tab (highlighting items unchecked for >90 days)

---

## 9. Quality, Accessibility & Cross-Device Gate

- [ ] **Responsive Breakpoints Check**
  - [ ] Mobile Portrait (360px & 390px)
  - [ ] Tablet (768px)
  - [ ] Small Desktop (1024px)
  - [ ] Large Desktop (1440px)
- [ ] **Accessibility (WCAG 2.2 AA)**
  - [ ] Visible focus outlines on all interactive elements
  - [ ] Proper ARIA attributes and labels for icon buttons and dialogs
  - [ ] Color contrast passes WCAG AA on all text and badge combinations
  - [ ] Respects `prefers-reduced-motion`
- [ ] **Build & Code Quality**
  - [ ] TypeScript type-check passes with 0 errors
  - [ ] Production build succeeds with 0 errors
  - [ ] No exposed API keys, test credentials, or server-role secrets in client code
