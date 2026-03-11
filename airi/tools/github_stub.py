from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

import json
from pathlib import Path


@dataclass
class GitHubConfig:
    token: str
    repo: str  # owner/name


class GitHubClient:
    """Lightweight stub for GitHub interactions. Extend with PyGithub if needed."""

    def __init__(self, config_path: str = "config.json"):
        self.config_path = Path(config_path)
        self.config: Optional[GitHubConfig] = None
        self._load_config()

    def _load_config(self):
        if self.config_path.exists():
            data = json.loads(self.config_path.read_text())
            token = data.get("github_token")
            repo = data.get("repo")
            if token and repo:
                self.config = GitHubConfig(token=token, repo=repo)

    def enabled(self) -> bool:
        return self.config is not None

    def create_issue(self, title: str, body: str) -> None:
        if not self.enabled():
            print("[GitHub] Not configured")
            return
        # Placeholder; integrate PyGithub or REST here
        print(f"[GitHub] Would create issue in {self.config.repo}: {title}\n{body}")
