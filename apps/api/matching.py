import json
import os
from typing import List, Dict, Any, Optional
from models import ResourceSchema, ResourceMatchSchema, IntakeRequestSchema

SAMPLE_DATA_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
    "sample-data",
    "resources.demo.json"
)

def load_resources() -> List[Dict[str, Any]]:
    if os.path.exists(SAMPLE_DATA_PATH):
        with open(SAMPLE_DATA_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def match_resources(intake: IntakeRequestSchema) -> List[ResourceMatchSchema]:
    resources = load_resources()
    desc = intake.description.lower()
    is_sb = intake.user_type == "small_business" or "business" in desc or "startup" in desc

    matched_records = []
    for r in resources:
        if is_sb:
            if r["category"] in ["Small Business Support", "Employment & Workforce Training"]:
                matched_records.append(r)
        else:
            if intake.category and intake.category != "All":
                if r["category"] == intake.category or r["category"] == "Community & Civic Services":
                    matched_records.append(r)
            else:
                if r["category"] != "Small Business Support":
                    matched_records.append(r)

    if not matched_records:
        matched_records = resources[:4]

    results: List[ResourceMatchSchema] = []
    for r in matched_records:
        why_fit = []
        what_we_know = []
        what_to_confirm = []

        if is_sb:
            why_fit.append(f"Provides verified support for businesses in {r.get('city') or 'your area'}.")
            why_fit.append(f"Direct community program via {r['provider_name']}.")
            what_we_know.append(f"Application method: {r['application_method']}")
            what_we_know.append(f"Deadline: {r['deadline']}")
            what_to_confirm.append("Confirm active business license and tax status with City of Atlanta.")
            what_to_confirm.append("Verify whether revenue tenure requirements match your business stage.")
        else:
            why_fit.append(f"Serves community members needing {r['category'].lower()}.")
            why_fit.append(f"Verified official portal at {r['official_url']}.")
            what_we_know.append(f"Program cost: {r['cost_details']}")
            what_we_know.append(f"Application method: {r['application_method']}")
            what_to_confirm.append("Confirm household gross income limits and proof of address.")
            what_to_confirm.append("Verify current intake hours with provider before visiting.")

        confidence = "Likely Match" if r["verification_status"] == "Verified" else "Possible Match"

        match = ResourceMatchSchema(
            resource=ResourceSchema(**r),
            confidence=confidence,
            why_fit_reasons=why_fit,
            what_we_know=what_we_know,
            what_to_confirm=what_to_confirm,
            before_you_apply_docs=r.get("required_documents", [])[:3],
            next_step_action=f"Review prerequisites and visit official portal at {r['provider_name']}"
        )
        results.append(match)

    return results
