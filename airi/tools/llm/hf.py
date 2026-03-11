from __future__ import annotations

import os
import requests
from typing import Optional

DEFAULT_MODEL = "mistralai/Mistral-7B-Instruct"
API_URL = "https://api-inference.huggingface.co/models/"


def ask_hf(prompt: str, model: str = DEFAULT_MODEL, timeout: int = 30) -> str:
    api_key = os.environ.get("HF_API_KEY")
    if not api_key:
        raise RuntimeError("HF_API_KEY is not set")

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    payload = {"inputs": prompt}
    url = API_URL + model
    try:
        resp = requests.post(url, headers=headers, json=payload, timeout=timeout)
        resp.raise_for_status()
        data = resp.json()
        # HF inference can return list/dict; try common shapes
        content: Optional[str] = None
        if isinstance(data, list) and data and isinstance(data[0], dict):
            # text-generation pipeline style
            content = data[0].get("generated_text")
        if not content and isinstance(data, dict):
            # conversational style
            content = data.get("generated_text") or data.get("text")
        if not content:
            raise RuntimeError("HF: empty content")
        return content
    except requests.RequestException as e:
        raise RuntimeError(f"HF request failed: {e}")
    except Exception as e:
        raise RuntimeError(f"HF error: {e}")
