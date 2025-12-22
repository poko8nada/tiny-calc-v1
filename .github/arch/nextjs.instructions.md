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

## State Management

### Global State: Zustand (Recommended)

- Use Zustand over Context API for global state
- **Separation of Concerns**: State definition and logic must be separate
- Store contains only state definition
- Business logic goes in `lib/` or `_lib/`

### Store Structure

```typescript
// store/userStore.ts - State only
import { create } from "zustand";

type UserState = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

// lib/userActions.ts - Logic (testable)
export function validateUser(user: User): Result<User, string> {
  if (!user.email) return { ok: false, error: "Email required" };
  return { ok: true, value: user };
}

export async function fetchAndSetUser(userId: string) {
  try {
    const user = await fetchUser(userId);
    useUserStore.getState().setUser(user);
    return { ok: true, value: user };
  } catch (error) {
    console.error("Fetch user error:", error);
    return { ok: false, error: "Failed to fetch user" };
  }
}
```

### Derived State Principle

- Avoid redundant state
- If state B can be derived from state A, compute B from A
- Use selectors or computed values instead of storing derived data

```typescript
// ❌ Bad: Redundant state
const [users, setUsers] = useState<User[]>([]);
const [activeUsers, setActiveUsers] = useState<User[]>([]);

// ✅ Good: Derived state
const [users, setUsers] = useState<User[]>([]);
const activeUsers = users.filter((u) => u.isActive);
```

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
│   ├── _lib/                # Route-specific business logic
│   │   ├── userLogic.ts
│   │   └── userLogic.test.ts
│   ├── _store/              # Route-specific Zustand stores
│   │   └── dashboardStore.ts
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
│   ├── _lib/
│   └── _config/
├── page.tsx                # Root page
├── loading.tsx             # Root loading
├── error.tsx               # Root error boundary
└── layout.tsx              # Root layout

components/                # Global shared UI
├── ui/                     # Atomic UI pieces (shadcn/ui, primitives)
├── layouts/                # Layout components (PageLayout, SectionLayout)
└── ...                     # Custom global components

hooks/                     # Global shared hooks
lib/                       # Global business logic
├── userActions.ts
├── userActions.test.ts
├── auth.ts
└── api.ts
store/                     # Global Zustand stores
├── userStore.ts
└── appStore.ts
utils/                     # Pure utilities only (NOT business logic)
├── format.ts              # Date formatting, string manipulation, etc.
└── types.ts               # Global types only (e.g., Result<T,E>)
public/                    # Static assets
```

### Directory Purpose

- **`lib/`**: Global business logic, domain logic, services
- **`_lib/`**: Route-specific business logic
- **`utils/`**: Pure utility functions only (formatting, parsing, etc.)
  - ❌ Do NOT place business logic in `utils/`
- **`store/`**: Global Zustand stores (state definition only)
- **`_store/`**: Route-specific Zustand stores (state definition only)

## Component Organization

### Components

- Small UI pieces, usually children of Features
- OK to compose UI primitives (shadcn/ui, Radix, etc.)
- **Do not import Features into Components**
- Use Layout components for styling wrappers

### Styling Wrappers

**❌ Anti-pattern**: Using Features as styling wrappers

```tsx
// ❌ Bad: Feature used only for styling
<FeatureWrapper>
  <ActualFeature />
</FeatureWrapper>
```

**✅ Recommended**: Use Layout components or Tailwind directly

```tsx
// ✅ Good: Layout component in components/layouts/
<PageLayout>
  <ActualFeature />
</PageLayout>

// ✅ Good: Tailwind classes directly
<div className="container mx-auto p-4">
  <ActualFeature />
</div>
```

### Features

- Large components combining small components and logic
- Named like `DisplayUserProfile.tsx` or `DisplayUserProfile/index.tsx`
- **Compose Features in `page.tsx`, not across same-level Features**
- **Max 1-level nesting**:
  - Use **composition pattern** and **render props pattern**, no prop drilling
  - If deeper nesting needed → refactor to parallel Features, add state management, or both
- Colocate feature-specific hooks/utils inside Feature directory
- **Single Responsibility Principle**: Each Feature should have one clear purpose

### Composition & Render Props Pattern

**Composition Pattern**:

```tsx
// ✅ Good: Compose features through children
function UserProfile({ children }: { children: React.ReactNode }) {
  return (
    <div className="profile">
      <UserHeader />
      {children}
      <UserFooter />
    </div>
  );
}

// Usage in page.tsx
<UserProfile>
  <UserStats />
  <UserActivity />
</UserProfile>;
```

**Render Props Pattern**:

```tsx
// ✅ Good: Share logic without nesting
function DataFetcher({ render }: { render: (data: Data) => React.ReactNode }) {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    fetchData().then(setData);
  }, []);

  return data ? render(data) : <Loading />;
}

// Usage
<DataFetcher render={(data) => <UserProfile data={data} />} />;
```

### Global vs Route-specific

- **Global** (`components/`, `hooks/`, `lib/`, `store/`): Used across multiple routes
- **Route-specific** (`_components/`, `_features/`, `_hooks/`, `_lib/`, `_store/`): Used only within that route

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
