from __future__ import annotations

from pathlib import Path
from typing import Optional


def write_file(path: str, content: str) -> None:
    p = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content, encoding="utf-8")


def read_file(path: str) -> Optional[str]:
    p = Path(path)
    if not p.exists():
        return None
    return p.read_text(encoding="utf-8")
