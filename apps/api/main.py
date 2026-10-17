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
from matching import load_resources, match_resources, ai_match_resources
import database as db

# Initialize database schema
db.init_db()

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

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "BlockBridge AI Engine",
        "ai_model": "gemini-2.5-flash",
        "database": "SQLite persistent storage",
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
    }

# --- Resources ---
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

# --- AI Recommendations ---
@app.post("/api/recommendations/ai", response_model=List[ResourceMatchSchema])
def get_ai_recommendations(intake: IntakeRequestSchema):
    """
    AI-powered recommendations using Gemini 2.5 Flash grounded in verified records.
    """
    matches = ai_match_resources(intake)
    return matches

@app.post("/api/recommendations", response_model=List[ResourceMatchSchema])
def get_recommendations(intake: IntakeRequestSchema):
    """
    Deterministic matching endpoint.
    """
    matches = match_resources(intake)
    return matches

# --- Action Plans ---
@app.post("/api/action-plans", response_model=ActionPlanSchema)
def create_action_plan(plan_in: Dict[str, Any]):
    new_id = f"plan-{int(datetime.datetime.utcnow().timestamp())}"
    now_str = datetime.datetime.utcnow().isoformat() + "Z"
    plan_record = {
        "id": new_id,
        "user_id": plan_in.get("user_id", "demo-user"),
        "title": plan_in.get("title", "Community Action Plan"),
        "goal": plan_in.get("goal", "Follow through on program application"),
        "created_at": now_str,
        "updated_at": now_str,
        "tasks": plan_in.get("tasks", [])
    }
    saved = db.save_action_plan(plan_record)
    return ActionPlanSchema(**saved)

@app.get("/api/action-plans", response_model=List[ActionPlanSchema])
def list_action_plans(user_id: Optional[str] = Query(None)):
    plans = db.get_action_plans(user_id)
    return [ActionPlanSchema(**p) for p in plans]

@app.get("/api/action-plans/{id}", response_model=ActionPlanSchema)
def get_action_plan(id: str):
    plan = db.get_action_plan_by_id(id)
    if not plan:
        raise HTTPException(status_code=404, detail="Action plan not found")
    return ActionPlanSchema(**plan)

@app.put("/api/action-plans/{id}", response_model=ActionPlanSchema)
def update_action_plan(id: str, plan_in: Dict[str, Any]):
    existing = db.get_action_plan_by_id(id)
    if not existing:
        raise HTTPException(status_code=404, detail="Action plan not found")
    
    existing["title"] = plan_in.get("title", existing["title"])
    existing["goal"] = plan_in.get("goal", existing["goal"])
    existing["tasks"] = plan_in.get("tasks", existing["tasks"])
    existing["updated_at"] = datetime.datetime.utcnow().isoformat() + "Z"

    saved = db.save_action_plan(existing)
    return ActionPlanSchema(**saved)

# --- Saved Resources ---
@app.get("/api/saved-resources")
def get_user_saved_resources(user_id: str = Query("demo-user")):
    return db.get_saved_resource_ids(user_id)

@app.post("/api/saved-resources/toggle")
def toggle_user_saved_resource(payload: Dict[str, str]):
    user_id = payload.get("user_id", "demo-user")
    resource_id = payload.get("resource_id")
    if not resource_id:
        raise HTTPException(status_code=400, detail="resource_id is required")
    is_saved = db.toggle_save_resource(user_id, resource_id)
    return {"resource_id": resource_id, "is_saved": is_saved}

# --- Resource Reports & Partner Submissions ---
@app.post("/api/resource-reports", status_code=status.HTTP_201_CREATED)
def submit_resource_report(report: ResourceReportSchema):
    report_id = db.add_report(report.dict())
    return {"message": "Report logged in moderation queue", "id": report_id}

@app.post("/api/partner/submissions", status_code=status.HTTP_201_CREATED)
def submit_partner_resource(sub: PartnerSubmissionSchema):
    sub_id = db.add_partner_submission(sub.dict())
    return {"message": "Resource submission received for review", "id": sub_id}

@app.get("/api/admin/review-queue")
def get_review_queue():
    resources = load_resources()
    stale = [r for r in resources if r.get("verification_status") == "Needs Re-verification"]
    submissions = db.get_partner_submissions()
    reports = db.get_reports()

    return {
        "partner_submissions": submissions,
        "error_reports": reports,
        "stale_resources": stale
    }

@app.post("/api/admin/partner-submissions/{id}/moderate")
def moderate_partner_submission(id: str, action: Dict[str, str]):
    new_status = action.get("status", "Approved")
    success = db.update_submission_status(id, new_status)
    if not success:
        raise HTTPException(status_code=404, detail="Submission not found")
    return {"id": id, "status": new_status}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
