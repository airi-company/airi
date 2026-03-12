from __future__ import annotations

import threading
from pathlib import Path
from typing import Dict, List, Optional
import requests
import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi import Body

from airi.tasks.queue import TaskQueue
from airi.tasks.types import Task, Message
from airi.agents.ceo import CEOAgent
from airi.agents.developer import DeveloperAgent
from airi.agents.marketing import MarketingAgent
from airi.agents.analyst import AnalystAgent
from airi.agents.support import SupportAgent
from airi.tools.llm.router import ask_llm
from airi import db
from airi import deploy

# Global state
queue = TaskQueue()
log_lock = threading.Lock()
logs: List[str] = []
llm_usage: int = 0
memory_dir = Path(__file__).resolve().parent.parent / "memory"
memory_dir.mkdir(exist_ok=True)
# task tracking
tasks_state: List[Dict] = []  # kept only for in-process queue refs
# projects
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")
GITHUB_ORG = os.environ.get("GITHUB_ORG", "airi-company")


class AgentState(BaseModel):
    name: str
    status: str  # idle/running/stopped
    current_task: Optional[dict]
    last_activity: Optional[str]


class TaskCreate(BaseModel):
    type: str
    payload: dict = {}
    assignee: Optional[str] = None
    project_id: Optional[int] = None


class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = ""
    status: Optional[str] = "active"
    create_repo: bool = True
    demo_url: Optional[str] = None
    branch: Optional[str] = "main"


class AgentControl(BaseModel):
    name: str


def _init_agents():
    global agents
    agents = {
        "CEO": {"agent": CEOAgent(queue), "status": "running", "current": None, "last": None},
        "Developer": {"agent": DeveloperAgent(queue), "status": "running", "current": None, "last": None},
        "Marketing": {"agent": MarketingAgent(queue), "status": "running", "current": None, "last": None},
        "Analyst": {"agent": AnalystAgent(queue), "status": "running", "current": None, "last": None},
        "Support": {"agent": SupportAgent(queue), "status": "running", "current": None, "last": None},
    }


def _append_log(msg: str):
    with log_lock:
        logs.append(msg)
        if len(logs) > 2000:
            del logs[: len(logs) - 2000]


def _add_task_record(task: Task):
    rec = db.create_task(task.type, task.assignee, task.payload, task.project_id)
    tasks_state.append(rec)
    queue.add_task(rec["id"], task)


def _mark_task(task_id: int, status: str, result=None):
    db.update_task_status(task_id, status, result)
    for t in tasks_state:
        if t["id"] == task_id:
            t["status"] = status
            if result is not None:
                t["result"] = result
            return


def _extract_code(payload: dict) -> Optional[str]:
    for k in ["code", "html", "ask"]:
        v = payload.get(k)
        if isinstance(v, str) and len(v.strip()) > 0:
            return v
    # fallback: push entire payload as json string so coding tasks always write something
    try:
        import json
        return json.dumps(payload, ensure_ascii=False, indent=2)
    except Exception:
        return None


def _auto_deploy(task: Task, task_id: int):
    if task.type != "coding":
        return
    if not task.project_id:
        return
    proj = db.get_project(task.project_id)
    if not proj or not proj.get("repo_url"):
        return
    repo = proj["repo_url"]
    branch = proj.get("branch") or "main"
    content = _extract_code(task.payload)
    if not content:
        return
    try:
        deploy.deploy_static(repo, branch, content, filename="index.html")
    except Exception as e:
        _append_log(f"auto deploy failed for task {task_id}: {e}")
        return


def _process_queue():
    global llm_usage
    while True:
        item = queue.next_task()
        if not item:
            break
        task_id, task = item
        _mark_task(task_id, "running")
        target = task.assignee or task.type.capitalize()
        info = agents.get(target)
        if not info or info["status"] != "running":
            _append_log(f"No running agent for {target}, task {task.type} skipped")
            _mark_task(task_id, "error", result="agent not running")
            continue
        agent = info["agent"]
        info["current"] = task.model_dump()
        _append_log(f"[{agent.config.name}] handling {task.type}: {task.payload}")
        try:
            new_tasks = agent.handle_task(task)  # type: ignore
            if task.type == "coding":
                llm_usage += 1
            if new_tasks:
                for t in new_tasks:
                    _add_task_record(t)
            _mark_task(task_id, "done", result=task.payload)
            _auto_deploy(task, task_id)
        except Exception as e:
            _append_log(f"[{agent.config.name}] error: {e}")
            _mark_task(task_id, "error", result=str(e))
        info["last"] = task.type
        info["current"] = None
    # end while


def _create_repo(project_name: str) -> Optional[str]:
    if not GITHUB_TOKEN or not GITHUB_ORG:
        return None
    repo_name = project_name.lower().replace(" ", "-")
    url = f"https://api.github.com/orgs/{GITHUB_ORG}/repos"
    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github+json",
    }
    payload = {"name": repo_name, "private": False}
    try:
        resp = requests.post(url, headers=headers, json=payload, timeout=15)
        if resp.status_code in (200, 201):
            return resp.json().get("html_url")
        if resp.status_code == 422:
            return f"https://github.com/{GITHUB_ORG}/{repo_name}"
        return None
    except Exception:
        return None


def _add_project(project: ProjectCreate) -> Dict:
    repo_url = _create_repo(project.name) if project.create_repo else None
    rec = db.create_project(project.name, project.description or "", project.status or "active", repo_url, project.demo_url, project.branch or "main")
    return rec


_init_agents()
db.init_db()
app = FastAPI(title="Airi Company API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/agents", response_model=List[AgentState])
def get_agents():
    out: List[AgentState] = []
    for name, info in agents.items():
        out.append(
            AgentState(
                name=name,
                status=info["status"],
                current_task=info.get("current"),
                last_activity=info.get("last"),
            )
        )
    return out


@app.post("/agents/start")
def start_agent(payload: AgentControl = Body(...)):
    name = payload.name
    if name not in agents:
        raise HTTPException(404, "agent not found")
    agents[name]["status"] = "running"
    return {"ok": True}


@app.post("/agents/stop")
def stop_agent(payload: AgentControl = Body(...)):
    name = payload.name
    if name not in agents:
        raise HTTPException(404, "agent not found")
    agents[name]["status"] = "stopped"
    return {"ok": True}


@app.get("/tasks")
def get_tasks():
    return db.list_tasks()


@app.post("/tasks")
def create_task(task: TaskCreate):
    _add_task_record(Task(type=task.type, payload=task.payload, assignee=task.assignee, project_id=task.project_id))
    _process_queue()
    return {"ok": True}


@app.get("/projects")
def get_projects():
    return db.list_projects()


@app.post("/projects")
def create_project(project: ProjectCreate):
    rec = _add_project(project)
    return rec


@app.get("/logs")
def get_logs():
    with log_lock:
        return {"logs": logs[-500:]}


@app.get("/memory")
def list_memory():
    entries = []
    for p in memory_dir.glob("**/*"):
        if p.is_file():
            try:
                entries.append({"path": str(p.relative_to(memory_dir)), "content": p.read_text()[:5000]})
            except Exception:
                continue
    return {"files": entries}


@app.get("/dashboard")
def dashboard():
    running = len([a for a in agents.values() if a["status"] == "running"])
    projects_count = 0
    try:
        projects_count = len(db.list_projects())
    except Exception as e:
        _append_log(f"dashboard projects error: {e}")
    return {
        "agents": running,
        "tasks_in_queue": len(queue.tasks),
        "llm_usage": llm_usage,
        "logs": logs[-20:],
        "projects": projects_count,
    }


@app.get("/")
def root():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("airi.api:app", host="0.0.0.0", port=8000, reload=True)
