# Route Protection Plan

## Context
The app has two route groups — `(public)` and `(dashboard)` — but neither enforces auth. Users can access dashboard pages without logging in, and authenticated users still see login/signup pages. We need client-side route guards in both group layouts using the existing `useUser` hook, with a spinner loader shown while Firebase resolves auth state.

## Files to Modify/Create

| Action | File |
|--------|------|
| Create | `components/Loader/Loader.tsx` |
| Create | `components/Loader/Loader.module.css` |
| Create | `components/Loader/index.ts` |
| Modify | `app/(public)/layout.tsx` |
| Modify | `app/(dashboard)/layout.tsx` |
| Create | `tests/components/Loader.test.tsx` |
| Create | `tests/layouts/PublicLayout.test.tsx` |
| Create | `tests/layouts/DashboardLayout.test.tsx` |

## Step 1: Create Loader component

**`components/Loader/Loader.tsx`** — `"use client"`, renders `Clock8` from `lucide-react` (size 48, strokeWidth 2.75) centered on screen using `.center-content` + `items-center` classes. Add `role="status"` and `aria-label="Loading"` for accessibility. Apply CSS module spin class to the icon.

**`components/Loader/Loader.module.css`** — `@reference "../../app/globals.css"` at top (matching Navbar pattern). Define `.spinner` with `animation: spin 1.5s linear infinite` and `@keyframes spin` (0→360deg).

**`components/Loader/index.ts`** — `export { default } from "./Loader"`

## Step 2: Update public layout

**`app/(public)/layout.tsx`** — Convert to `"use client"`. Use `useUser()` and `useRouter()`. In a `useEffect`, redirect to `/heists` when `!loading && user`. Render: `loading` → `<Loader />`; `user` (redirect pending) → `<Loader />`; otherwise → children wrapped in `<main className="public">`.

## Step 3: Update dashboard layout

**`app/(dashboard)/layout.tsx`** — Convert to `"use client"`. Same pattern, inverted: redirect to `/login` when `!loading && !user`. Render: `loading` → `<Loader />`; `!user` (redirect pending) → `<Loader />`; otherwise → `<Navbar />` + children.

## Step 4: Tests

**`tests/components/Loader.test.tsx`** — Render Loader, assert `role="status"` is present.

**`tests/layouts/PublicLayout.test.tsx`** — Mock `useUser` and `useRouter` (following existing patterns from Navbar tests). Three test cases:
1. Loading → shows loader, no children
2. No user → renders children, no redirect
3. User present → shows loader, calls `router.push("/heists")`

**`tests/layouts/DashboardLayout.test.tsx`** — Same mocks + mock Navbar. Three test cases:
1. Loading → shows loader
2. No user → shows loader, calls `router.push("/login")`
3. User present → renders Navbar and children

## Verification
1. Run `npm test` — all new and existing tests pass
2. Run `npm run build` — no build errors
3. Manual: visit `/heists` logged out → redirected to `/login`; visit `/login` logged in → redirected to `/heists`; loader visible briefly during auth resolution
