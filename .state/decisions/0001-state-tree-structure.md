---
status: accepted
date: 2026-02-03
decision-makers: [Devory, HDA]
---

# State Tree Structure for Agent-Driven Development

## Context

CloudForge will be primarily developed by AI agents (Devory). We need a file structure that:
- Gives agents immediate context on current work
- Preserves decisions and their rationale
- Enables smooth handoffs between sessions
- Integrates naturally with git workflows

## Decision Drivers

- Agents have limited context windows and no persistent memory
- Sessions may end unexpectedly (timeouts, errors)
- Decisions made without documentation get lost
- Multiple agents/humans may contribute over time
- Need visibility into what agents are doing

## Considered Options

1. **Ad-hoc comments in code** — Embed context in source files
2. **Single WORKING.md file** — One file for all state
3. **Structured `.state/` directory** — Separate files for different concerns
4. **External tooling** — Jira, Linear, etc.

## Decision

**Option 3: Structured `.state/` directory**

Structure:
```
.state/
├── CURRENT.md      # What's happening NOW
├── SPRINT.md       # Current iteration tasks
├── BACKLOG.md      # Future work queue
└── decisions/      # ADR-style decision log
```

Plus supporting directories:
- `knowledge/` — Stable patterns and conventions
- `docs/` — User-facing documentation
- `research/` — Exploration and research

## Consequences

### Positive

- Clear separation of volatile (`.state/`) vs stable (`knowledge/`) content
- Quick orientation for new sessions (read CURRENT.md)
- Decision history preserved in version control
- Scales to multiple contributors
- Git-native (plain markdown, good diffs)

### Negative

- Overhead of maintaining state files
- Risk of state files becoming stale
- Another thing to keep in sync

## Notes

- CURRENT.md should be updated at start and end of every session
- SPRINT.md and BACKLOG.md updated when tasks change
- ADRs created for significant decisions (not every small choice)
- Knowledge base built incrementally as patterns emerge

See: `/Users/hda/.openclaw/workspace/research/state-tree-design.md` for full research.
