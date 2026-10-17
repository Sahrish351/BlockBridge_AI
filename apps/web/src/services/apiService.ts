import { 
  Resource, 
  ResourceMatch, 
  IntakeRequest, 
  ActionPlan, 
  PlanStep,
  PlanStepStatus,
  ResourceReportSubmission,
  PartnerResourceSubmission
} from '../types';
import { VERIFIED_RESOURCES, INITIAL_ACTION_PLANS } from '../data/mockData';

const API_BASE = 'http://127.0.0.1:8000';

// Local storage helper for durable demo persistence
function loadSavedIds(): string[] {
  try {
    const raw = localStorage.getItem('blockbridge_saved_resources');
    return raw ? JSON.parse(raw) : ['res-001', 'res-002'];
  } catch {
    return ['res-001', 'res-002'];
  }
}

function persistSavedIds(ids: string[]) {
  try {
    localStorage.setItem('blockbridge_saved_resources', JSON.stringify(ids));
  } catch {}
}

function loadActionPlans(): ActionPlan[] {
  try {
    const raw = localStorage.getItem('blockbridge_action_plans');
    return raw ? JSON.parse(raw) : [...INITIAL_ACTION_PLANS];
  } catch {
    return [...INITIAL_ACTION_PLANS];
  }
}

function persistActionPlans(plans: ActionPlan[]) {
  try {
    localStorage.setItem('blockbridge_action_plans', JSON.stringify(plans));
  } catch {}
}

// In-memory / session state initialized with persistent values
let currentResources: Resource[] = [...VERIFIED_RESOURCES];
let currentPlans: ActionPlan[] = loadActionPlans();
let savedResourceIds: string[] = loadSavedIds();

let submittedReports: ResourceReportSubmission[] = [
  {
    resource_id: 'res-012',
    resource_name: 'Atlanta Housing Choice Voucher Homeownership Program',
    report_type: 'outdated_deadline',
    description: 'Income guidelines for the 2026 fiscal year were updated by Atlanta Housing last month.',
    reporter_email: 'community_advocate@gatech.edu'
  }
];

let partnerSubmissions: (PartnerResourceSubmission & { id: string; status: 'Pending' | 'Approved' | 'Rejected'; submitted_at: string })[] = [
  {
    id: 'sub-01',
    provider_name: 'Westside Future Fund',
    resource_name: 'Homeowner Retention Anti-Displacement Tax Fund',
    summary: 'Qualifying legacy Westside homeowners receive grant support covering increases in property taxes.',
    category: 'Housing & Rental Support',
    official_url: 'https://www.westsidefuturefund.org',
    contact_email: 'info@westsidefuturefund.org',
    eligibility_summary: 'Must own and reside in qualifying Westside Atlanta neighborhood (English Avenue, Vine City, Ashview Heights).',
    coverage_area: 'Atlanta (Westside)',
    status: 'Pending',
    submitted_at: '2026-10-14'
  }
];

export const apiService = {
  // --- Resources ---
  async getResources(params?: {
    category?: string;
    search?: string;
    coverage?: string;
    status?: string;
  }): Promise<Resource[]> {
    await new Promise((r) => setTimeout(r, 120));
    let list = [...currentResources];

    if (params?.category && params.category !== 'All') {
      list = list.filter((r) => r.category === params.category);
    }
    if (params?.coverage && params.coverage !== 'All') {
      list = list.filter((r) => r.coverage_type === params.coverage);
    }
    if (params?.status && params.status !== 'All') {
      list = list.filter((r) => r.verification_status === params.status);
    }
    if (params?.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.provider_name.toLowerCase().includes(q) ||
          r.summary.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return list;
  },

  async getResourceById(id: string): Promise<Resource | null> {
    await new Promise((r) => setTimeout(r, 80));
    return currentResources.find((r) => r.id === id) || null;
  },

  // --- Saved Resources ---
  async getSavedResourceIds(): Promise<string[]> {
    return [...savedResourceIds];
  },

  async toggleSaveResource(resourceId: string): Promise<boolean> {
    if (savedResourceIds.includes(resourceId)) {
      savedResourceIds = savedResourceIds.filter((id) => id !== resourceId);
      persistSavedIds(savedResourceIds);
      return false; // now unsaved
    } else {
      savedResourceIds.push(resourceId);
      persistSavedIds(savedResourceIds);
      return true; // now saved
    }
  },

  // --- AI Orchestration & Recommendation Pipeline ---
  async orchestrateRecommendations(
    intake: IntakeRequest,
    onProgress?: (stage: string, progress: number) => void
  ): Promise<ResourceMatch[]> {
    // Stage 1: Understanding your need
    onProgress?.('Understanding your need: extracting location, entity type & core assistance category...', 25);
    await new Promise((r) => setTimeout(r, 450));

    // Stage 2: Searching verified catalogue
    onProgress?.('Searching verified catalogue: filtering official sources and active providers...', 55);
    await new Promise((r) => setTimeout(r, 500));

    // Stage 3: Checking eligibility criteria & unknowns
    onProgress?.('Checking eligibility: separating verified facts from items needing provider confirmation...', 80);
    await new Promise((r) => setTimeout(r, 450));

    // Stage 4: Building next steps
    onProgress?.('Building personalized next-step action checklists with Gemini AI...', 95);
    
    // Attempt backend AI endpoint with timeout
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const resp = await fetch(`${API_BASE}/api/recommendations/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(intake),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (resp.ok) {
        const aiMatches: ResourceMatch[] = await resp.json();
        if (Array.isArray(aiMatches) && aiMatches.length > 0) {
          onProgress?.('Finalizing verified matches and action roadmaps...', 100);
          await new Promise((r) => setTimeout(r, 200));
          return aiMatches;
        }
      }
    } catch {
      // Backend not running or timeout; seamlessly use grounded deterministic matcher
    }

    onProgress?.('Finalizing verified matches and action roadmaps...', 100);
    await new Promise((r) => setTimeout(r, 200));

    // Grounded catalogue matching fallback
    const query = intake.description.toLowerCase();
    const isSmallBusiness = intake.user_type === 'small_business' || query.includes('business') || query.includes('store') || query.includes('startup');
    
    let matched = currentResources.filter((r) => {
      if (isSmallBusiness) {
        return r.category === 'Small Business Support' || r.category === 'Employment & Workforce Training';
      } else {
        if (intake.category && intake.category !== 'All') {
          return r.category === intake.category || r.category === 'Community & Civic Services';
        }
        return r.category !== 'Small Business Support';
      }
    });

    if (matched.length === 0) {
      matched = currentResources.slice(0, 4);
    }

    return matched.map((resource) => {
      const whyFit: string[] = [];
      const whatWeKnow: string[] = [];
      const whatToConfirm: string[] = [];
      const docs: string[] = resource.required_documents.slice(0, 3);

      if (isSmallBusiness) {
        whyFit.push(`Provides structured assistance for businesses in ${resource.city || 'your area'}.`);
        whyFit.push(`Verified official backing via ${resource.provider_name}.`);
        whatWeKnow.push(`Official application method: ${resource.application_method}`);
        whatWeKnow.push(`Deadline status: ${resource.deadline}`);
        whatToConfirm.push(`Confirm whether your specific revenue band or tenure meets current cohort guidelines.`);
        whatToConfirm.push(`Verify active status of business license before submitting application.`);
      } else {
        whyFit.push(`Serves residents needing ${resource.category.toLowerCase()} with direct support.`);
        whyFit.push(`Provider verified at ${resource.official_url}.`);
        whatWeKnow.push(`Cost to applicant: ${resource.cost_details}`);
        whatWeKnow.push(`Application method: ${resource.application_method}`);
        whatToConfirm.push(`Confirm current intake hours and any neighborhood-specific zip code boundaries.`);
        whatToConfirm.push(`Verify exact household gross income documentation requirements.`);
      }

      return {
        resource,
        confidence: resource.verification_status === 'Verified' ? 'Likely Match' : 'Possible Match',
        why_fit_reasons: whyFit,
        what_we_know: whatWeKnow,
        what_to_confirm: whatToConfirm,
        before_you_apply_docs: docs,
        next_step_action: `Review prerequisites and visit official portal at ${resource.provider_name}`
      };
    });
  },

  // --- Action Plans ---
  async getActionPlans(): Promise<ActionPlan[]> {
    await new Promise((r) => setTimeout(r, 90));
    return [...currentPlans];
  },

  async getActionPlanById(id: string): Promise<ActionPlan | null> {
    await new Promise((r) => setTimeout(r, 60));
    return currentPlans.find((p) => p.id === id) || null;
  },

  async createActionPlanFromResources(
    title: string,
    goal: string,
    resources: Resource[]
  ): Promise<ActionPlan> {
    await new Promise((r) => setTimeout(r, 150));
    const tasks: PlanStep[] = [];

    // Step 1: Prep step
    tasks.push({
      id: `task-prep-${Date.now()}`,
      title: 'Review Required Documents & Confirm Eligibility Prerequisites',
      description: 'Collect government ID, address verification, and any required financial statements before applying.',
      status: 'In Progress',
      due_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      source_url: resources[0]?.official_url || 'https://www.atlantaga.gov',
      notes: 'Ensure all files are saved as legible PDFs or clear photos.',
      resource_id: resources[0]?.id
    });

    // Step for each selected resource
    resources.forEach((res, idx) => {
      tasks.push({
        id: `task-apply-${res.id}-${idx}`,
        title: `Submit Application / Inquiry to ${res.provider_name}`,
        description: `Follow official process: ${res.application_method}. Deadline: ${res.deadline}`,
        status: 'Not Started',
        due_date: new Date(Date.now() + 86400000 * (7 + idx * 4)).toISOString().split('T')[0],
        source_url: res.application_url || res.official_url,
        notes: `Contact: ${res.contact_details || 'Check official site'}`,
        resource_id: res.id
      });
    });

    // Follow-through step
    tasks.push({
      id: `task-followup-${Date.now()}`,
      title: 'Log Confirmation Number & Set Calendar Reminder for Decision Status',
      description: 'Record confirmation receipt and check in with provider if timeline exceeds stated processing period.',
      status: 'Not Started',
      due_date: new Date(Date.now() + 86400000 * 21).toISOString().split('T')[0],
      notes: ''
    });

    const newPlan: ActionPlan = {
      id: `plan-${Date.now()}`,
      title,
      goal,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tasks
    };

    currentPlans.unshift(newPlan);
    persistActionPlans(currentPlans);

    // Optional background sync with backend
    try {
      fetch(`${API_BASE}/api/action-plans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPlan)
      }).catch(() => {});
    } catch {}

    return newPlan;
  },

  async updatePlanStepStatus(
    planId: string, 
    stepId: string, 
    status: PlanStepStatus,
    notes?: string,
    dueDate?: string
  ): Promise<PlanStep | null> {
    const plan = currentPlans.find((p) => p.id === planId);
    if (!plan) return null;

    const task = plan.tasks.find((t) => t.id === stepId);
    if (!task) return null;

    task.status = status;
    if (notes !== undefined) task.notes = notes;
    if (dueDate !== undefined) task.due_date = dueDate;
    plan.updated_at = new Date().toISOString();

    persistActionPlans(currentPlans);
    return { ...task };
  },

  async addPlanStep(planId: string, step: Omit<PlanStep, 'id'>): Promise<PlanStep | null> {
    const plan = currentPlans.find((p) => p.id === planId);
    if (!plan) return null;

    const newStep: PlanStep = {
      ...step,
      id: `task-custom-${Date.now()}`
    };

    plan.tasks.push(newStep);
    plan.updated_at = new Date().toISOString();
    persistActionPlans(currentPlans);
    return newStep;
  },

  async deletePlanStep(planId: string, stepId: string): Promise<boolean> {
    const plan = currentPlans.find((p) => p.id === planId);
    if (!plan) return false;

    plan.tasks = plan.tasks.filter((t) => t.id !== stepId);
    plan.updated_at = new Date().toISOString();
    persistActionPlans(currentPlans);
    return true;
  },

  // --- Reports & Partner Submissions ---
  async submitResourceReport(report: ResourceReportSubmission): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 200));
    submittedReports.push(report);

    try {
      fetch(`${API_BASE}/api/resource-reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      }).catch(() => {});
    } catch {}

    return true;
  },

  async submitPartnerResource(submission: PartnerResourceSubmission): Promise<string> {
    await new Promise((r) => setTimeout(r, 250));
    const newId = `sub-${Date.now().toString().slice(-4)}`;
    partnerSubmissions.push({
      ...submission,
      id: newId,
      status: 'Pending',
      submitted_at: new Date().toISOString().split('T')[0]
    });

    try {
      fetch(`${API_BASE}/api/partner/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      }).catch(() => {});
    } catch {}

    return newId;
  },

  async getAdminQueue() {
    await new Promise((r) => setTimeout(r, 100));
    return {
      partnerSubmissions: [...partnerSubmissions],
      errorReports: [...submittedReports],
      staleResources: currentResources.filter((r) => r.verification_status === 'Needs Re-verification')
    };
  },

  async moderatePartnerSubmission(id: string, action: 'Approved' | 'Rejected'): Promise<boolean> {
    const sub = partnerSubmissions.find((s) => s.id === id);
    if (!sub) return false;
    sub.status = action;

    if (action === 'Approved') {
      currentResources.push({
        id: `res-approved-${Date.now()}`,
        name: sub.resource_name,
        provider_name: sub.provider_name,
        summary: sub.summary,
        description: sub.summary,
        category: sub.category,
        tags: ["partner-approved", "community-verified"],
        audience: "Community residents and local entrepreneurs",
        coverage_type: "Regional",
        city: "Atlanta",
        region: "GA",
        official_url: sub.official_url,
        eligibility_criteria: {
          notes: sub.eligibility_summary
        },
        required_documents: ["Government photo ID", "Proof of residency or business presence"],
        application_method: "Apply through official provider website",
        deadline: "Contact provider for open cycles",
        cost_details: "Verified nonprofit community program",
        verification_status: "Verified",
        source_checked_at: new Date().toISOString().split('T')[0],
        source_notes: "Approved through Moderator Quality Review seam.",
        provenance_type: "Partner Submitted & Verified",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    return true;
  }
};
