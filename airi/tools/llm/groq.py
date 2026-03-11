from __future__ import annotations

import os
from groq import Groq

# Updated to a current Groq model (deprecates llama3-70b-8192)
# Updated to an available Groq model
DEFAULT_MODEL = "llama-3.1-8b-instant"


def ask_groq(prompt: str, model: str = DEFAULT_MODEL, timeout: int = 30) -> str:
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY is not set")
    try:
        client = Groq(api_key=api_key, timeout=timeout)
        resp = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
        )
        content = resp.choices[0].message.content
        if not content:
            raise RuntimeError("Groq: empty content")
        return content
    except Exception as e:
        raise RuntimeError(f"Groq request failed: {e}")
