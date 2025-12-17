# Coding Standards

## Core Principles

- **Functional Domain Modeling** design
- Use functions - no `class`
- Algebraic Data Types for type design
- Early return pattern - avoid deep nesting
- Handle errors first
- **Imports**: Same directory → `./`. Cross-directory or global → `@/` aliases

## Type Safety

### Rules

- Never use `any` - define explicit types
- Avoid type assertions (`as`) when possible
- Resolve type errors immediately
- Prefer union types and discriminated unions

### Global Types

Only universal types (e.g., `Result<T, E>`) in `utils/types.ts`

## Error Handling

### Never use exceptions for control flow

### Use Result<T, E> Pattern for:

- Internal logic and domain functions
- Server Actions returning success/error
- Hooks managing operation outcomes

### Use try-catch for:

- External operations (I/O, DB, fetch, file system)
- Always log: `console.error(error)` in catch blocks

### Result Pattern Examples

```typescript
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

// Domain function
function parseId(input: unknown): Result<string, "Invalid ID"> {
  return typeof input === "string" && input !== ""
    ? { ok: true, value: input }
    : { ok: false, error: "Invalid ID" };
}

// Server Action
("use server");
export async function createPost(
  formData: FormData,
): Promise<Result<Post, string>> {
  const title = formData.get("title");
  if (!title) return { ok: false, error: "Title required" };

  try {
    const post = await db.insert({ title });
    return { ok: true, value: post };
  } catch (error) {
    console.error("DB error:", error);
    return { ok: false, error: "Failed to create post" };
  }
}

// Hook
function useCreatePost() {
  const [result, setResult] = useState<Result<Post, string> | null>(null);

  const create = async (formData: FormData) => {
    const res = await createPost(formData);
    setResult(res);
    return res;
  };

  return { create, result };
}
```

## Comments

### Only for:

- Complex type hints
- Critical non-obvious logic

### Never for:

- Usage examples (use tests instead)
- Redundant descriptions

## Testing Policy

### Minimal Unit Tests Only

- No E2E tests
- Test business logic and critical functions only
- Skip UI components and trivial code
- Place `*.test.ts(x)` adjacent to source files

### Commands

```bash
pnpm test              # Run all tests
pnpm test *.test.tsx   # Run specific test
```

---

## Architecture-Specific Guidelines

For project structure and component organization, refer to your project's architecture guide in `arch/`.
