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

## State Management

- Global State: Zustand (Recommended): Use Zustand over Context API for global state management.
- Derived State Principle: Avoid creating redundant state. If state B can be derived from state A, compute B from A.
- Pure Function First Principle: Extract pure logic into separate testable functions. Keep side effects isolated in hooks.

## Hook Design Principles

1. **Extract pure logic**
2. **Isolate side effects**
3. **Accept state as arguments**
4. **Testability**

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
    revalidatePath("/posts");
    return { ok: true, value: post };
  } catch (error) {
    console.error("DB error:", error);
    return { ok: false, error: "Failed to create post" };
  }
}

// Hook
function useCreatePost() {
  const [result, setResult] = useState<Result<Post, string> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const create = async (formData: FormData) => {
    setIsLoading(true);
    const res = await createPost(formData);
    setResult(res);
    setIsLoading(false);
    return res;
  };

  return { create, result, isLoading };
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
- When connecting to API, tests for both normal and abnormal cases
- Skip UI components and trivial code
- Place `*.test.ts(x)` adjacent to source files

### What to Test

```typescript
// ✅ Test: Business logic
describe("calculateMetrics", () => {
  it("should calculate correctly with valid data", () => {
    // Test normal case
  });

  it("should handle edge cases", () => {
    // Test abnormal case
  });
});

// ✅ Test: API calls
describe("fetchUser", () => {
  it("should return user on success", async () => {
    // Mock successful response
  });

  it("should return error on failure", async () => {
    // Mock failed response
  });
});

// ❌ Don't test: UI components, trivial functions
// Don't write tests for simple components or formatDate-like utilities
```

### Commands

```bash
pnpm test              # Run all tests
pnpm test *.test.tsx   # Run specific test
```

---

## Architecture-Specific Guidelines

For project structure and component organization, refer to your project's architecture guide in `arch/`.
