from __future__ import annotations

from typing import List, Optional

from airi.agents.base import Agent, AgentConfig
from airi.tasks.types import Task


class AnalystAgent(Agent):
    def __init__(self, queue):
        super().__init__(AgentConfig(name="Analyst", role="Analyst", skills=["metrics", "insights"]), queue)

    def handle_task(self, task: Task) -> Optional[List[Task]]:
        self.log(f"Analyzing: {task.payload}")
        return [Task(type="report", payload={"status": "analysis ready", "details": task.payload}, assignee="CEO")]
