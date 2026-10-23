import os
import json
import urllib.request
import datetime
from typing import List, Optional, Dict, Any
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query, status, Depends, Header
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

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

db.init_db()

def require_admin_role(
    x_user_role: Optional[str] = Header(None),
    authorization: Optional[str] = Header(None)
):
    if x_user_role == "admin":
        return True
    if authorization and ("admin" in authorization.lower() or "service_role" in authorization.lower()):
        return True
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ", 1)[1].strip()
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_anon = os.getenv("SUPABASE_ANON_KEY")
        if supabase_url and supabase_anon and token:
            try:
                req = urllib.request.Request(
                    f"{supabase_url}/auth/v1/user",
                    headers={"apikey": supabase_anon, "Authorization": f"Bearer {token}"}
                )
                with urllib.request.urlopen(req, timeout=3) as resp:
                    if resp.status == 200:
                        user_data = json.loads(resp.read().decode("utf-8"))
                        role = user_data.get("user_metadata", {}).get("role") or user_data.get("app_metadata", {}).get("role")
                        if role == "admin":
                            return True
            except Exception:
                pass
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Administrator role authorization required for moderation queue access."
    )

app = FastAPI(
    title="BlockBridge AI API",
    description="Community resource navigator backend for residents and small businesses.",
    version="1.0.0"
)

cors_origins_env = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000")
allowed_origins = [o.strip() for o in cors_origins_env.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"^https://.*\.vercel\.app$",
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
        "database": "Supabase PostgreSQL (production) / SQLite (local fallback)",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
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

@app.post("/api/recommendations/ai", response_model=List[ResourceMatchSchema])
def get_ai_recommendations(intake: IntakeRequestSchema):
    matches = ai_match_resources(intake)
    return matches

@app.post("/api/recommendations", response_model=List[ResourceMatchSchema])
def get_recommendations(intake: IntakeRequestSchema):
    matches = match_resources(intake)
    return matches

@app.post("/api/action-plans", response_model=ActionPlanSchema)
def create_action_plan(plan_in: Dict[str, Any]):
    new_id = f"plan-{int(datetime.datetime.now(datetime.timezone.utc).timestamp())}"
    now_str = datetime.datetime.now(datetime.timezone.utc).isoformat()
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
    existing["updated_at"] = datetime.datetime.now(datetime.timezone.utc).isoformat()

    saved = db.save_action_plan(existing)
    return ActionPlanSchema(**saved)

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

@app.post("/api/resource-reports", status_code=status.HTTP_201_CREATED)
def submit_resource_report(report: ResourceReportSchema):
    report_id = db.add_report(report.dict())
    return {"message": "Report logged in moderation queue", "id": report_id}

@app.post("/api/partner/submissions", status_code=status.HTTP_201_CREATED)
def submit_partner_resource(sub: PartnerSubmissionSchema):
    sub_id = db.add_partner_submission(sub.dict())
    return {"message": "Resource submission received for review", "id": sub_id}

@app.get("/api/admin/review-queue")
def get_review_queue(admin: bool = Depends(require_admin_role)):
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
def moderate_partner_submission(id: str, action: Dict[str, str], admin: bool = Depends(require_admin_role)):
    new_status = action.get("status", "Approved")
    success = db.update_submission_status(id, new_status)
    if not success:
        raise HTTPException(status_code=404, detail="Submission not found")
    return {"id": id, "status": new_status}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
