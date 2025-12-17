# Hono + HTMX Architecture Guidelines

## Stack

- **Framework**: Hono
- **Runtime**: Cloudflare Workers
- **Template**: Hono JSX
- **Interactivity**: HTMX (partial updates)
- **Styling**: Tailwind CSS

## Core Principles

### HTMX Philosophy

- **Hypermedia-driven**: Server returns HTML, not JSON
- **Partial updates**: Use `hx-target`, `hx-swap` for granular DOM updates
- **Progressive enhancement**: Works without JS, enhanced with HTMX
- **Minimal client-side JS**: Let HTMX handle interactions

## Project Structure

```
src/
├── index.tsx              # Entry point
├── routes/                # Hono route handlers
│   ├── index.ts           # Route definitions
│   ├── posts.ts
│   └── users.ts
├── views/                 # Full page templates (Hono JSX)
│   ├── layout.tsx         # Base layout
│   ├── home.tsx
│   └── posts/
│       ├── list.tsx
│       └── detail.tsx
├── components/            # Reusable HTMX partials (Hono JSX)
│   ├── PostCard.tsx
│   ├── UserProfile.tsx
│   └── ui/                # Atomic UI components
├── actions/               # Server-side action handlers
│   ├── posts.ts
│   └── users.ts
├── utils/                 # Utilities
│   └── types.ts           # Global types (Result<T,E>)
└── public/                # Static assets
    ├── styles.css         # Tailwind output
    └── htmx.min.js        # HTMX library
```

## Hono JSX Patterns

### Layout Component

```tsx
// views/layout.tsx
export const Layout = ({ children }: { children: any }) => (
  <html lang="ja">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>App</title>
      <script src="/htmx.min.js"></script>
      <link href="/styles.css" rel="stylesheet" />
    </head>
    <body>
      <main>{children}</main>
    </body>
  </html>
);
```

### Page Component

```tsx
// views/posts/list.tsx
import { Layout } from "../layout";

export const PostList = ({ posts }: { posts: Post[] }) => (
  <Layout>
    <div id="post-list">
      {posts.map((post) => (
        <PostCard post={post} />
      ))}
    </div>
  </Layout>
);
```

### Partial Component (HTMX target)

```tsx
// components/PostCard.tsx
export const PostCard = ({ post }: { post: Post }) => (
  <article class="card">
    <h2>{post.title}</h2>
    <p>{post.excerpt}</p>
    <button
      hx-delete={`/posts/${post.id}`}
      hx-target="closest article"
      hx-swap="outerHTML"
    >
      Delete
    </button>
  </article>
);
```

## Route Handlers

### Pattern

```typescript
// routes/posts.ts
import { Hono } from 'hono';
import { PostList } from '../views/posts/list';
import { PostCard } from '../components/PostCard';

const posts = new Hono();

// Full page
posts.get('/', async (c) => {
  const postList = await db.posts.findMany();
  return c.html(<PostList posts={postList} />);
});

// Partial update (HTMX)
posts.delete('/:id', async (c) => {
  const id = c.req.param('id');

  const result = await deletePost(id);

  if (!result.ok) {
    return c.html(<div class="error">{result.error}</div>, 400);
  }

  // Return empty for swap="outerHTML" delete
  return c.html('', 200);
});

// Create (returns new card)
posts.post('/', async (c) => {
  const formData = await c.req.formData();
  const result = await createPost(formData);

  if (!result.ok) {
    return c.html(<div class="error">{result.error}</div>, 400);
  }

  return c.html(<PostCard post={result.value} />);
});

export default posts;
```

### Main App

```typescript
// index.tsx
import { Hono } from "hono";
import { serveStatic } from "hono/cloudflare-workers";
import posts from "./routes/posts";

const app = new Hono();

app.use("/public/*", serveStatic({ root: "./" }));
app.route("/posts", posts);

export default app;
```

## HTMX Patterns

### Common Attributes

```html
<!-- GET request, replace target -->
<button hx-get="/posts/1" hx-target="#content">Load</button>

<!-- POST form, append to list -->
<form hx-post="/posts" hx-target="#post-list" hx-swap="afterbegin">
  <input name="title" required />
  <button type="submit">Create</button>
</form>

<!-- DELETE, remove element -->
<button hx-delete="/posts/1" hx-target="closest article" hx-swap="outerHTML">
  Delete
</button>

<!-- Polling -->
<div hx-get="/status" hx-trigger="every 2s">Status</div>
```

### Response Patterns

```typescript
// Return partial HTML
return c.html(<Component />);

// Return empty for deletions
return c.html('', 200);

// Return error message
return c.html(<ErrorMessage />, 400);

// Redirect (HTMX handles HX-Redirect header)
return c.redirect('/posts');
```

## Actions Pattern

```typescript
// actions/posts.ts
import { Result } from "../utils/types";

export async function createPost(
  formData: FormData,
): Promise<Result<Post, string>> {
  const title = formData.get("title");
  if (!title) return { ok: false, error: "Title required" };

  try {
    const post = await db.posts.create({ title });
    return { ok: true, value: post };
  } catch (error) {
    console.error("DB error:", error);
    return { ok: false, error: "Failed to create post" };
  }
}

export async function deletePost(id: string): Promise<Result<void, string>> {
  try {
    await db.posts.delete({ where: { id } });
    return { ok: true, value: undefined };
  } catch (error) {
    console.error("DB error:", error);
    return { ok: false, error: "Failed to delete post" };
  }
}
```

## Cloudflare Workers Considerations

### Environment Variables

```typescript
type Bindings = {
  DB: D1Database;
  BUCKET: R2Bucket;
  // Add your bindings
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => {
  const db = c.env.DB; // Access bindings
});
```

### File Structure for Deployment

```
wrangler.toml          # Cloudflare config
src/
└── ...
public/
└── ...
```

## Testing

Focus on route handlers and actions:

```typescript
// routes/posts.test.ts
import { describe, it, expect } from "vitest";
import app from "./index";

describe("POST /posts", () => {
  it("creates post and returns card", async () => {
    const formData = new FormData();
    formData.append("title", "Test");

    const res = await app.request("/posts", {
      method: "POST",
      body: formData,
    });

    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("Test");
  });
});
```

## Key Differences from Next.js

| Aspect        | Next.js                 | Hono + HTMX                 |
| ------------- | ----------------------- | --------------------------- |
| Rendering     | RSC + Client Components | Server-rendered JSX         |
| Routing       | File-based              | Code-based (Hono)           |
| Interactivity | React hooks             | HTMX attributes             |
| Data flow     | Props + State           | Hypermedia (HTML responses) |
| Bundle        | React runtime           | Minimal (HTMX ~14KB)        |
