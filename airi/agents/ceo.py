from __future__ import annotations

from typing import List, Optional

from airi.agents.base import Agent, AgentConfig
from airi.tasks.types import Task


class CEOAgent(Agent):
    def __init__(self, queue):
        super().__init__(AgentConfig(name="CEO", role="CEO", skills=["planning", "coordination"]), queue)

    def handle_task(self, task: Task) -> Optional[List[Task]]:
        new_tasks: List[Task] = []
        # If kickoff/plan: fan out to all
        if task.type in ("plan", "kickoff"):
            self.log("Distributing tasks to team")
            new_tasks.append(Task(type="coding", payload={"feature": "MVP skeleton"}, assignee="Developer"))
            new_tasks.append(Task(type="marketing", payload={"message": "Announce MVP"}, assignee="Marketing"))
            new_tasks.append(Task(type="analysis", payload={"metric": "MVP readiness"}, assignee="Analyst"))
            new_tasks.append(Task(type="support", payload={"channel": "early users"}, assignee="Support"))
            return new_tasks

        # Default: forward to Dev for implementation
        self.log(f"Forwarding task to Developer: {task.payload}")
        new_tasks.append(Task(type="coding", payload=task.payload, assignee="Developer", project_id=task.project_id))
        return new_tasks
