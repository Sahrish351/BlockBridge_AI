import sqlite3
import json
import os
import datetime
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(__file__), "blockbridge.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS action_plans (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        goal TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        tasks_json TEXT NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS saved_resources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        resource_id TEXT NOT NULL,
        created_at TEXT NOT NULL,
        UNIQUE(user_id, resource_id)
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS resource_reports (
        id TEXT PRIMARY KEY,
        resource_id TEXT NOT NULL,
        resource_name TEXT NOT NULL,
        report_type TEXT NOT NULL,
        description TEXT NOT NULL,
        reporter_email TEXT,
        created_at TEXT NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS partner_submissions (
        id TEXT PRIMARY KEY,
        provider_name TEXT NOT NULL,
        resource_name TEXT NOT NULL,
        summary TEXT NOT NULL,
        category TEXT NOT NULL,
        official_url TEXT NOT NULL,
        contact_email TEXT NOT NULL,
        eligibility_summary TEXT,
        coverage_area TEXT,
        status TEXT NOT NULL,
        submitted_at TEXT NOT NULL
    );
    """)

    conn.commit()
    conn.close()


def save_action_plan(plan: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT OR REPLACE INTO action_plans (id, user_id, title, goal, created_at, updated_at, tasks_json)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        plan["id"],
        plan.get("user_id", "demo-user"),
        plan["title"],
        plan["goal"],
        plan["created_at"],
        plan["updated_at"],
        json.dumps(plan.get("tasks", []))
    ))
    conn.commit()
    conn.close()
    return plan

def get_action_plans(user_id: Optional[str] = None) -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    if user_id:
        cursor.execute("SELECT * FROM action_plans WHERE user_id = ? ORDER BY updated_at DESC", (user_id,))
    else:
        cursor.execute("SELECT * FROM action_plans ORDER BY updated_at DESC")
    rows = cursor.fetchall()
    conn.close()
    
    results = []
    for r in rows:
        results.append({
            "id": r["id"],
            "user_id": r["user_id"],
            "title": r["title"],
            "goal": r["goal"],
            "created_at": r["created_at"],
            "updated_at": r["updated_at"],
            "tasks": json.loads(r["tasks_json"])
        })
    return results

def get_action_plan_by_id(plan_id: str) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM action_plans WHERE id = ?", (plan_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return None
    return {
        "id": row["id"],
        "user_id": row["user_id"],
        "title": row["title"],
        "goal": row["goal"],
        "created_at": row["created_at"],
        "updated_at": row["updated_at"],
        "tasks": json.loads(row["tasks_json"])
    }


def toggle_save_resource(user_id: str, resource_id: str) -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM saved_resources WHERE user_id = ? AND resource_id = ?", (user_id, resource_id))
    existing = cursor.fetchone()
    if existing:
        cursor.execute("DELETE FROM saved_resources WHERE id = ?", (existing["id"],))
        conn.commit()
        conn.close()
        return False
    else:
        cursor.execute("""
        INSERT INTO saved_resources (user_id, resource_id, created_at)
        VALUES (?, ?, ?)
        """, (user_id, resource_id, datetime.datetime.utcnow().isoformat() + "Z"))
        conn.commit()
        conn.close()
        return True

def get_saved_resource_ids(user_id: str) -> List[str]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT resource_id FROM saved_resources WHERE user_id = ?", (user_id,))
    rows = cursor.fetchall()
    conn.close()
    return [r["resource_id"] for r in rows]


def add_report(report: Dict[str, Any]) -> str:
    conn = get_connection()
    cursor = conn.cursor()
    report_id = f"rep-{int(datetime.datetime.utcnow().timestamp())}"
    now_str = datetime.datetime.utcnow().isoformat() + "Z"
    cursor.execute("""
    INSERT INTO resource_reports (id, resource_id, resource_name, report_type, description, reporter_email, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        report_id,
        report["resource_id"],
        report["resource_name"],
        report["report_type"],
        report["description"],
        report.get("reporter_email", ""),
        now_str
    ))
    conn.commit()
    conn.close()
    return report_id

def get_reports() -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM resource_reports ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]


def add_partner_submission(sub: Dict[str, Any]) -> str:
    conn = get_connection()
    cursor = conn.cursor()
    sub_id = f"sub-{int(datetime.datetime.utcnow().timestamp())}"
    today_str = datetime.date.today().isoformat()
    cursor.execute("""
    INSERT INTO partner_submissions (id, provider_name, resource_name, summary, category, official_url, contact_email, eligibility_summary, coverage_area, status, submitted_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        sub_id,
        sub["provider_name"],
        sub["resource_name"],
        sub["summary"],
        sub["category"],
        sub["official_url"],
        sub["contact_email"],
        sub.get("eligibility_summary", ""),
        sub.get("coverage_area", "Atlanta Metro"),
        "Pending",
        today_str
    ))
    conn.commit()
    conn.close()
    return sub_id

def get_partner_submissions() -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM partner_submissions ORDER BY submitted_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def update_submission_status(sub_id: str, new_status: str) -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE partner_submissions SET status = ? WHERE id = ?", (new_status, sub_id))
    rows_affected = cursor.rowcount
    conn.commit()
    conn.close()
    return rows_affected > 0

