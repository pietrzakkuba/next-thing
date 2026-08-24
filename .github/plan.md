# Next.js Todo App - Training Plan

## Problem Statement
Build a full-featured todo list application using Next.js, Supabase, and Vercel to reach senior-level proficiency with Next.js (coming from an Angular background).

## Target Stack
- **Frontend**: Next.js (App Router), React, TypeScript
- **Backend**: Supabase (PostgreSQL + Auth)
- **Hosting**: Vercel
- **Testing**: Jest + React Testing Library
- **Styling**: TailwindCSS (for rapid UI development)

## Approach
Divide development into phases:
1. **Phase 1 (Foundations)**: Project setup, authentication, basic UI
2. **Phase 2 (Core Features)**: Todo CRUD with categories, due dates, priorities
3. **Phase 3 (Sharing & Advanced)**: Todo sharing, filtering, advanced Next.js patterns
4. **Phase 4 (Polish & Deploy)**: Testing, optimization, Vercel deployment

## Key Next.js Concepts to Master

### Fundamentals (Phase 1-2)
- App Router structure and dynamic routes
- Server Components vs Client Components
- Data fetching patterns (Server-side rendering, client-side)
- API Routes and form handling
- Middleware for auth protection

### Advanced (Phase 3-4)
- Server Actions for form submissions
- Incremental Static Regeneration (ISR)
- Image optimization
- Dynamic route segments
- Caching strategies with revalidatePath/revalidateTag
- Environment variables and secrets

## Phase Breakdown

### Phase 1: Foundation & Auth (~3-4 days)
- Project initialization with create-next-app
- TailwindCSS setup
- Supabase project and database initialization
- Authentication flow (sign up, sign in, sign out with magic link + OAuth)
- Protected routes with proxy
- Basic landing and dashboard pages

### Phase 2: Core Todo Features (~4-5 days)
- Database schema (todos, categories, priorities)
- CRUD operations (Create, Read, Update, Delete todos)
- List view with filtering and sorting
- Category management
- Priority levels and due dates
- Real-time updates using Supabase subscriptions (see § Real-Time section below)
- Unit tests for core logic

### Phase 3: Sharing & Advanced Patterns (~3-4 days)
- Todo sharing with other users
- Shared list view with permissions
- Bulk operations (mark complete, delete multiple)
- Advanced filtering and search
- Server Actions implementation
- Optimistic updates and revalidation
- Additional unit tests

### Phase 4: Polish & Deployment (~2-3 days)
- Form validation with client and server
- Error handling and user feedback
- Loading states and skeletons
- Performance optimization
- Vercel deployment setup
- Environment configuration for production

## Technology Decisions

### Why App Router?
- Modern standard, better server-client streaming, Server Actions support
- Aligns with industry direction

### Why Supabase?
- Combines auth + database + real-time + storage (all you might need)
- Postgres-based, familiar if you know SQL
- Great for learning backend concepts without building one

### Why Jest + React Testing Library?
- Jest: Industry standard, great DX
- RTL: Tests user behavior, not implementation details
- Teaches you what senior Angular engineers already know about testing

## Success Criteria
- ✅ Deployed working app on Vercel
- ✅ Core todo features fully functional
- ✅ Authentication working (email + OAuth)
- ✅ Sharing feature implemented
- ✅ Unit tests covering critical paths
- ✅ Understanding of App Router, Server Components, and Server Actions
- ✅ Can explain Next.js patterns vs Angular equivalents

## Notes
- Start with TypeScript strict mode enabled (familiar from Angular)
- Use shadcn/ui or HeadlessUI for component library
- Keep components small and focused (same principle as Angular)
- Leverage Server Components for data fetching (different paradigm from Angular)

---

## Real-Time Supabase Updates (Live CRUD across devices/tabs)

### Goal
Any INSERT / UPDATE / DELETE on the `todos` table should instantly reflect on **all connected clients** (other browser tabs, other devices) without a page refresh.

### Supabase Setup
1. In the Supabase dashboard → **Database → Replication**, enable the `todos` table for **realtime** (adds it to the `supabase_realtime` publication).
2. Ensure Row Level Security (RLS) policies allow `SELECT` for authenticated users (realtime respects RLS).

### Implementation Pattern (Client Component)

Realtime subscriptions require a browser WebSocket, so they must live in a **Client Component** (`"use client"`).

```ts
// hooks/useTodosRealtime.ts
"use client";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client"; // browser client
import { Todo } from "@/types";

export function useTodosRealtime(
  onInsert: (todo: Todo) => void,
  onUpdate: (todo: Todo) => void,
  onDelete: (id: string) => void,
) {
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel("todos-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "todos" },
        (payload) => onInsert(payload.new as Todo),
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "todos" },
        (payload) => onUpdate(payload.new as Todo),
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "todos" },
        (payload) => onDelete(payload.old.id as string),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
```

Use this hook inside a Client Component that holds local state:

```ts
// app/dashboard/TodoList.tsx
"use client";
import { useState } from "react";
import { useTodosRealtime } from "@/hooks/useTodosRealtime";

export function TodoList({ initialTodos }: { initialTodos: Todo[] }) {
  const [todos, setTodos] = useState(initialTodos);

  useTodosRealtime(
    (t) => setTodos((prev) => [...prev, t]),           // INSERT
    (t) => setTodos((prev) => prev.map((x) => (x.id === t.id ? t : x))), // UPDATE
    (id) => setTodos((prev) => prev.filter((x) => x.id !== id)),          // DELETE
  );

  // render todos...
}
```

The **Server Component parent** fetches initial data once (SSR), then the Client Component keeps it live via WebSocket.

### Interaction with Optimistic Updates (Phase 3)
- Apply the optimistic state change immediately on the acting device.
- The realtime event will arrive shortly after and reconcile all other clients.
- Deduplicate by checking if the incoming `INSERT` id already exists in local state before appending.

### Key Concepts Learned
| Concept | Angular equivalent |
|---|---|
| Supabase `channel().on(...)` | RxJS `webSocket()` + `pipe(filter(...))` |
| Unsubscribe in `useEffect` cleanup | `ngOnDestroy` / `takeUntilDestroyed` |
| Client Component boundary | No direct equivalent (Angular is always client) |
| SSR initial data + live sync | Resolver + `BehaviorSubject` pattern |

### Success Criteria for Real-Time
- ✅ Adding a todo in Tab A appears instantly in Tab B without refresh
- ✅ Completing/editing a todo syncs across all tabs
- ✅ Deleting a todo removes it from all open sessions
- ✅ Realtime channel is properly cleaned up on component unmount
- ✅ Works after Vercel deployment (WebSocket via Supabase's hosted realtime server)

