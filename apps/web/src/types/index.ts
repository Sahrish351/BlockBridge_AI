export type VerificationStatus = 'Verified' | 'Needs Re-verification' | 'Unverified' | 'Retired';

export type ResourceCategory =
  | 'Food & Essential Needs'
  | 'Housing & Rental Support'
  | 'Utilities & Household Bills'
  | 'Small Business Support'
  | 'Employment & Workforce Training'
  | 'Community & Civic Services'
  | 'Education & Skills'
  | 'Other Local Support';

export interface EligibilityCriteria {
  business_stage?: string[];
  ownership?: string;
  revenue_requirement?: string;
  income_limit?: string;
  residency?: string;
  age?: string;
  requirements?: string;
  notes?: string;
  [key: string]: unknown;
}

export interface Resource {
  id: string;
  name: string;
  provider_name: string;
  summary: string;
  description: string;
  category: ResourceCategory;
  tags: string[];
  audience: string;
  coverage_type: 'Neighborhood' | 'City' | 'Regional' | 'Statewide' | 'National';
  city?: string;
  region?: string;
  postal_codes?: string[];
  official_url: string;
  application_url?: string;
  contact_details?: string;
  eligibility_criteria: EligibilityCriteria;
  required_documents: string[];
  application_method: string;
  deadline: string;
  cost_details: string;
  language_accessibility?: string;
  verification_status: VerificationStatus;
  source_checked_at: string;
  source_notes: string;
  provenance_type: string;
  created_at: string;
  updated_at: string;
}

export type MatchConfidence = 
  | 'Likely Match' 
  | 'Possible Match' 
  | 'Needs Confirmation' 
  | 'Potential Mismatch';

export interface ResourceMatch {
  resource: Resource;
  confidence: MatchConfidence;
  why_fit_reasons: string[];
  what_we_know: string[];
  what_to_confirm: string[];
  before_you_apply_docs: string[];
  next_step_action: string;
}

export type PlanStepStatus = 'Not Started' | 'In Progress' | 'Blocked' | 'Completed';

export interface PlanStep {
  id: string;
  title: string;
  description: string;
  status: PlanStepStatus;
  due_date?: string;
  source_url?: string;
  notes?: string;
  resource_id?: string;
}

export interface ActionPlan {
  id: string;
  user_id?: string;
  title: string;
  goal: string;
  created_at: string;
  updated_at: string;
  tasks: PlanStep[];
}

export interface IntakeRequest {
  user_type: 'resident' | 'small_business' | 'exploring';
  location: string;
  postal_code?: string;
  category: ResourceCategory | 'All';
  description: string;
  urgency: 'Standard' | 'Urgent' | 'Immediate Emergency';
  business_stage?: string;
}

export interface IntakeOrchestrationState {
  currentStage: 
    | 'idle' 
    | 'understanding' 
    | 'searching' 
    | 'checking_eligibility' 
    | 'building_plan' 
    | 'complete' 
    | 'error';
  stageProgress: number; // 0 to 100
  stageMessage: string;
}

export interface ResourceReportSubmission {
  resource_id: string;
  resource_name: string;
  report_type: 'broken_link' | 'outdated_deadline' | 'incorrect_eligibility' | 'wrong_location' | 'other';
  description: string;
  reporter_email?: string;
}

export interface PartnerResourceSubmission {
  provider_name: string;
  resource_name: string;
  summary: string;
  category: ResourceCategory;
  official_url: string;
  contact_email: string;
  eligibility_summary: string;
  coverage_area: string;
  notes?: string;
}

export interface UserSession {
  id: string;
  email: string;
  display_name: string;
  role: 'resident' | 'business_owner' | 'partner' | 'reviewer';
  is_demo: boolean;
}
