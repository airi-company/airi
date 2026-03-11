from __future__ import annotations

import threading
from pathlib import Path
from typing import Dict, List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from airi.tasks.queue import TaskQueue
from airi.tasks.types import Task, Message
from airi.agents.ceo import CEOAgent
from airi.agents.developer import DeveloperAgent
from airi.agents.marketing import MarketingAgent
from airi.agents.analyst import AnalystAgent
from airi.agents.support import SupportAgent
from airi.tools.llm.router import ask_llm

# Global state
queue = TaskQueue()
log_lock = threading.Lock()
logs: List[str] = []
llm_usage: int = 0
memory_dir = Path(__file__).resolve().parent.parent / "memory"
memory_dir.mkdir(exist_ok=True)
# task tracking
_task_counter = 0
# each: {id, type, assignee, payload, status, result, agent, output}
tasks_state: List[Dict] = []


class AgentState(BaseModel):
    name: str
    status: str  # idle/running/stopped
    current_task: Optional[dict]
    last_activity: Optional[str]


class TaskCreate(BaseModel):
    type: str
    payload: dict = {}
    assignee: Optional[str] = None


agents: Dict[str, Dict] = {}


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
    global _task_counter
    _task_counter += 1
    record = {
        "id": _task_counter,
        "type": task.type,
        "assignee": task.assignee,
        "payload": task.payload,
        "status": "queued",
        "result": None,
        "agent": task.assignee or task.type.capitalize(),
    }
    tasks_state.append(record)
    queue.add_task(_task_counter, task)


def _mark_task(task_id: int, status: str, result=None):
    for t in tasks_state:
        if t["id"] == task_id:
            t["status"] = status
            if result is not None:
                t["result"] = result
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
        except Exception as e:
            _append_log(f"[{agent.config.name}] error: {e}")
            _mark_task(task_id, "error", result=str(e))
        info["last"] = task.type
        info["current"] = None
    # end while


_init_agents()
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
def start_agent(name: str):
    if name not in agents:
        raise HTTPException(404, "agent not found")
    agents[name]["status"] = "running"
    return {"ok": True}


@app.post("/agents/stop")
def stop_agent(name: str):
    if name not in agents:
        raise HTTPException(404, "agent not found")
    agents[name]["status"] = "stopped"
    return {"ok": True}


@app.get("/tasks")
def get_tasks():
    return tasks_state


@app.post("/tasks")
def create_task(task: TaskCreate):
    _add_task_record(Task(type=task.type, payload=task.payload, assignee=task.assignee))
    _process_queue()
    return {"ok": True}


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
    return {
        "agents": running,
        "tasks_in_queue": len(queue.tasks),
        "llm_usage": llm_usage,
        "logs": logs[-20:],
    }


@app.get("/")
def root():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("airi.api:app", host="0.0.0.0", port=8000, reload=True)
