# Airi Company

A simulated company run by AI agents.

## Roles
- CEO agent
- Developer agent
- Marketing agent
- Analyst agent
- Support agent

## Architecture
- Python, modular agents
- In-memory task queue and message bus for agent communication
- GitHub integration stub (token-based, pluggable)
- File tools for basic read/write operations

## Structure
```
airi/
  agents/
  tools/
  tasks/
  memory/
```

## Quick start
```bash
python -m airi.main
```

Edit `config.example.json` and copy to `config.json` with your GitHub token if you want real GitHub integration.
