# Phase 1 - Step by Step Plan

## Already Done ✅
- [x] create-next-app (TypeScript, App Router, Tailwind, Turbopack)
- [x] Supabase packages installed (`@supabase/supabase-js`, `@supabase/ssr`)
- [x] `src/lib/supabase/client.ts` — browser client
- [x] `src/lib/supabase/server.ts` — server client
- [x] `src/lib/supabase/middleware.ts` — session refresh helper
- [x] `src/middleware.ts` — route protection (guarded until env vars are set)
- [x] Jest + React Testing Library configured

---

## Step 1 — Supabase Project Setup (manual, ~15 min)
> Do this in the Supabase dashboard, not in code.

1. Create a new Supabase project at https://supabase.com
2. Go to **Settings → API** and copy:
    - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
    - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Create `.env.local` from `.env.local.example` and paste the values
4. In **Authentication → Providers**, enable:
    - **Email** (magic link — disable "Confirm email" for easier dev)
    - **GitHub** or **Google** OAuth (optional for now, add later)
5. In **Authentication → URL Configuration**, set:
    - Site URL: `http://localhost:3000`
    - Redirect URLs: `http://localhost:3000/auth/callback`

---

## Step 2 — Folder Structure
Create the route group layout:

```
src/app/
  (auth)/
    layout.tsx          ← centered card, no navbar
    login/
      page.tsx
    signup/
      page.tsx (optional — magic link only needs email)
  (app)/
    layout.tsx          ← with navbar/header
    dashboard/
      page.tsx          ← first protected page
  auth/
    callback/
      route.ts          ← exchanges code for session cookie (required for magic link + OAuth)
```

---

## Step 3 — Auth Callback Route Handler
`src/app/auth/callback/route.ts`

- Receives `?code=xxx` from Supabase after magic link / OAuth
- Calls `supabase.auth.exchangeCodeForSession(code)`
- Redirects to `/dashboard` on success, `/auth/error` on failure
- **Must be outside the route groups** so the URL is exactly `/auth/callback`

---

## Step 4 — Login Page
`src/app/(auth)/login/page.tsx`

- Client Component
- Email input + "Send magic link" button
- Calls `supabase.auth.signInWithOtp({ email })`
- Shows confirmation message after submit ("Check your email")
- (Later) OAuth button calling `supabase.auth.signInWithOAuth({ provider: 'github' })`

---

## Step 5 — Auth Layout
`src/app/(auth)/layout.tsx`

- Server Component
- Check if user is already logged in → redirect to `/dashboard`
- Wrap children in a centered card (Tailwind: `min-h-screen flex items-center justify-center`)

---

## Step 6 — App Layout + Navbar
`src/app/(app)/layout.tsx`

- Server Component
- Fetch current user with `createClient()` from server
- Pass user to a `<Navbar>` Client Component
- Navbar has: app title, user email, sign out button

`src/app/(app)/dashboard/page.tsx`

- Server Component
- Show "Welcome, {email}" as placeholder for now

---

## Step 7 — Sign Out
`src/components/SignOutButton.tsx`

- Client Component
- Calls `supabase.auth.signOut()`
- Calls `router.push('/login')` after

---

## Step 8 — Update Root Page
`src/app/page.tsx`

- Server Component
- Check session → redirect to `/dashboard` if logged in, `/login` if not
- Acts as a smart entry point

---

## Step 9 — Tests for Auth Logic
`src/test/auth/`

- Unit test: `SignOutButton` renders and calls signOut on click
- Unit test: Login form shows confirmation message after submit
- (Integration tests come in Phase 4)

---

## Completion Criteria for Phase 1
- [ ] App starts without errors with real `.env.local`
- [ ] Visiting `/` redirects based on session
- [ ] Magic link email is sent on login form submit
- [ ] Clicking the email link lands on `/dashboard`
- [ ] Sign out returns to `/login`
- [ ] Unauthenticated access to `/dashboard` redirects to `/login`
- [ ] Tests pass
