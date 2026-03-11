# Airi Company

A simulated company run by AI agents with a dashboard (Next.js) and FastAPI backend.

## Roles
- CEO agent
- Developer agent
- Marketing agent
- Analyst agent
- Support agent

## Architecture
- Python, modular agents
- In-memory task queue and message bus for agent communication
- LLM router (DeepSeek, Groq, HF) with fallback
- FastAPI backend exposing agent/task/log endpoints
- Next.js (TS) + Tailwind + shadcn/ui dashboard
- GitHub integration stub (token-based, pluggable)
- File tools for basic read/write operations

## Structure
```
airi/
  agents/
  tools/
    llm/
  tasks/
  memory/
  api.py          # FastAPI app
frontend/         # Next.js dashboard
```

## Backend quick start
```bash
cd airi
python3 -m venv .venv
source .venv/bin/activate
pip install -q -e .  # or: pip install -r <(python -m pip list?)
export DEEPSEEK_API_KEY=...
export GROQ_API_KEY=...
export HF_API_KEY=...
python -m airi.api   # serves FastAPI on :8000
```

Run agent demo (CLI):
```bash
source .venv/bin/activate
python -m airi.main
```

## Frontend quick start
```bash
cd frontend
npm install
npm run dev  # defaults to localhost:3000
```
Set `NEXT_PUBLIC_API_BASE` to point to the FastAPI host (default `http://localhost:8000`).

## API endpoints
- `GET /agents`
- `POST /agents/start` {name}
- `POST /agents/stop` {name}
- `GET /tasks`
- `POST /tasks`
- `GET /logs`
- `GET /memory`
- `GET /dashboard`

## Notes
- LLM keys pulled from env: `DEEPSEEK_API_KEY`, `GROQ_API_KEY`, `HF_API_KEY`.
- GitHub token (optional) via `config.json` (see `config.example.json`).
