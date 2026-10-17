# BlockBridge AI — 3-Minute Hackathon Demo Script & Judge Walkthrough

> **Track:** Track 3: Community Development — Black Code Collective Hacktoberfest  
> **Demonstration Target:** End-to-end journey from user need to verified recommendation, uncertainty inspection, and interactive action plan tracking.

---

## 1. Pitch Timing Breakdown (3 Minutes Total)

| Section | Target Time | Core Message to Judges |
| :--- | :--- | :--- |
| **1. The Problem** | 0:00 – 0:30 (30s) | Under-resourced residents and Black-owned small businesses face immense information friction. Legitimate programs exist (Invest Atlanta, LIHEAP, RICE, ACFB), but are scattered across county sites, PDF forms, and expired portals. People don't know where to start or what to confirm. |
| **2. The Solution** | 0:30 – 1:00 (30s) | BlockBridge AI is an AI-assisted community navigator. It uses a **zero-hallucination, catalogue-grounded pipeline** to match requests with verified public programs, make eligibility uncertainties transparent, and generate trackable action plans. |
| **3. Live Walkthrough** | 1:00 – 2:20 (80s) | Demonstrate Marcus Vance (Small Business Owner in West End Atlanta) discovering the Invest Atlanta Opportunity Fund and RICE Academy, inspecting what to confirm, and managing his action plan. |
| **4. Responsible AI & Civic Trust** | 2:20 – 2:45 (25s) | Highlight that the AI never makes authoritative eligibility claims; uncertainty is explicit; community partners can submit corrections to an admin moderation queue. |
| **5. Conclusion & Vision** | 2:45 – 3:00 (15s) | Dignity-first, high-contrast, accessible civic tech that turns fragmented information into community mobility. |

---

## 2. Step-by-Step Live Demo Clickthrough

### Step 1: Landing Page (The First Impression)
1. Open the homepage at `http://localhost:5173/`.
2. **Point out the Editorial Visual Craft:**
   - Display typography (`DM Serif Display` + `DM Sans`), warm ivory background (`#FAF8F3`), and forest green primary brand (`#246B52`).
   - Notice the **absence of generic AI clichés** (no neon gradients or dark cards).
   - Point to the **Hackathon Demo Mode disclosure banner** at the top, confirming that all 12 sample resources are authentic public programs from Atlanta/Georgia.
3. **Interactive Hero Preview:**
   - Show the sample checklist in the right hero card. Click a task to toggle it on/off, showing that progress dynamically recalculates.
4. Click **"Find Support Now"** or click **"Scenario A: Small Business Owner"** in the top banner.

### Step 2: Guided Intake (`/find-support`)
1. Show the pre-filled Marcus Vance scenario:
   - **User Type:** Small Business Owner
   - **Location:** Atlanta, GA (ZIP: 30310 — West End)
   - **Need Description:** *"I run a small neighborhood café in West End Atlanta and need help finding business coaching and funding opportunities to expand our kitchen equipment."*
2. Click **"Analyze Need & Search Verified Programs"**.
3. **Watch the 4-Stage Orchestrator in Real-Time:**
   - Stage 1: Understanding your need (Extracting entity type and location)
   - Stage 2: Searching verified catalogue (Zero hallucination firewall)
   - Stage 3: Checking eligibility & unknowns
   - Stage 4: Building next-step checklists

### Step 3: Inspecting Verified Recommendations
1. Show the matched programs:
   - **Invest Atlanta Small Business Opportunity Fund**
   - **Russell Innovation Center for Entrepreneurs (RICE) Growth Academy**
   - **ACE CDFI Loans**
   - **SCORE Atlanta Mentoring**
2. **Highlight the Distinction Between Knowns and Unknowns:**
   - In each card, point to the green box: *"Why this matches your situation"*.
   - Point to the amber box: *"Items needing confirmation"* (e.g. *"Confirm whether your business license is active with the City of Atlanta"*).
   - Click **"Official Portal"** to show the direct, verified link to `investatlanta.com`.
3. With the top 2 programs selected, click **"Build My Action Plan"**.

### Step 4: The Action Plan Tracker (`/app/plans/:id`)
1. The page opens Marcus's prioritized roadmap with a dynamic progress bar (e.g. *"50% Complete"*).
2. Demonstrate interactivity:
   - Click the status dropdown on Step 2 (*Compile Last 2 Years Tax Returns*) and switch it from **"In Progress"** to **"Completed"**.
   - Notice the overall progress bar instantly updates from 50% to 75%!
   - Click **"Add Note"** on Step 3, type *"Confirmed meeting with SCORE mentor on Thursday"*, and click **"Save Note"**.
3. Click **"Print / Export PDF"**:
   - Show that the page strips away navigation and formats a clean, accessible print view suitable for taking to a local community center.

### Step 5: Community Partner Portal & Admin Reviewer Queue
1. Navigate to **"For Organizations"** (`/community-partners`):
   - Show how a neighborhood organization (like Westside Future Fund) submits a grant or reports an update.
2. Navigate to **"Reviewer Queue"** (`/admin`):
   - Show the administrative dashboard where community submissions and user reports are audited against official URLs before being approved into the public catalogue.

---

## 3. Anticipated Judge Questions & Strong Answers

**Q: "Did the AI write the eligibility rules for these programs?"**  
> *A: "No. The AI's role is strictly that of an intake interpreter and organizer. All resource data, URLs, and criteria come directly from our verified catalogue of public records (Invest Atlanta, Georgia DHS, LIHEAP, RICE). The AI separates verified facts from unknown criteria that the applicant must confirm."*

**Q: "How does this platform support Black communities without excluding others?"**  
> *A: "We deliberately designed BlockBridge AI around dignity and privacy. We do not require users to disclose their race or financial credentials to get help. We feature high-impact Black-owned business incubators (like RICE and Morehouse MIEC) while ensuring full access to all municipal and community programs across the region."*

**Q: "What happens if third-party LLM APIs are down?"**  
> *A: "BlockBridge AI features a built-in deterministic seam. All matching and checklist generation can run either against the FastAPI backend or completely in-browser with deterministic verification rules."*
