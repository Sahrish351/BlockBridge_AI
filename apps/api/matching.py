import json
import os
import requests
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

from models import ResourceSchema, ResourceMatchSchema, IntakeRequestSchema

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-flash-latest")

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
    """
    Deterministic matching fallback:
    Evaluates category, user_type, and location filters against verified catalogue.
    """
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
    for r in matched_records[:4]:
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

def ai_match_resources(intake: IntakeRequestSchema) -> List[ResourceMatchSchema]:
    """
    AI-powered recommendations using Google Gemini 2.5 Flash with strict catalogue grounding.
    Only recommends genuine entries from sample-data/resources.demo.json.
    """
    resources = load_resources()
    if not resources:
        return match_resources(intake)

    if not GEMINI_API_KEY:
        print("[AI Matcher] GEMINI_API_KEY not configured. Falling back to deterministic matcher.")
        return match_resources(intake)

    # Prepare compact grounded catalogue representation
    catalogue_summary = []
    for r in resources:
        catalogue_summary.append({
            "id": r["id"],
            "name": r["name"],
            "provider_name": r["provider_name"],
            "category": r["category"],
            "summary": r["summary"],
            "audience": r["audience"],
            "coverage_type": r["coverage_type"],
            "city": r.get("city", "Atlanta"),
            "deadline": r["deadline"],
            "cost_details": r["cost_details"],
            "required_documents": r.get("required_documents", []),
            "official_url": r["official_url"]
        })

    system_instruction = (
        "You are the BlockBridge AI Civic Recommendation Engine. "
        "Your mission is to connect community members (residents and small businesses) with genuine, verified civic and community programs.\n\n"
        "CRITICAL RULES:\n"
        "1. STRICT GROUNDING: You MUST only select from the provided verified catalogue. NEVER invent, hallucinate, or recommend external programs not in the list.\n"
        "2. DIGNITY-FIRST: Frame all recommendations constructively without deficit framing or stigmatizing language.\n"
        "3. HONEST UNCERTAINTY: Clearly separate what is verified from official records from what the user MUST confirm before applying.\n"
        "4. OUTPUT FORMAT: Respond ONLY with a valid JSON array of up to 4 objects. No markdown backticks, no explanatory conversational text.\n\n"
        "Each object in the array must match this exact JSON schema:\n"
        "{\n"
        '  "resource_id": "res-001",\n'
        '  "confidence": "Likely Match" | "Possible Match",\n'
        '  "why_fit_reasons": ["Point 1 explaining fit to their specific situation", "Point 2"],\n'
        '  "what_we_know": ["Verified fact 1 from provider record", "Verified fact 2"],\n'
        '  "what_to_confirm": ["Prerequisite or question 1 to check before applying", "Question 2"],\n'
        '  "before_you_apply_docs": ["Document 1", "Document 2"],\n'
        '  "next_step_action": "Clear first step for applicant"\n'
        "}"
    )

    user_prompt = (
        f"USER INTAKE REQUEST:\n"
        f"- User Type: {intake.user_type}\n"
        f"- Description of Need: {intake.description}\n"
        f"- Location / Zip: {intake.location or 'Atlanta, GA'}\n"
        f"- Category Requested: {intake.category or 'Any'}\n"
        f"- Urgency: {intake.urgency or 'normal'}\n\n"
        f"VERIFIED CATALOGUE RECORDS (Select up to 4 best fits ONLY from this list):\n"
        f"{json.dumps(catalogue_summary, indent=2)}"
    )

    api_url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": system_instruction + "\n\n" + user_prompt}
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.2,
            "responseMimeType": "application/json"
        }
    }

    try:
        resp = requests.post(api_url, json=payload, headers={"Content-Type": "application/json"}, timeout=12)
        if resp.status_code == 200:
            data = resp.json()
            candidates = data.get("candidates", [])
            if candidates:
                raw_text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                if raw_text.strip().startswith("```"):
                    # Strip any markdown code fence if present
                    raw_text = raw_text.strip().strip("`")
                    if raw_text.startswith("json"):
                        raw_text = raw_text[4:].strip()
                
                parsed_matches = json.loads(raw_text)
                if isinstance(parsed_matches, list):
                    # Map to resource schema
                    res_map = {r["id"]: r for r in resources}
                    final_results: List[ResourceMatchSchema] = []
                    
                    for item in parsed_matches:
                        rid = item.get("resource_id")
                        if rid in res_map:
                            res_obj = res_map[rid]
                            final_results.append(ResourceMatchSchema(
                                resource=ResourceSchema(**res_obj),
                                confidence=item.get("confidence", "Likely Match"),
                                why_fit_reasons=item.get("why_fit_reasons", [f"Fits user inquiry for {res_obj['category']}."]),
                                what_we_know=item.get("what_we_know", [f"Verified via {res_obj['provider_name']}"]),
                                what_to_confirm=item.get("what_to_confirm", ["Confirm current cohort intake requirements."]),
                                before_you_apply_docs=item.get("before_you_apply_docs", res_obj.get("required_documents", [])[:3]),
                                next_step_action=item.get("next_step_action", f"Visit official site at {res_obj['provider_name']}")
                            ))

                    if final_results:
                        return final_results
        else:
            print(f"[AI Matcher] Gemini API returned status {resp.status_code}: {resp.text[:200]}")
    except Exception as e:
        print(f"[AI Matcher] Gemini call failed with error: {e}. Falling back to deterministic matcher.")

    # Seamless deterministic fallback
    return match_resources(intake)
