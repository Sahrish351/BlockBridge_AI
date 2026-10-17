from pydantic import BaseModel, Field, HttpUrl
from typing import List, Optional, Dict, Any
from datetime import datetime

class ResourceSchema(BaseModel):
    id: str
    name: str
    provider_name: str
    summary: str
    description: str
    category: str
    tags: List[str] = []
    audience: str
    coverage_type: str
    city: Optional[str] = None
    region: Optional[str] = None
    postal_codes: Optional[List[str]] = None
    official_url: str
    application_url: Optional[str] = None
    contact_details: Optional[str] = None
    eligibility_criteria: Dict[str, Any] = {}
    required_documents: List[str] = []
    application_method: str
    deadline: str
    cost_details: str
    language_accessibility: Optional[str] = None
    verification_status: str
    source_checked_at: str
    source_notes: str
    provenance_type: str
    created_at: str
    updated_at: str

class IntakeRequestSchema(BaseModel):
    user_type: str = Field(..., description="'resident' or 'small_business'")
    location: str
    postal_code: Optional[str] = None
    category: Optional[str] = "All"
    description: str
    urgency: Optional[str] = "Standard"

class ResourceMatchSchema(BaseModel):
    resource: ResourceSchema
    confidence: str
    why_fit_reasons: List[str]
    what_we_know: List[str]
    what_to_confirm: List[str]
    before_you_apply_docs: List[str]
    next_step_action: str

class PlanStepSchema(BaseModel):
    id: str
    title: str
    description: str
    status: str = "Not Started"
    due_date: Optional[str] = None
    source_url: Optional[str] = None
    notes: Optional[str] = None
    resource_id: Optional[str] = None

class ActionPlanSchema(BaseModel):
    id: str
    user_id: Optional[str] = "demo-user"
    title: str
    goal: str
    created_at: str
    updated_at: str
    tasks: List[PlanStepSchema]

class ResourceReportSchema(BaseModel):
    resource_id: str
    resource_name: str
    report_type: str
    description: str
    reporter_email: Optional[str] = None

class PartnerSubmissionSchema(BaseModel):
    provider_name: str
    resource_name: str
    summary: str
    category: str
    official_url: str
    contact_email: str
    eligibility_summary: str
    coverage_area: str
    notes: Optional[str] = None
