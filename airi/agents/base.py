from __future__ import annotations

from typing import List, Optional
from pydantic import BaseModel

from airi.tasks.queue import TaskQueue
from airi.tasks.types import Task, Message


class AgentConfig(BaseModel):
    name: str
    role: str
    skills: List[str] = []


class Agent:
    """Base agent with send/receive hooks."""

    def __init__(self, config: AgentConfig, queue: TaskQueue):
        self.config = config
        self.queue = queue

    def handle_task(self, task: Task) -> Optional[List[Task]]:
        """Handle a task and optionally emit new tasks."""
        raise NotImplementedError

    def send_message(self, recipient: str, content: str) -> None:
        msg = Message(sender=self.config.name, recipient=recipient, content=content)
        self.queue.post_message(msg)

    def log(self, text: str) -> None:
        print(f"[{self.config.name}] {text}")
