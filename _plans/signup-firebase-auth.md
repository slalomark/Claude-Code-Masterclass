# Plan: Signup Firebase Auth with Codename Generation

## Context

The signup form at `app/(public)/signup/` currently renders an `AuthForm` component that only logs email/password to console. This plan hooks it into Firebase Auth, generates a heist-themed PascalCase codename for each new user, and stores a minimal user profile in Firestore — no email stored. The `UserContext` already listens to `onAuthStateChanged`, so auth state will propagate automatically after signup.

## Files to Create

### 1. `lib/generateCodename.ts` — Pure codename utility

- Three arrays of 10 heist-themed words each (adjectives, roles, objects)
- `generateCodename()` picks one random word from each, returns joined string (e.g. `SilentFoxVault`)
- No Firebase dependency — purely testable

### 2. `lib/signup.ts` — Signup flow orchestration

- `signup(email, password)` async function:
  1. `createUserWithEmailAndPassword(auth, email, password)`
  2. `generateCodename()`
  3. `updateProfile(user, { displayName: codename })`
  4. `setDoc(doc(db, "users", user.uid), { codename, id: user.uid })` — retry once on failure
- `getSignupErrorMessage(error)` maps Firebase error codes to friendly strings:
  - `auth/email-already-in-use` → "That email is already registered."
  - `auth/weak-password` → "Password must be at least 6 characters."
  - `auth/invalid-email` → "Please enter a valid email address."
  - Firestore failure → "Account created but profile setup failed. Please try logging in."
  - Default → "Something went wrong. Please try again."

### 3. `tests/lib/generateCodename.test.ts`

- Returns a non-empty PascalCase string
- Contains exactly 3 capitalized segments
- Produces varied results across multiple calls

### 4. `tests/lib/signup.test.ts`

(No need for mocks)

- Happy path: verifies all three calls happen in order, Firestore doc has only `codename` and `id`
- Auth error propagates, no subsequent calls made
- `getSignupErrorMessage` returns correct strings for each code

## Files to Modify

### 5. `components/AuthForm/AuthForm.module.css`

- Add `.error` class: `@apply text-error text-sm text-center`

### 6. `components/AuthForm/AuthForm.tsx`

- Add `error`, `loading` state
- Add `useRouter` from `next/navigation`
- Import `signup`, `getSignupErrorMessage` from `@/lib/signup`
- Make `handleSubmit` async; when `mode === "signup"`:
  - Set loading, clear error, call `signup(email, password)`
  - On success: `router.push("/heists")`
  - On failure: `setError(getSignupErrorMessage(err))`
  - Finally: clear loading
- Login path unchanged (still `console.log`)
- Add error `<p role="alert">` above form fields
- Disable inputs and button while loading; button text → "Signing up..." during load

### 7. `tests/components/AuthForm.test.tsx`

- Add `describe("signup mode", ...)` with tests:
  - Calls `signup` with email/password on submit
  - Redirects to `/heists` on success
  - Displays error on failure via `role="alert"`
  - Disables form during loading
  - Shows "Signing up..." button text during submission

## Implementation Order

| Step | File | Action |
|------|------|--------|
| 1 | `lib/generateCodename.ts` | Create |
| 2 | `tests/lib/generateCodename.test.ts` | Create + run |
| 3 | `lib/signup.ts` | Create |
| 4 | `tests/lib/signup.test.ts` | Create + run |
| 5 | `components/AuthForm/AuthForm.module.css` | Add `.error` |
| 6 | `components/AuthForm/AuthForm.tsx` | Integrate signup |
| 7 | `tests/components/AuthForm.test.tsx` | Add signup tests + run |

## Verification

1. `npm test` — all tests pass
2. `npm run build` — no type or build errors
3. Manual: visit `/signup`, create an account, verify redirect to `/heists`, check Firebase console for Auth user with codename displayName, check Firestore `users` collection for doc with `codename` + `id` only
