# Plan: Auth State Management (useUser hook)

## Context

The app needs a global auth state solution so any component can know who is logged in. Currently no React context providers exist and no components reference user state. Firebase is already initialized and exports `auth` in `lib/firebase.ts`. The spec resolves all open questions: `loading` is included in the hook return value, `UserProvider` wraps the entire app at the root layout level.

---

## Files to Create / Modify

| Action | Path |
|--------|------|
| **Create** | `lib/UserContext.tsx` |
| **Modify** | `app/layout.tsx` |
| **Create** | `tests/lib/UserContext.test.tsx` |

---

## Step 1 — Create `lib/UserContext.tsx`

- Mark `"use client"` at the top (required: uses React hooks + Firebase listener)
- Define `UserContextValue` type: `{ user: User | null; loading: boolean }`
- Create `UserContext` via `createContext<UserContextValue | undefined>(undefined)`
- `UserProvider` component:
  - State: `user` (User | null, init `null`) and `loading` (boolean, init `true`)
  - `useEffect` with `onAuthStateChanged(auth, callback)` — sets `user` and `loading: false` on each event
  - Returns the unsubscribe function from the effect cleanup
  - Renders `<UserContext.Provider value={{ user, loading }}>{children}</UserContext.Provider>`
- `useUser` hook:
  - Reads `UserContext` via `useContext`
  - Throws `Error('useUser must be used within a UserProvider')` if called outside provider
  - Returns the context value

Reuse: `auth` from `@/lib/firebase`, `onAuthStateChanged` + `User` from `firebase/auth`.

---

## Step 2 — Update `app/layout.tsx`

- Import `UserProvider` from `@/lib/UserContext`
- Wrap `{children}` inside `<UserProvider>` within the `<body>` tag
- The layout stays a Server Component (importing a Client Component is valid in Next.js App Router)

---

## Step 3 — Create `tests/lib/UserContext.test.tsx`

Mock strategy: `vi.mock('firebase/auth')` to control `onAuthStateChanged` behavior.

Tests to write (lean set):
1. `useUser` returns `{ user: null, loading: false }` when no user is authenticated
2. `useUser` returns the user object when Firebase fires with a user
3. `useUser` exposes `loading: true` before Firebase resolves (initial state)
4. Calling `useUser` outside `UserProvider` throws a descriptive error

Helper: a small `renderHook`-based wrapper that supplies `UserProvider`.

---

## Verification

1. `npm test` — all existing tests still pass, new UserContext tests pass
2. `npm run lint` — no lint errors
3. `npm run dev` — app boots, no runtime errors in console
4. In browser devtools with a signed-in Firebase session, confirm `useUser().user` is not null
