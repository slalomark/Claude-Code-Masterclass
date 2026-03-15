# Plan: Navbar Logout Button

## Context
The Navbar currently has no auth awareness. We need to add a logout button that appears only when a user is authenticated and calls Firebase Auth's `signOut()` on click. No redirect after logout is needed yet. The `useUser` hook from `lib/UserContext.tsx` already provides `{ user, loading }` — we just need to consume it.

## Spec
`_specs/navbar-logout.md`

## Changes

### 1. Create `lib/logout.ts` — sign-out utility
- Export an async `logout()` function that calls `signOut(auth)` from `firebase/auth`
- Import `auth` from `@/lib/firebase`
- Keep it minimal — just wraps `signOut`, no error transformation needed

### 2. Update `components/Navbar/Navbar.tsx` — add logout button
- Add `"use client"` directive (needed for `useUser` hook)
- Import `useUser` from `@/lib/UserContext`
- Import `logout` from `@/lib/logout`
- Conditionally render a `<button>` with text "Logout" when `user` is not null
- The button calls `logout()` on click
- Add the button as a new `<li>` in the existing `<ul>` alongside the "Create New Heist" link
- Apply an outline button style matching the Figma design (see step 3)

### 3. Update `components/Navbar/Navbar.module.css` — logout button style
- Add a `.logoutBtn` class with styles matching the Figma reference:
  - Transparent background, 1px solid white border
  - 10px border radius, white text, 16px font
  - Hover state with slight opacity change for feedback

### 4. Create `tests/lib/logout.test.ts` — unit test for logout utility
- Mock `@/lib/firebase` (same pattern as `signup.test.ts`)
- Mock `firebase/auth` with a mock `signOut`
- Test that `logout()` calls `signOut` with the `auth` instance

### 5. Update `tests/components/Navbar.test.tsx` — component tests
- Mock `@/lib/UserContext` to control `useUser` return value
- Mock `@/lib/logout` to provide a mock `logout` function
- Add tests:
  - Logout button renders when user is authenticated
  - Logout button does NOT render when user is null
  - Clicking logout button calls the `logout` function

## Files to modify
- `lib/logout.ts` (new)
- `components/Navbar/Navbar.tsx` (edit)
- `components/Navbar/Navbar.module.css` (edit)
- `tests/lib/logout.test.ts` (new)
- `tests/components/Navbar.test.tsx` (edit)

## Verification
1. `npm test` — all tests pass
2. `npm run build` — no build errors
3. Manual: visit `/heists` logged in → logout button visible; click it → auth state clears; visit logged out → no logout button
