from __future__ import annotations

from typing import List, Optional

from airi.agents.base import Agent, AgentConfig
from airi.tasks.types import Task
from airi.tools.llm.router import ask_llm


class DeveloperAgent(Agent):
    def __init__(self, queue):
        super().__init__(AgentConfig(name="Developer", role="Developer", skills=["coding", "testing"]), queue)

    def handle_task(self, task: Task) -> Optional[List[Task]]:
        self.log(f"Working on dev task: {task.payload}")
        llm_output = None
        ask = task.payload.get("ask") if isinstance(task.payload, dict) else None
        # If user already provided code/html, keep it
        if isinstance(task.payload, dict) and (task.payload.get("code") or task.payload.get("html")):
            llm_output = task.payload.get("code") or task.payload.get("html")
        elif ask:
            try:
                llm_output = ask_llm(ask, task_type="coding")
            except Exception as e:
                llm_output = f"LLM failed: {e}"
        # write back code into payload so auto-deploy can pick it up
        if isinstance(task.payload, dict) and isinstance(llm_output, str) and llm_output.strip():
            task.payload["code"] = llm_output
        # Produce report back to CEO
        return [
            Task(
                type="report",
                payload={"status": "dev done", "details": task.payload, "llm": llm_output},
                assignee="CEO",
                project_id=task.project_id,
            )
        ]
