from __future__ import annotations

from typing import Callable, List

from airi.tools.llm.groq import ask_groq
from airi.tools.llm.hf import ask_hf


Route = Callable[[str], str]


def _order_for_task(task_type: str) -> List[Route]:
    """Return providers in priority order for a given task type."""
    t = (task_type or "").lower()
    if t == "coding":
        return [ask_groq, ask_hf]
    if t == "analysis":
        return [ask_groq, ask_hf]
    if t == "simple_text":
        return [ask_hf, ask_groq]
    # default fallback
    return [ask_groq, ask_hf]


def ask_llm(prompt: str, task_type: str):
    providers = _order_for_task(task_type)
    errors = []
    for provider in providers:
        try:
            return provider(prompt)
        except Exception as e:
            errors.append(str(e))
            continue
    raise RuntimeError(f"All LLM providers failed: {' | '.join(errors)}")
