import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "BlockBridge AI Engine" in data["service"]

def test_get_resources():
    response = client.get("/api/resources")
    assert response.status_code == 200
    resources = response.json()
    assert len(resources) >= 12
    # Verify required schema fields
    first = resources[0]
    assert "id" in first
    assert "name" in first
    assert "provider_name" in first
    assert "official_url" in first
    assert "verification_status" in first

def test_filter_resources_by_category():
    response = client.get("/api/resources?category=Small Business Support")
    assert response.status_code == 200
    resources = response.json()
    assert len(resources) > 0
    for r in resources:
        assert r["category"] == "Small Business Support"

def test_search_resources():
    response = client.get("/api/resources?search=Russell")
    assert response.status_code == 200
    resources = response.json()
    assert len(resources) > 0
    assert any("Russell" in r["name"] or "Russell" in r["provider_name"] for r in resources)

def test_get_resource_by_id():
    response = client.get("/api/resources/res-001")
    assert response.status_code == 200
    assert response.json()["id"] == "res-001"

    # Non-existent
    response_404 = client.get("/api/resources/res-nonexistent-999")
    assert response_404.status_code == 404

def test_recommendations_endpoint():
    intake = {
        "user_type": "small_business",
        "description": "I need commercial kitchen equipment grant funding in West End Atlanta",
        "location": "30310",
        "category": "Small Business Support",
        "urgency": "normal"
    }
    response = client.post("/api/recommendations", json=intake)
    assert response.status_code == 200
    matches = response.json()
    assert len(matches) > 0
    first = matches[0]
    assert "resource" in first
    assert "why_fit_reasons" in first
    assert "what_we_know" in first
    assert "what_to_confirm" in first
    assert "next_step_action" in first

def test_action_plan_crud():
    new_plan = {
        "title": "West End Coffee Shop Expansion",
        "goal": "Obtain $25k grant and secure commercial lease",
        "user_id": "test-user-123",
        "tasks": [
            {
                "id": "t1",
                "title": "Gather 2025 Profit & Loss statement",
                "description": "Export signed PDF from accountant",
                "status": "In Progress"
            }
        ]
    }
    create_resp = client.post("/api/action-plans", json=new_plan)
    assert create_resp.status_code == 200
    created = create_resp.json()
    assert "id" in created
    plan_id = created["id"]
    assert created["title"] == new_plan["title"]

    # Retrieve by ID
    get_resp = client.get(f"/api/action-plans/{plan_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == plan_id

def test_admin_authorization_enforcement():
    # Unauthorized request (no admin role header)
    unauth_resp = client.get("/api/admin/review-queue")
    assert unauth_resp.status_code == 403
    assert "Administrator role authorization required" in unauth_resp.json()["detail"]

    # Authorized request (with X-User-Role: admin)
    auth_resp = client.get("/api/admin/review-queue", headers={"X-User-Role": "admin"})
    assert auth_resp.status_code == 200
    queue = auth_resp.json()
    assert "partner_submissions" in queue
    assert "error_reports" in queue
    assert "stale_resources" in queue

def test_partner_submission_workflow():
    submission = {
        "provider_name": "Test Atlanta Community CDFI",
        "resource_name": "Neighborhood Small Business Micro-Grant",
        "summary": "Direct $5,000 working capital assistance for local storefronts.",
        "category": "Small Business Support",
        "official_url": "https://www.atlantacdfi.org/micro-grant",
        "contact_email": "grants@atlantacdfi.org",
        "eligibility_summary": "Operated for 1+ years in Fulton County.",
        "coverage_area": "Fulton County"
    }
    resp = client.post("/api/partner/submissions", json=submission)
    assert resp.status_code == 201
    assert "id" in resp.json()
    sub_id = resp.json()["id"]

    # Moderate as admin
    mod_resp = client.post(
        f"/api/admin/partner-submissions/{sub_id}/moderate",
        json={"status": "Approved"},
        headers={"X-User-Role": "admin"}
    )
    assert mod_resp.status_code == 200
    assert mod_resp.json()["status"] == "Approved"
