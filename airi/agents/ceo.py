from __future__ import annotations

from typing import List, Optional

from airi.agents.base import Agent, AgentConfig
from airi.tasks.types import Task


class CEOAgent(Agent):
    def __init__(self, queue):
        super().__init__(AgentConfig(name="CEO", role="CEO", skills=["planning", "coordination"]), queue)

    def handle_task(self, task: Task) -> Optional[List[Task]]:
        # Distribute tasks to specialized agents based on type
        new_tasks: List[Task] = []
        if task.type == "plan" or task.type == "kickoff":
            self.log("Distributing tasks to team")
            new_tasks.append(Task(type="dev", payload={"feature": "MVP skeleton"}, assignee="Developer"))
            new_tasks.append(Task(type="marketing", payload={"message": "Announce MVP"}, assignee="Marketing"))
            new_tasks.append(Task(type="analysis", payload={"metric": "MVP readiness"}, assignee="Analyst"))
            new_tasks.append(Task(type="support", payload={"channel": "early users"}, assignee="Support"))
        else:
            self.log(f"No routing rule for task type {task.type}")
        return new_tasks or None
