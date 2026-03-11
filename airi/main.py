from __future__ import annotations

from airi.tasks.queue import TaskQueue
from airi.tasks.types import Task
from airi.agents.ceo import CEOAgent
from airi.agents.developer import DeveloperAgent
from airi.agents.marketing import MarketingAgent
from airi.agents.analyst import AnalystAgent
from airi.agents.support import SupportAgent
from airi.tools.github_stub import GitHubClient
from airi.tools.llm.router import ask_llm


def run_demo():
    queue = TaskQueue()
    github = GitHubClient()

    agents = {
        "CEO": CEOAgent(queue),
        "Developer": DeveloperAgent(queue),
        "Marketing": MarketingAgent(queue),
        "Analyst": AnalystAgent(queue),
        "Support": SupportAgent(queue),
    }

    # Seed a kickoff task for CEO
    queue.add_task(Task(type="kickoff", payload={"goal": "Ship MVP"}, assignee="CEO"))

    # Add a coding task to show LLM router usage
    queue.add_task(Task(type="coding", payload={"ask": "Write Python code to create a Telegram bot."}, assignee="Developer"))

    # Simple loop: pull tasks and dispatch to the right agent
    while True:
        task = queue.next_task()
        if not task:
            break
        target = task.assignee or task.type.capitalize()
        agent = agents.get(target)
        if not agent:
            print(f"[Dispatcher] No agent for {target} (task {task.type})")
            continue
        new_tasks = agent.handle_task(task)
        if new_tasks:
            for t in new_tasks:
                queue.add_task(t)
        # Deliver messages to CEO (if any)
        for msg in queue.collect_messages_for("CEO"):
            print(f"[Message -> CEO] {msg.content}")

    # Example: developer uses LLM router directly for a coding prompt (demo)
    try:
        code = ask_llm("Write Python code to create a Telegram bot", task_type="coding")
        print("\n[LLM demo output]\n", code)
    except Exception as e:
        print("[LLM demo] failed:", e)

    # Example: create issue if GitHub configured
    if github.enabled():
        github.create_issue("Airi run summary", "Agents completed kickoff flow.")


if __name__ == "__main__":
    run_demo()
