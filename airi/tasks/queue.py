from __future__ import annotations

from collections import deque
from typing import Deque, List, Optional, Tuple

from airi.tasks.types import Task, Message


class TaskQueue:
    def __init__(self):
        # store (task_id, Task)
        self.tasks: Deque[Tuple[int, Task]] = deque()
        self.messages: Deque[Message] = deque()

    def add_task(self, task_id: int, task: Task) -> None:
        self.tasks.append((task_id, task))

    def next_task(self) -> Optional[Tuple[int, Task]]:
        if self.tasks:
            return self.tasks.popleft()
        return None

    def post_message(self, message: Message) -> None:
        self.messages.append(message)

    def collect_messages_for(self, recipient: str) -> List[Message]:
        out: List[Message] = []
        keep: Deque[Message] = deque()
        while self.messages:
            msg = self.messages.popleft()
            if msg.recipient == recipient:
                out.append(msg)
            else:
                keep.append(msg)
        self.messages = keep
        return out
