from __future__ import annotations

import os
import requests
from typing import Optional

API_URL = "https://api.deepseek.com/chat/completions"


def ask_deepseek(prompt: str, model: str = "deepseek-chat", timeout: int = 30) -> str:
    api_key = os.environ.get("DEEPSEEK_API_KEY")
    if not api_key:
        raise RuntimeError("DEEPSEEK_API_KEY is not set")

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    data = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
    }
    try:
        resp = requests.post(API_URL, json=data, headers=headers, timeout=timeout)
        resp.raise_for_status()
        j = resp.json()
        # Expected: {choices: [{message: {content: "..."}}]}
        content: Optional[str] = (
            j.get("choices", [{}])[0]
            .get("message", {})
            .get("content")
        )
        if not content:
            raise RuntimeError("DeepSeek: empty content")
        return content
    except requests.RequestException as e:
        raise RuntimeError(f"DeepSeek request failed: {e}")
    except Exception as e:
        raise RuntimeError(f"DeepSeek error: {e}")
