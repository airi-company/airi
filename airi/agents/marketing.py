from __future__ import annotations

from typing import List, Optional

from airi.agents.base import Agent, AgentConfig
from airi.tasks.types import Task


class MarketingAgent(Agent):
    def __init__(self, queue):
        super().__init__(AgentConfig(name="Marketing", role="Marketing", skills=["copy", "campaigns"]), queue)

    def handle_task(self, task: Task) -> Optional[List[Task]]:
        self.log(f"Preparing marketing: {task.payload}")
        return [Task(type="report", payload={"status": "marketing planned", "details": task.payload}, assignee="CEO")]
