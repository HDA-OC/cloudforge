# Workflows

Process documentation for CloudForge development.

## Development Workflow

1. **Pick a task** from `.state/SPRINT.md`
2. **Create a branch** `feature/CF-XXX-description`
3. **Update `.state/CURRENT.md`** with your work
4. **Implement** with tests
5. **Commit** with clear messages
6. **Update state files** and push

## Git Commit Format

```
[CF-XXX] type: short description

- Detail 1
- Detail 2

🔧 Devory  (or agent/author name)
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

## Code Review

- Self-review against checklist before marking complete
- Human review for architectural changes
- Automated checks must pass

## Deployment

(TBD — will be documented when deployment is set up)

## Files in this directory

(Add workflow documents as processes are established)
