# Spec for auth-state-management

branch: claude/feature/auth-state-management
figma_component (if used): N/A

## Summary

Implement a global auth state management solution using a React context and a `useUser` hook. The hook should expose the current Firebase user object (or `null` if logged out) and be accessible from any page or component in the app. Auth state should be driven by a Firebase realtime listener, so all subscribers update automatically when auth status changes.

## Functional Requirements

- Create a `UserProvider` context provider that wraps the app and subscribes to Firebase's `onAuthStateChanged` listener
- Expose a `useUser` hook that returns the current user (a Firebase `User` object) or `null` if not authenticated
- The hook must be usable from any page or component in both `(public)` and `(dashboard)` route groups
- The provider should handle the initial loading state before Firebase has resolved the current auth status (e.g. a `loading` boolean)
- Existing components that reference the user should be updated to use `useUser` instead of any previous approach
- No login, signup, or logout logic should be implemented in this spec

## Figma Design Reference (only if reference)

N/A

## Possible Edge Cases

- Firebase auth state is asynchronous on initial load — components must handle a `loading` state before `user` is known to avoid flash of incorrect content
- `useUser` called outside of `UserProvider` should throw a clear error
- User object should not be stale — the listener must always reflect the latest Firebase auth state

## Acceptance Criteria

- `useUser()` returns `null` when the user is logged out
- `useUser()` returns a Firebase `User` object when logged in
- `useUser()` can be called from any component in any route group without error
- The auth state updates automatically when Firebase auth state changes (no page refresh needed)
- The initial loading state is exposed via the hook so components can render a loading state
- Calling `useUser()` outside of `UserProvider` throws a descriptive error

## Open Questions

- Should `loading` be included in the `useUser` return value, or handled separately? Yes.
- Which components currently reference the user and need to be updated? Search codebase and confirm.
- Should the `UserProvider` wrap the entire app at the root layout level, or be scoped to the dashboard route group only? Entire app.

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- `useUser` returns `null` when no user is authenticated
- `useUser` returns the user object when authenticated
- `useUser` exposes a `loading: true` state before Firebase has resolved
- Calling `useUser` outside of `UserProvider` throws an error
- Auth state updates correctly when Firebase fires a new auth change event
