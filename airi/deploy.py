from __future__ import annotations
import os
import tempfile
import subprocess
from typing import Optional


def deploy_static(repo_url: str, branch: str, content: str, filename: str = "index.html") -> Optional[str]:
    """Clone repo, write content to filename, commit & push. Returns repo_url on success."""
    token = os.environ.get("GITHUB_TOKEN")
    if not token:
        raise RuntimeError("GITHUB_TOKEN not set")
    # transform repo_url to include token
    # repo_url expected like https://github.com/org/repo.git
    if repo_url.startswith("https://"):
        auth_url = repo_url.replace("https://", f"https://x-access-token:{token}@")
    else:
        auth_url = repo_url

    with tempfile.TemporaryDirectory() as tmp:
        # clone
        subprocess.check_call(["git", "clone", "-b", branch, auth_url, tmp])
        # write file
        path = os.path.join(tmp, filename)
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        # commit/push
        subprocess.check_call(["git", "-C", tmp, "add", filename])
        subprocess.check_call(["git", "-C", tmp, "commit", "-m", "chore: auto-update demo content"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        subprocess.check_call(["git", "-C", tmp, "push"])
    return repo_url
