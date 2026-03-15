# Spec for Route Protection

branch: claude/feature/route-protection

## Summary

Add client-side route protection to both the `(public)` and `(dashboard)` route groups. Authenticated users visiting public pages (`/login`, `/signup`, `/preview`, `/`) should be redirected to `/heists`. Unauthenticated users visiting dashboard pages (`/heists/*`) should be redirected to `/login`. While Firebase is resolving the auth state, both group layouts should display a simple full-page loader instead of the page content.

## Functional Requirements

- The `(public)` layout should use the `useUser` hook to check auth state.
  - If `loading` is `true`, render a simple centered loader (e.g. "Loading..." text or a spinner).
  - If `loading` is `false` and `user` is not null, redirect to `/heists`.
  - If `loading` is `false` and `user` is null, render children normally.
- The `(dashboard)` layout should use the `useUser` hook to check auth state.
  - If `loading` is `true`, render a simple centered loader.
  - If `loading` is `false` and `user` is null, redirect to `/login`.
  - If `loading` is `false` and `user` is not null, render children normally (with the existing `Navbar`).
- Redirects should use Next.js client-side navigation (e.g. `useRouter` from `next/navigation`).
- Both layouts must become client components (`"use client"`) since they will use hooks.
- The loader should be minimal — centered on the page, using existing Tailwind utility classes. No complex skeleton or animation required.

## Possible Edge Cases

- User logs out while on a dashboard page — should be redirected to `/login` as the `user` state becomes null.
- User logs in while on a public page (e.g. signup completes) — existing auth flow should handle navigation, but the layout redirect acts as a fallback.
- Deep links to dashboard routes (e.g. `/heists/some-id`) when unauthenticated should redirect to `/login`.
- The splash page (`/`) currently has no auth routing — this implementation covers that gap by redirecting logged-in users to `/heists` via the public layout.

## Acceptance Criteria

- Unauthenticated users cannot see any page under `(dashboard)` — they are redirected to `/login`.
- Authenticated users visiting `/login`, `/signup`, `/preview`, or `/` are redirected to `/heists`.
- A loader is visible in both layouts while Firebase auth state is being determined.
- No flash of protected content before redirect occurs.
- Existing `Navbar` and dashboard layout structure remain intact after the guard is added.

## Open Questions

- Should the loader use a spinner component or is plain "Loading..." text sufficient for now? Use a spinner based on the clock icon in the title.
- Should we preserve the intended destination URL so users can be redirected back after login (i.e. return URL pattern)? No.

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- Public layout redirects to `/heists` when user is authenticated.
- Public layout renders children when user is not authenticated.
- Public layout shows loader while auth state is loading.
- Dashboard layout redirects to `/login` when user is not authenticated.
- Dashboard layout renders children when user is authenticated.
- Dashboard layout shows loader while auth state is loading.
