# Code Patterns

Established patterns and conventions for CloudForge.

## General Principles

1. **TypeScript always** — No plain JavaScript
2. **Explicit > implicit** — Be clear about types and intentions
3. **Error handling** — Never swallow errors silently
4. **Tests required** — New features need test coverage

## Naming Conventions

- **Files:** `kebab-case.ts` for utilities, `PascalCase.tsx` for components
- **Functions:** `camelCase` for regular functions
- **Types:** `PascalCase` for types and interfaces
- **Constants:** `SCREAMING_SNAKE_CASE` for true constants

## Error Handling

```typescript
// ❌ Don't do this
try {
  await riskyOperation();
} catch (e) {
  // silently fail
}

// ✅ Do this
try {
  await riskyOperation();
} catch (error) {
  console.error('Operation failed:', error);
  throw new AppError('OPERATION_FAILED', 'Friendly message', { cause: error });
}
```

## API Response Format

```typescript
// Success
{ success: true, data: {...} }

// Error
{ success: false, error: { code: 'ERROR_CODE', message: 'Human message' } }
```

## Files in this directory

(Add pattern documents as they're established)
