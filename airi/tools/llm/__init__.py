from airi.tools.llm.router import ask_llm
from airi.tools.llm.deepseek import ask_deepseek
from airi.tools.llm.groq import ask_groq
from airi.tools.llm.hf import ask_hf

__all__ = ["ask_llm", "ask_deepseek", "ask_groq", "ask_hf"]
