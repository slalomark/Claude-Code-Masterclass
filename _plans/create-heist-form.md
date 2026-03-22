# Plan: Create Heist Form

## Context

The create heist page at `app/(dashboard)/heists/create/page.tsx` is currently a stub with just a title. This plan implements the full form that collects heist details, fetches users for assignment, writes to Firestore, and redirects on success. Spec: `_specs/create-heist-form.md`.

## Files to Create

| File | Purpose |
|------|---------|
| `types/firestore/user.ts` | `FirestoreUser` interface (`id`, `codename`) |
| `lib/heists.ts` | `fetchUsers(excludeUid)` and `createHeist(input)` functions |
| `components/CreateHeistForm/CreateHeistForm.tsx` | Form component with state, validation, submission |
| `components/CreateHeistForm/CreateHeistForm.module.css` | Scoped styles following AuthForm pattern |
| `components/CreateHeistForm/index.ts` | Barrel export |
| `tests/components/CreateHeistForm.test.tsx` | Component tests |
| `tests/lib/heists.test.ts` | Unit tests for lib functions |

## Files to Modify

| File | Change |
|------|--------|
| `types/firestore/index.ts` | Add `export * from "./user"` and `USERS: "users"` to COLLECTIONS |
| `app/(dashboard)/heists/create/page.tsx` | Import and render `CreateHeistForm` |

## Implementation Steps

### 1. Types — `types/firestore/user.ts`
- Define `FirestoreUser` interface with `id: string` and `codename: string` (matches doc shape in `lib/signup.ts`)

### 2. Update exports — `types/firestore/index.ts`
- Re-export user types
- Add `USERS: "users"` to `COLLECTIONS`

### 3. Firestore helpers — `lib/heists.ts`
- `fetchUsers(excludeUid: string): Promise<FirestoreUser[]>` — fetches all docs from `users` collection, filters out current user
- `createHeist(input: CreateHeistInput): Promise<string>` — calls `addDoc` on `heists` collection, returns new doc ID
- Reuse `db` from `@/lib/firebase` and `COLLECTIONS` from `@/types/firestore`
- Check Context7 for current `addDoc`/`getDocs` API before writing

### 4. Component — `components/CreateHeistForm/`

**CreateHeistForm.tsx** (`"use client"`):
- State: `title`, `description`, `assignedTo`, `users`, `loading`, `submitting`, `error`
- On mount: call `fetchUsers(user.uid)` to populate dropdown (exclude current user per spec)
- Form fields: Title input, Description textarea, Assigned To select (options from users array)
- Submit handler:
  1. Look up selected user's codename from `users` array
  2. Build `CreateHeistInput` object — `deadline: new Date(Date.now() + 48*60*60*1000)`, `createdAt: serverTimestamp()`, `finalStatus: null`
  3. Call `createHeist(input)`
  4. On success: `router.push("/heists")`
  5. On failure: show error, keep form populated
- Disable submit when fields empty or submitting
- Use `useUser()` hook (from `lib/UserContext.tsx`) for current user
- Use `useRouter()` for redirect

**CreateHeistForm.module.css**:
- `@reference "../../app/globals.css"`
- Reuse `.form`, `.label`, `.input`, `.error` patterns from `components/AuthForm/AuthForm.module.css`
- Add `.select` (same as input with `appearance-none`) and `.textarea` (input + `min-h-[120px] resize-y`)

### 5. Page update — `app/(dashboard)/heists/create/page.tsx`
- Add `"use client"` directive
- Import and render `<CreateHeistForm />` below the existing `<h2>`

### 6. Tests

**tests/lib/heists.test.ts**:
- Mock `firebase/firestore` (`getDocs`, `addDoc`, `collection`)
- Test `fetchUsers` returns users excluding provided UID
- Test `fetchUsers` handles empty collection
- Test `createHeist` calls `addDoc` with correct args

**tests/components/CreateHeistForm.test.tsx**:
- Mock `next/navigation` (useRouter), `@/lib/UserContext` (useUser), `@/lib/heists` (fetchUsers, createHeist)
- Tests: renders all fields, submit disabled when empty, dropdown shows users, loading state during submit, success redirects, error display on failure

### Key patterns to follow
- **Form structure**: Mirror `components/AuthForm/AuthForm.tsx` (lines 60-131) for form layout, error display, submit button pattern
- **CSS Module**: Mirror `components/AuthForm/AuthForm.module.css` for `@reference`, `@apply` usage
- **Barrel export**: `export { default } from './CreateHeistForm'`

## Verification
1. `npm run build` — ensure no type errors
2. `npx vitest tests/components/CreateHeistForm.test.tsx tests/lib/heists.test.ts` — all tests pass
3. `npm run dev` — manually verify form renders at `/heists/create`, dropdown populates, submission works
