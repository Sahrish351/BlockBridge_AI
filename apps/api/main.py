from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict, Any
import datetime

from models import (
    ResourceSchema, 
    IntakeRequestSchema, 
    ResourceMatchSchema, 
    ActionPlanSchema, 
    PlanStepSchema,
    ResourceReportSchema,
    PartnerSubmissionSchema
)
from matching import load_resources, match_resources

app = FastAPI(
    title="BlockBridge AI API",
    description="Community resource navigator backend for residents and small businesses.",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory stores for runtime
REPORTS_DB: List[Dict[str, Any]] = []
PARTNER_SUBMISSIONS_DB: List[Dict[str, Any]] = []
ACTION_PLANS_DB: List[Dict[str, Any]] = []

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "BlockBridge AI Engine",
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
    }

@app.get("/api/resources", response_model=List[ResourceSchema])
def get_resources(
    category: Optional[str] = Query(None),
    coverage: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    resources = load_resources()
    filtered = resources

    if category and category != "All":
        filtered = [r for r in filtered if r.get("category") == category]
    if coverage and coverage != "All":
        filtered = [r for r in filtered if r.get("coverage_type") == coverage]
    if status and status != "All":
        filtered = [r for r in filtered if r.get("verification_status") == status]
    if search and search.strip():
        q = search.lower().strip()
        filtered = [
            r for r in filtered
            if q in r.get("name", "").lower()
            or q in r.get("provider_name", "").lower()
            or q in r.get("summary", "").lower()
            or any(q in t.lower() for t in r.get("tags", []))
        ]

    return [ResourceSchema(**r) for r in filtered]

@app.get("/api/resources/{id}", response_model=ResourceSchema)
def get_resource_by_id(id: str):
    resources = load_resources()
    for r in resources:
        if r.get("id") == id:
            return ResourceSchema(**r)
    raise HTTPException(status_code=404, detail="Resource not found")

@app.post("/api/recommendations", response_model=List[ResourceMatchSchema])
def get_recommendations(intake: IntakeRequestSchema):
    matches = match_resources(intake)
    return matches

@app.post("/api/action-plans", response_model=ActionPlanSchema)
def create_action_plan(plan_in: Dict[str, Any]):
    new_id = f"plan-{int(datetime.datetime.utcnow().timestamp())}"
    plan_record = {
        "id": new_id,
        "user_id": plan_in.get("user_id", "demo-user"),
        "title": plan_in.get("title", "Community Action Plan"),
        "goal": plan_in.get("goal", "Follow through on program application"),
        "created_at": datetime.datetime.utcnow().isoformat() + "Z",
        "updated_at": datetime.datetime.utcnow().isoformat() + "Z",
        "tasks": plan_in.get("tasks", [])
    }
    ACTION_PLANS_DB.append(plan_record)
    return ActionPlanSchema(**plan_record)

@app.get("/api/action-plans", response_model=List[ActionPlanSchema])
def list_action_plans():
    return [ActionPlanSchema(**p) for p in ACTION_PLANS_DB]

@app.post("/api/resource-reports", status_code=status.HTTP_201_CREATED)
def submit_resource_report(report: ResourceReportSchema):
    record = report.dict()
    record["id"] = f"rep-{len(REPORTS_DB) + 1}"
    record["created_at"] = datetime.datetime.utcnow().isoformat() + "Z"
    REPORTS_DB.append(record)
    return {"message": "Report logged in moderation queue", "id": record["id"]}

@app.post("/api/partner/submissions", status_code=status.HTTP_201_CREATED)
def submit_partner_resource(sub: PartnerSubmissionSchema):
    record = sub.dict()
    record["id"] = f"sub-{len(PARTNER_SUBMISSIONS_DB) + 1}"
    record["status"] = "Pending"
    record["submitted_at"] = datetime.date.today().isoformat()
    PARTNER_SUBMISSIONS_DB.append(record)
    return {"message": "Resource submission received for review", "id": record["id"]}

@app.get("/api/admin/review-queue")
def get_review_queue():
    resources = load_resources()
    stale = [r for r in resources if r.get("verification_status") == "Needs Re-verification"]
    return {
        "partner_submissions": PARTNER_SUBMISSIONS_DB,
        "error_reports": REPORTS_DB,
        "stale_resources": stale
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
