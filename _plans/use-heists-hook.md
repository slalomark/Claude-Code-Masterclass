# Plan: useHeists Hook

## Context

The heists dashboard page (`app/(dashboard)/heists/page.tsx`) currently shows three static section headings with no data. We need a `useHeists` hook that subscribes to real-time Firestore data from the `heists` collection, filtered by `'active'`, `'assigned'`, or `'expired'`, and integrate it on the page to display heist titles. The spec is at `_specs/use-heists-hook.md` with answered open questions: the hook should return loading/error state, indexes are not set up, and no query limit for now.

## Design Decisions

- **`useUser()` over `auth.currentUser`**: The spec mentions using `auth` directly, but `useUser()` from `lib/UserContext.tsx` is the established reactive pattern. It handles auth state changes and loading — using `auth.currentUser` would introduce race conditions.
- **Client-side filtering for `expired` `finalStatus`**: The `expired` query needs `deadline <= now` AND `finalStatus != null`. Using two inequality filters on different Firestore fields requires a composite index and has ordering constraints. Instead, query only on `deadline <= now` and filter `finalStatus !== null` client-side. This avoids an extra index for minimal cost (expired heists are a bounded set).
- **Convert page directly to client component**: No wrapper component needed — the page is minimal and the dashboard layout is already a client component.

## Implementation Steps

### Step 1: Create `hooks/useHeists.ts`

New file. The hook:
- Accepts `filter: 'active' | 'assigned' | 'expired'`
- Returns `{ heists: Heist[], loading: boolean, error: string | null }`
- Uses `useUser()` to get `user` and `userLoading`
- In a `useEffect` keyed on `[filter, user?.uid, userLoading]`:
  - If `userLoading` → stay in loading state, return
  - If `!user` and filter is `active`/`assigned` → set empty heists, loading false, return
  - Build query on `collection(db, COLLECTIONS.HEISTS).withConverter(heistConverter)`:
    - `active`: `where("assignedTo", "==", user.uid)`, `where("deadline", ">", Timestamp.now())`
    - `assigned`: `where("createdBy", "==", user.uid)`, `where("deadline", ">", Timestamp.now())`
    - `expired`: `where("deadline", "<=", Timestamp.now())`
  - Subscribe via `onSnapshot(q, onNext, onError)`
  - `onNext`: map docs, for `expired` filter out `finalStatus === null`, set state
  - `onError`: set error message
  - Return `unsubscribe` from effect cleanup

Imports: `onSnapshot`, `query`, `collection`, `where`, `Timestamp` from `firebase/firestore`; `db` from `@/lib/firebase`; `useUser` from `@/lib/UserContext`; `Heist`, `heistConverter`, `COLLECTIONS` from `@/types/firestore`

### Step 2: Create `hooks/index.ts`

Barrel export: re-export `useHeists` and `HeistFilter` type.

### Step 3: Modify `app/(dashboard)/heists/page.tsx`

- Add `"use client"` directive
- Import `useHeists` from `@/hooks`
- Call `useHeists` three times (once per filter)
- Show `<Loader />` while any hook is loading
- Show error if any hook has an error
- Map each result's heists to render `<p key={heist.id}>{heist.title}</p>` inside the respective section

### Step 4: Create `firestore.indexes.json`

Two composite indexes needed:
- `heists`: `assignedTo ASC, deadline ASC` (for `active` query)
- `heists`: `createdBy ASC, deadline ASC` (for `assigned` query)

No index needed for `expired` (single-field inequality on `deadline`).

### Step 5: Create `tests/hooks/useHeists.test.ts`

Mock setup (following existing patterns from `tests/lib/UserContext.test.tsx` and `tests/lib/heists.test.ts`):
- `vi.mock("@/lib/firebase", () => ({ db: {} }))`
- `vi.mock("@/lib/UserContext", ...)` — controllable `useUser` mock
- `vi.mock("firebase/firestore", ...)` — mock `onSnapshot`, `query`, `collection`, `where`, `Timestamp`

Key: the `onSnapshot` mock captures the success/error callbacks so tests can invoke them with mock data.

Test cases:
- Returns empty heists when user is not authenticated (for `active`/`assigned`)
- Builds correct `where` constraints for each filter
- Client-side filters `finalStatus === null` for `expired`
- Calls unsubscribe on cleanup
- Sets error state on snapshot error

### Step 6: Run checks

- `npm test` — verify all tests pass
- `npm run lint` — verify no lint errors
- `npm run build` — verify build succeeds
- Check Context7 docs for `onSnapshot` and `Timestamp.now()` usage before writing code

## Key Files

| File | Action |
|------|--------|
| `hooks/useHeists.ts` | Create |
| `hooks/index.ts` | Create |
| `app/(dashboard)/heists/page.tsx` | Modify |
| `firestore.indexes.json` | Create |
| `tests/hooks/useHeists.test.ts` | Create |

## Reuse

- `useUser()` from `lib/UserContext.tsx` — auth state
- `heistConverter` from `types/firestore/heist.ts` — Firestore data conversion
- `COLLECTIONS` from `types/firestore/index.ts` — collection names
- `db` from `lib/firebase.ts` — Firestore instance
- `Loader` from `components/Loader` — loading indicator
- Testing patterns from `tests/lib/UserContext.test.tsx` (renderHook + Firebase mocking)

## Verification

1. Run `npm test` — all existing + new tests pass
2. Run `npm run lint` — no errors
3. Run `npm run build` — compiles without errors
4. Manual: run `npm run dev`, navigate to `/heists` — page should show loader then heist titles (requires auth + Firestore data + indexes deployed)
