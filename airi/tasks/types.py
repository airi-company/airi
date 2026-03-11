from __future__ import annotations

from typing import Any, Optional
from pydantic import BaseModel


class Task(BaseModel):
    type: str
    payload: dict[str, Any] = {}
    assignee: Optional[str] = None  # agent name


class Message(BaseModel):
    sender: str
    recipient: str
    content: str
