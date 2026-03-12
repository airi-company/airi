from __future__ import annotations

import os
import json
import psycopg
from typing import Any, List, Dict, Optional, Tuple

DEFAULT_DSN = os.environ.get("PG_DSN", "postgresql://airi:airi@localhost:5432/airi")


def get_conn(dsn: str = DEFAULT_DSN):
    return psycopg.connect(dsn)


def init_db():
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS projects (
                    id SERIAL PRIMARY KEY,
                    name TEXT NOT NULL,
                    description TEXT,
                    status TEXT DEFAULT 'active',
                    repo_url TEXT,
                    created_at TIMESTAMPTZ DEFAULT NOW()
                );
                CREATE TABLE IF NOT EXISTS tasks (
                    id SERIAL PRIMARY KEY,
                    type TEXT NOT NULL,
                    assignee TEXT,
                    payload JSONB,
                    status TEXT DEFAULT 'queued',
                    result JSONB,
                    agent TEXT,
                    project_id INT REFERENCES projects(id) ON DELETE SET NULL,
                    created_at TIMESTAMPTZ DEFAULT NOW()
                );
                """
            )
            conn.commit()


def create_project(name: str, description: str = "", status: str = "active", repo_url: Optional[str] = None) -> Dict:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO projects (name, description, status, repo_url) VALUES (%s, %s, %s, %s) RETURNING id, name, description, status, repo_url",
                (name, description, status, repo_url),
            )
            row = cur.fetchone()
            conn.commit()
            return _project_row(row)


def list_projects() -> List[Dict]:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id, name, description, status, repo_url FROM projects ORDER BY id DESC")
            return [_project_row(r) for r in cur.fetchall()]


def create_task(type_: str, assignee: Optional[str], payload: Dict[str, Any], project_id: Optional[int]) -> Dict:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO tasks (type, assignee, payload, status, agent, project_id) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id, type, assignee, payload, status, result, agent, project_id, created_at",
                (type_, assignee, json.dumps(payload), "queued", assignee or (type_.capitalize()), project_id),
            )
            row = cur.fetchone()
            conn.commit()
            return _task_row(row)


def update_task_status(task_id: int, status: str, result: Optional[Any] = None):
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE tasks SET status=%s, result=%s WHERE id=%s",
                (status, json.dumps(result) if result is not None else None, task_id),
            )
            conn.commit()


def list_tasks() -> List[Dict]:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id, type, assignee, payload, status, result, agent, project_id, created_at FROM tasks ORDER BY id DESC")
            return [_task_row(r) for r in cur.fetchall()]


def _task_row(row: Tuple) -> Dict:
    return {
        "id": row[0],
        "type": row[1],
        "assignee": row[2],
        "payload": row[3],
        "status": row[4],
        "result": row[5],
        "agent": row[6],
        "project_id": row[7],
        "created_at": row[8].isoformat() if row[8] else None,
    }


def _project_row(row: Tuple) -> Dict:
    return {
        "id": row[0],
        "name": row[1],
        "description": row[2],
        "status": row[3],
        "repo_url": row[4],
    }
