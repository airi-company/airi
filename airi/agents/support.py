from __future__ import annotations

from typing import List, Optional

from airi.agents.base import Agent, AgentConfig
from airi.tasks.types import Task


class SupportAgent(Agent):
    def __init__(self, queue):
        super().__init__(AgentConfig(name="Support", role="Support", skills=["support", "triage"]), queue)

    def handle_task(self, task: Task) -> Optional[List[Task]]:
        self.log(f"Handling support: {task.payload}")
        return [Task(type="report", payload={"status": "support ready", "details": task.payload}, assignee="CEO")]
