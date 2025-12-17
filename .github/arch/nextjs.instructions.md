# Next.js Architecture Guidelines

Always consult Context7 if you plan to deviate from these guidelines.

## Version & Router

- **Next.js 15+ App Router**
- Maximize SSR, minimize client bundle

## Component Types

### Server Components (Default)

- `page.tsx`, `layout.tsx`
- Fetch data directly in components
- No client-side hooks (useState, useEffect, etc.)

### Client Components

- Must have `"use client"` directive at top
- Place in `_features/` or `_components/` directories only
- Keep minimal and focused
- Pass data from Server Components via props

### Data Flow Pattern

**Server Component** (fetch data) → **Client Component** (props) → interactivity

## Project Structure

### Colocation Rules

- **Route-specific files**: Use `_prefix`, live within route directories
- **Parallel routes**: `@folder` for multi-part layouts
- **Dynamic routes**: `[param]` for dynamic segments
- **Route Grouping**: `(group)` for organizing related routes

### Directory Structure

```
app/
├── dashboard/
│   ├── @modal/              # Parallel route
│   ├── @search/             # Parallel route
│   ├── page.tsx             # Server component
│   ├── loading.tsx          # Loading UI (auto-wrapped in Suspense)
│   ├── error.tsx            # Error boundary
│   ├── _components/         # Route-specific UI
│   ├── _features/           # Route-specific logic
│   │   ├── DisplayUserProfile.tsx
│   │   └── UserDashboard/    # Feature with sub-features (max 1-level nesting)
│   │       ├── index.tsx
│   │       ├── UserActivityFeed.tsx  # Sub-feature (1-level deep)
│   │       ├── UserStats.tsx         # Sub-feature (1-level deep)
│   │       └── useUserData.ts        # Feature-specific hook
│   ├── _hooks/              # Shared across route features
│   ├── _actions/            # Route-specific server actions
│   └── _config/             # Route-specific config
├── blog/
│   ├── [slug]/              # Dynamic route
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   ├── _components/
│   ├── _features/
│   ├── _hooks/
│   ├── _actions/
│   └── _config/
├── page.tsx                # Root page
├── loading.tsx             # Root loading
├── error.tsx               # Root error boundary
└── layout.tsx              # Root layout

components/                # Global shared UI
├── ui/                     # Atomic UI pieces (shadcn/ui, primitives)
└── ...                     # Custom global components

hooks/                     # Global shared hooks
utils/                     # Global utilities
└── types.ts                # Global types only (e.g., Result<T,E>)
public/                    # Static assets
```

## Component Organization

### Components

- Small UI pieces, usually children of Features
- OK to compose UI primitives (shadcn/ui, Radix, etc.)
- **Do not import Features into Components**

### Features

- Large components combining small components and logic
- Named like `DisplayUserProfile.tsx` or `DisplayUserProfile/index.tsx`
- **Compose Features in `page.tsx`, not across same-level Features**
- **Max 1-level nesting**:
  - Use composition pattern, no prop drilling
  - If deeper nesting needed → refactor to parallel Features, add useContext, or both
- Colocate feature-specific hooks/utils inside Feature directory

### Global vs Route-specific

- **Global** (`components/`, `hooks/`, `utils/`): Used across multiple routes
- **Route-specific** (`_components/`, `_features/`, `_hooks/`): Used only within that route

## Loading & Error Handling

### Loading UI (`loading.tsx`)

```typescript
export default function Loading() {
  return <div>Loading...</div>;
}
```

- Automatically wraps `page.tsx` in `<Suspense>`
- Shows while page is loading
- Place at route level for route-specific loading states

### Error Boundaries (`error.tsx`)

```typescript
"use client"; // Error boundaries must be Client Components

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

- Must be a Client Component
- Catches errors in nested routes and components
- `reset()` attempts to re-render the segment

### Not Found (`not-found.tsx`)

```typescript
export default function NotFound() {
  return <div>404 - Page Not Found</div>;
}
```

- Triggered by `notFound()` function or invalid routes
- Can be defined at any route level

## Server Actions

### Location

Place in route-specific `_actions/` directory

### Pattern

```typescript
"use server";

export async function createPost(
  formData: FormData,
): Promise<Result<Post, string>> {
  // Validation
  const title = formData.get("title");
  if (!title) return { ok: false, error: "Title required" };

  // External operation with try-catch
  try {
    const post = await db.insert({ title });
    revalidatePath("/posts");
    return { ok: true, value: post };
  } catch (error) {
    console.error("DB error:", error);
    return { ok: false, error: "Failed to create post" };
  }
}
```

### Rules

- Always return `Result<T, E>`
- Use `revalidatePath()` or `revalidateTag()` for cache invalidation
- Handle validation before external operations
- Log all errors in catch blocks
