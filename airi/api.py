from __future__ import annotations

import os
import threading
from pathlib import Path
from typing import Dict, List, Optional

from fastapi import FastAPI, HTTPException
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


_init_agents()
app = FastAPI(title="Airi Company API")


def _append_log(msg: str):
    with log_lock:
        logs.append(msg)
        if len(logs) > 2000:
            del logs[: len(logs) - 2000]


def _process_queue():
    global llm_usage
    while True:
        task = queue.next_task()
        if not task:
            break
        target = task.assignee or task.type.capitalize()
        info = agents.get(target)
        if not info or info["status"] != "running":
            _append_log(f"No running agent for {target}, task {task.type} skipped")
            continue
        agent = info["agent"]
        info["current"] = task.model_dump()
        _append_log(f"[{agent.config.name}] handling {task.type}: {task.payload}")
        try:
            new_tasks = agent.handle_task(task)  # type: ignore
            # crude LLM usage counter: increment if developer used ask
            if task.type == "coding":
                llm_usage += 1
            if new_tasks:
                for t in new_tasks:
                    queue.add_task(t)
        except Exception as e:
            _append_log(f"[{agent.config.name}] error: {e}")
        info["last"] = task.type
        info["current"] = None
    # end while


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
    return [t.model_dump() for t in list(queue.tasks)]


@app.post("/tasks")
def create_task(task: TaskCreate):
    queue.add_task(Task(type=task.type, payload=task.payload, assignee=task.assignee))
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
    return {
        "agents": len(agents),
        "tasks_in_queue": len(queue.tasks),
        "llm_usage": llm_usage,
        "logs": logs[-20:],
    }


# health
@app.get("/")
def root():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("airi.api:app", host="0.0.0.0", port=8000, reload=True)
