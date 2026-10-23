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
import { supabase } from './supabaseClient';
import { VERIFIED_RESOURCES } from '../data/mockData';

const RAW_API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const API_BASE = RAW_API_URL.replace(/\/api\/?$/, '').replace(/\/+$/, '');

const DEFAULT_DEMO_UID = 'c79e1926-a3a6-41ec-88ef-bd06272ca7ac';

async function getEffectiveUserId(explicitUserId?: string): Promise<string> {
  if (explicitUserId && !explicitUserId.startsWith('demo-')) {
    return explicitUserId;
  }
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user?.id) {
    return session.user.id;
  }
  const stored = localStorage.getItem('bb_demo_profile');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.id && !parsed.id.startsWith('demo-')) {
        return parsed.id;
      }
    } catch {}
  }
  return DEFAULT_DEMO_UID;
}

export const apiService = {
  async getResources(params?: {
    category?: string;
    search?: string;
    coverage?: string;
    status?: string;
  }): Promise<Resource[]> {
    try {
      let query = supabase.from('resources').select('*');

      if (params?.category && params.category !== 'All') {
        query = query.eq('category', params.category);
      }
      if (params?.coverage && params.coverage !== 'All') {
        query = query.eq('coverage_type', params.coverage);
      }
      if (params?.status && params.status !== 'All') {
        query = query.eq('verification_status', params.status);
      }

      const { data, error } = await query;
      if (error) throw error;
      if (data && data.length > 0) {
        let list: Resource[] = data as Resource[];
        if (params?.search && params.search.trim()) {
          const q = params.search.toLowerCase().trim();
          list = list.filter(
            (r) =>
              r.name.toLowerCase().includes(q) ||
              r.provider_name.toLowerCase().includes(q) ||
              r.summary.toLowerCase().includes(q) ||
              (r.tags && r.tags.some((t: string) => t.toLowerCase().includes(q)))
          );
        }
        return list;
      }
    } catch (err) {
      console.warn('Failed to fetch resources from Supabase:', err);
    }
    return [...VERIFIED_RESOURCES];
  },

  async getResourceById(id: string): Promise<Resource | null> {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('id', id)
        .single();
      if (!error && data) {
        return data as Resource;
      }
    } catch (err) {
      console.warn('Resource fetch error from Supabase:', err);
    }
    return VERIFIED_RESOURCES.find((r) => r.id === id) || null;
  },

  async getSavedResourceIds(userId?: string): Promise<string[]> {
    const uid = await getEffectiveUserId(userId);
    try {
      const { data, error } = await supabase
        .from('saved_resources')
        .select('resource_id')
        .eq('user_id', uid);
      if (!error && data) {
        return data.map((row: any) => row.resource_id);
      }
    } catch (err) {
      console.warn('Failed to load saved resources from Supabase:', err);
    }
    return [];
  },

  async toggleSaveResource(resourceId: string, userId?: string): Promise<boolean> {
    const uid = await getEffectiveUserId(userId);
    try {
      const { data: existing } = await supabase
        .from('saved_resources')
        .select('id')
        .match({ user_id: uid, resource_id: resourceId });

      if (existing && existing.length > 0) {
        const { error } = await supabase
          .from('saved_resources')
          .delete()
          .match({ user_id: uid, resource_id: resourceId });
        if (error) throw error;
        return false;
      } else {
        const { error } = await supabase
          .from('saved_resources')
          .insert({ user_id: uid, resource_id: resourceId });
        if (error) throw error;
        return true;
      }
    } catch (err) {
      console.error('Failed to toggle saved resource on Supabase:', err);
      throw err;
    }
  },

  async orchestrateRecommendations(
    intake: IntakeRequest,
    onProgress?: (stage: string, progress: number) => void
  ): Promise<ResourceMatch[]> {
    onProgress?.('Understanding your need: extracting location, entity type & core assistance category...', 25);
    await new Promise((r) => setTimeout(r, 350));

    onProgress?.('Searching verified catalogue: filtering official sources and active providers...', 55);
    await new Promise((r) => setTimeout(r, 400));

    onProgress?.('Checking eligibility: separating verified facts from items needing provider confirmation...', 80);
    await new Promise((r) => setTimeout(r, 350));

    onProgress?.('Building personalized next-step action checklists with Gemini AI...', 95);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const resp = await fetch(`${API_BASE}/api/recommendations/ai`, {
        method: 'POST',
        headers,
        body: JSON.stringify(intake),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (resp.ok) {
        const aiMatches: ResourceMatch[] = await resp.json();
        if (Array.isArray(aiMatches) && aiMatches.length > 0) {
          onProgress?.('Finalizing verified matches and action roadmaps...', 100);
          return aiMatches;
        }
      }
    } catch {}

    onProgress?.('Finalizing verified matches and action roadmaps...', 100);

    const liveResources = await this.getResources();
    const query = intake.description.toLowerCase();
    const isSmallBusiness = intake.user_type === 'small_business' || query.includes('business') || query.includes('store') || query.includes('startup');

    let matched = liveResources.filter((r) => {
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
      matched = liveResources.slice(0, 4);
    }

    return matched.map((resource) => {
      const whyFit: string[] = [];
      const whatWeKnow: string[] = [];
      const whatToConfirm: string[] = [];
      const docs: string[] = (resource.required_documents || []).slice(0, 3);

      if (isSmallBusiness) {
        whyFit.push(`Provides structured assistance for businesses in ${resource.city || 'Atlanta'}.`);
        whyFit.push(`Verified official backing via ${resource.provider_name}.`);
        whatWeKnow.push(`Official application method: ${resource.application_method || 'Check portal'}`);
        whatWeKnow.push(`Deadline status: ${resource.deadline || 'Open'}`);
        whatToConfirm.push(`Confirm whether your revenue band meets current cohort guidelines.`);
        whatToConfirm.push(`Verify active status of business license before submitting application.`);
      } else {
        whyFit.push(`Serves residents needing ${resource.category.toLowerCase()} with direct support.`);
        whyFit.push(`Provider verified at ${resource.official_url}.`);
        whatWeKnow.push(`Cost to applicant: ${resource.cost_details || 'Free'}`);
        whatWeKnow.push(`Application method: ${resource.application_method || 'Online/Walk-in'}`);
        whatToConfirm.push(`Confirm current intake hours and any neighborhood boundaries.`);
        whatToConfirm.push(`Verify exact household gross income documentation requirements.`);
      }

      return {
        resource,
        confidence: resource.verification_status === 'Verified' ? 'Likely Match' : 'Possible Match',
        why_fit_reasons: whyFit,
        what_we_know: whatWeKnow,
        what_to_confirm: whatToConfirm,
        before_you_apply_docs: docs,
        next_step_action: `Review prerequisites and visit official portal at ${resource.provider_name}`,
      };
    });
  },

  async getActionPlans(userId?: string): Promise<ActionPlan[]> {
    const uid = await getEffectiveUserId(userId);
    try {
      const { data, error } = await supabase
        .from('action_plans')
        .select('*, tasks:plan_steps(*)')
        .eq('user_id', uid)
        .order('updated_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((p: any) => ({
          id: p.id,
          user_id: p.user_id,
          title: p.title,
          goal: p.goal,
          created_at: p.created_at,
          updated_at: p.updated_at,
          tasks: (p.tasks || []).sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0)),
        }));
      }
    } catch (err) {
      console.warn('Failed to load action plans from Supabase:', err);
    }
    return [];
  },

  async getActionPlanById(id: string): Promise<ActionPlan | null> {
    try {
      const { data, error } = await supabase
        .from('action_plans')
        .select('*, tasks:plan_steps(*)')
        .eq('id', id)
        .single();

      if (!error && data) {
        return {
          id: data.id,
          user_id: data.user_id,
          title: data.title,
          goal: data.goal,
          created_at: data.created_at,
          updated_at: data.updated_at,
          tasks: (data.tasks || []).sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0)),
        };
      }
    } catch (err) {
      console.warn('Failed to fetch action plan from Supabase:', err);
    }
    return null;
  },

  async createActionPlanFromResources(
    title: string,
    goal: string,
    resources: Resource[],
    userId?: string
  ): Promise<ActionPlan> {
    const uid = await getEffectiveUserId(userId);
    const newPlanId = `plan-${Date.now()}`;
    const nowStr = new Date().toISOString();

    const tasks: PlanStep[] = [];
    tasks.push({
      id: `task-prep-${Date.now()}`,
      title: 'Review Required Documents & Confirm Eligibility Prerequisites',
      description: 'Collect government ID, address verification, and any required financial statements before applying.',
      status: 'In Progress',
      due_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      source_url: resources[0]?.official_url || 'https://www.atlantaga.gov',
      notes: 'Ensure all files are saved as legible PDFs or clear photos.',
      resource_id: resources[0]?.id,
    });

    resources.forEach((res, idx) => {
      tasks.push({
        id: `task-apply-${res.id}-${idx}`,
        title: `Submit Application / Inquiry to ${res.provider_name}`,
        description: `Follow official process: ${res.application_method}. Deadline: ${res.deadline}`,
        status: 'Not Started',
        due_date: new Date(Date.now() + 86400000 * (7 + idx * 4)).toISOString().split('T')[0],
        source_url: res.application_url || res.official_url,
        notes: `Contact: ${res.contact_details || 'Check official site'}`,
        resource_id: res.id,
      });
    });

    tasks.push({
      id: `task-followup-${Date.now()}`,
      title: 'Log Confirmation Number & Set Calendar Reminder for Decision Status',
      description: 'Record confirmation receipt and check in with provider if timeline exceeds stated processing period.',
      status: 'Not Started',
      due_date: new Date(Date.now() + 86400000 * 21).toISOString().split('T')[0],
      notes: '',
    });

    try {
      const { error: planErr } = await supabase.from('action_plans').insert({
        id: newPlanId,
        user_id: uid,
        title,
        goal,
        created_at: nowStr,
        updated_at: nowStr,
      });
      if (planErr) throw planErr;

      const stepPayloads = tasks.map((t, idx) => ({
        id: t.id,
        plan_id: newPlanId,
        title: t.title,
        description: t.description || null,
        status: t.status,
        due_date: t.due_date || null,
        source_url: t.source_url || null,
        notes: t.notes || null,
        resource_id: t.resource_id || null,
        order_index: idx + 1,
      }));

      const { error: stepsErr } = await supabase.from('plan_steps').insert(stepPayloads);
      if (stepsErr) throw stepsErr;
    } catch (err) {
      console.error('Failed to create action plan in Supabase:', err);
      throw err;
    }

    return {
      id: newPlanId,
      user_id: uid,
      title,
      goal,
      created_at: nowStr,
      updated_at: nowStr,
      tasks,
    };
  },

  async updatePlanStepStatus(
    planId: string,
    stepId: string,
    status: PlanStepStatus,
    notes?: string,
    dueDate?: string
  ): Promise<PlanStep | null> {
    try {
      const patchObj: any = { status };
      if (notes !== undefined) patchObj.notes = notes;
      if (dueDate !== undefined) patchObj.due_date = dueDate;

      const { data, error } = await supabase
        .from('plan_steps')
        .update(patchObj)
        .eq('id', stepId)
        .select()
        .single();

      if (error) throw error;

      await supabase
        .from('action_plans')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', planId);

      return data as PlanStep;
    } catch (err) {
      console.error('Failed to update plan step on Supabase:', err);
      throw err;
    }
  },

  async addPlanStep(planId: string, step: Omit<PlanStep, 'id'>): Promise<PlanStep | null> {
    const newStepId = `task-custom-${Date.now()}`;
    try {
      const payload = {
        id: newStepId,
        plan_id: planId,
        title: step.title,
        description: step.description || null,
        status: step.status || 'Not Started',
        due_date: step.due_date || null,
        source_url: step.source_url || null,
        notes: step.notes || null,
        resource_id: step.resource_id || null,
        order_index: 99,
      };

      const { data, error } = await supabase
        .from('plan_steps')
        .insert(payload)
        .select()
        .single();

      if (error) throw error;

      await supabase
        .from('action_plans')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', planId);

      return data as PlanStep;
    } catch (err) {
      console.error('Failed to add plan step to Supabase:', err);
      throw err;
    }
  },

  async deletePlanStep(planId: string, stepId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('plan_steps')
        .delete()
        .eq('id', stepId);

      if (error) throw error;

      await supabase
        .from('action_plans')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', planId);

      return true;
    } catch (err) {
      console.error('Failed to delete plan step from Supabase:', err);
      throw err;
    }
  },

  async submitResourceReport(report: ResourceReportSubmission): Promise<boolean> {
    const reportId = `rep-${Date.now()}`;
    try {
      const { error } = await supabase.from('resource_reports').insert({
        id: reportId,
        resource_id: report.resource_id,
        resource_name: report.resource_name,
        report_type: report.report_type,
        description: report.description,
        reporter_email: report.reporter_email || null,
        status: 'Open',
      });
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Failed to submit resource report to Supabase:', err);
      throw err;
    }
  },

  async submitPartnerResource(submission: PartnerResourceSubmission, userId?: string): Promise<string> {
    const uid = await getEffectiveUserId(userId);
    const subId = `sub-${Date.now()}`;
    try {
      const { error } = await supabase.from('partner_submissions').insert({
        id: subId,
        provider_name: submission.provider_name,
        resource_name: submission.resource_name,
        summary: submission.summary,
        category: submission.category,
        official_url: submission.official_url,
        contact_email: submission.contact_email,
        eligibility_summary: submission.eligibility_summary || null,
        coverage_area: submission.coverage_area || null,
        status: 'Pending',
        submitted_by: uid,
      });
      if (error) throw error;
      return subId;
    } catch (err) {
      console.error('Failed to submit partner resource to Supabase:', err);
      throw err;
    }
  },

  async getPartnerSubmissions(userId?: string): Promise<any[]> {
    try {
      let query = supabase.from('partner_submissions').select('*').order('submitted_at', { ascending: false });
      if (userId && !userId.startsWith('demo-')) {
        query = query.eq('submitted_by', userId);
      }
      const { data, error } = await query;
      if (!error && data) {
        return data;
      }
    } catch (err) {
      console.warn('Failed to load partner submissions from Supabase:', err);
    }
    return [];
  },

  async getAdminQueue(): Promise<{ partnerSubmissions: any[]; errorReports: any[]; staleResources: Resource[] }> {
    try {
      const [subsRes, repsRes, stalesRes] = await Promise.all([
        supabase.from('partner_submissions').select('*').order('submitted_at', { ascending: false }),
        supabase.from('resource_reports').select('*').order('created_at', { ascending: false }),
        supabase.from('resources').select('*').eq('verification_status', 'Needs Re-verification'),
      ]);
      return {
        partnerSubmissions: subsRes.data || [],
        errorReports: repsRes.data || [],
        staleResources: (stalesRes.data as Resource[]) || [],
      };
    } catch (err) {
      console.warn('Failed to load admin queue from Supabase:', err);
    }
    return {
      partnerSubmissions: [],
      errorReports: [],
      staleResources: [],
    };
  },

  async moderatePartnerSubmission(submissionId: string, newStatus: 'Approved' | 'Rejected' | 'Needs Info', notes?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('partner_submissions')
        .update({
          status: newStatus,
          notes: notes || null,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', submissionId);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Failed to moderate partner submission on Supabase:', err);
      throw err;
    }
  },

  async getAdminAuditLogs(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      if (!error && data) {
        return data;
      }
    } catch (err) {
      console.warn('Failed to fetch audit logs from Supabase:', err);
    }
    return [];
  },
};
