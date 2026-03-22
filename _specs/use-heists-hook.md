# Spec for useHeists Hook

branch: claude/feature/use-heists-hook

## Summary

A custom React hook called `useHeists` that subscribes to real-time Firestore data from the `heists` collection. It accepts a filter argument — `'active'`, `'assigned'`, or `'expired'` — and returns a typed array of `Heist` objects matching the appropriate query. The hook is then used on the heists dashboard page to display heist titles under three sections.

## Functional Requirements

- The hook is named `useHeists` and lives in a new `hooks/` directory.
- It accepts a single required argument of type `'active' | 'assigned' | 'expired'`.
- It returns an array of `Heist` objects (from `types/firestore/heist.ts`).
- It subscribes to Firestore using `onSnapshot` for real-time updates and cleans up the listener on unmount.
- It uses the existing `heistConverter` for Firestore data conversion.
- It uses the existing `auth` export from `lib/firebase.ts` to get the current user's UID.

### Query logic by filter value

- **`'active'`**: Heists where `assignedTo` equals the current user's UID AND `deadline` is in the future (greater than `new Date()`).
- **`'assigned'`**: Heists where `createdBy` equals the current user's UID AND `deadline` is in the future (greater than `new Date()`).
- **`'expired'`**: Heists where `deadline` is in the past (less than or equal to `new Date()`) AND `finalStatus` is not null. This query is not scoped to the current user.

### Dashboard page integration

- The heists page at `app/(dashboard)/heists/page.tsx` calls `useHeists` three times — once per filter value.
- Each section displays a list of heist titles returned by its respective hook call.
- If a section's array is empty, it should show no list items (the section heading remains).

## Possible Edge Cases

- The user is not authenticated (`auth.currentUser` is null) — the hook should return an empty array and not subscribe to Firestore.
- Firestore composite indexes may be needed for queries that combine field equality with inequality on `deadline`.
- The `deadline` comparison uses the client's clock; minor clock skew could affect which heists appear as active vs expired.
- The `'expired'` filter requires `finalStatus != null` — Firestore does not support `!=` directly on null in all SDK versions; may need a `where` with `not-equal` or alternative approach.

## Acceptance Criteria

- `useHeists('active')` returns only heists assigned to the current user with a future deadline.
- `useHeists('assigned')` returns only heists created by the current user with a future deadline.
- `useHeists('expired')` returns only heists with a past deadline and a non-null `finalStatus`.
- All three results update in real-time when Firestore data changes.
- The heists page renders heist titles under the correct section headings.
- The Firestore listener is properly cleaned up when the component unmounts or the filter changes.
- The page must be converted to a client component (`'use client'`) to use hooks.

## Open Questions

- Should the hook also return a loading or error state, or just the array for now? It can return loading or error state.
- Are Firestore composite indexes already set up for these queries, or do they need to be created? Not set up.
- Should there be a limit on the number of heists returned per query? Not for now.

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- The hook returns an empty array when the user is not authenticated.
- The hook constructs the correct Firestore query for each filter value (`active`, `assigned`, `expired`).
- The hook cleans up its Firestore listener on unmount.
- The heists page renders three sections and displays titles from each hook call.
