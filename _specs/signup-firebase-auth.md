# Spec for signup-firebase-auth

branch: claude/feature/signup-firebase-auth

## Summary

Hook the existing signup form at `app/(public)/signup/` into Firebase Authentication. On successful account creation, generate a random PascalCase codename for the user by combining words from three distinct word sets, set it as the Firebase `displayName`, and persist it (along with the user's UID) to a Firestore `users` collection document. Email must never be stored in Firestore. Only the Firebase Web SDK may be used, via the existing exports in `lib/firebase.ts`.

## Functional Requirements

- When the signup form is submitted, call Firebase Auth `createUserWithEmailAndPassword` using the `auth` export from `lib/firebase.ts`.
- After successful account creation, generate a random codename by selecting one word from each of three unique word sets and joining them in PascalCase (e.g. `SwiftCrimsonFox`).
- Update the Firebase Auth user profile `displayName` field with the generated codename using `updateProfile`.
- Create a document in the Firestore `users` collection using the `db` export from `lib/firebase.ts`. The document ID should be the user's UID. The document must contain:
  - `codename` — the generated PascalCase display name
  - `id` — the user's Firebase UID
  - The document must NOT contain the user's email or any other PII.
- Handle and display errors from Firebase Auth (e.g. email already in use, weak password) to the user in the form.
- On success, redirect the user to the `/heists` dashboard route.
- The codename word sets must each contain unique words and be clearly separated by category (e.g. adjective, color, animal — or similar thematic sets).

## Possible Edge Cases

- Firebase Auth call fails (network error, email already in use, weak password) — form should surface a readable error message.
- Firestore write fails after successful Auth signup — the user is authenticated but has no `users` doc; error should be surfaced and ideally the partial state noted.
- Codename generation produces a duplicate across users — acceptable for now; no uniqueness check required.
- User submits the form multiple times quickly — form should be disabled or show a loading state during the async operation.
- Word sets are empty or misconfigured — should fail loudly at build/runtime rather than silently produce a malformed codename.

## Acceptance Criteria

- Submitting the signup form with valid credentials creates a new Firebase Auth user.
- The new user's `displayName` in Firebase Auth is set to a randomly generated PascalCase codename.
- A document exists in the `users` Firestore collection with the user's UID as the document ID, containing `codename` and `id` fields only.
- No email address is stored in the Firestore `users` document.
- Auth or Firestore errors are displayed to the user in the form UI.
- The form shows a loading/disabled state while the signup operation is in progress.
- On success, the user is redirected to `/heists`.
- Codenames always follow PascalCase and consist of exactly three words, one from each word set.

## Open Questions

- Should the three word sets be adjective/color/animal, or a different thematic grouping? (Current requirement says "3 different sets of unique words" — exact theme TBD.) You decide.
- How many words should each set contain? A larger set reduces codename collision probability. 10.
- Should the Firestore write failure after a successful Auth signup trigger a sign-out or retry flow? Retry.

## Testing Guidelines

Create a test file at `tests/lib/generateCodename.test.ts` and `tests/components/SignupForm.test.tsx` (or equivalent) covering:

- Codename generation always returns a string in PascalCase.
- Codename always consists of exactly three words, one from each set.
- Each run can produce a different codename (randomness check over multiple calls).
- Signup form calls Firebase Auth `createUserWithEmailAndPassword` on submit.
- On success, `updateProfile` is called with a generated codename.
- On success, a Firestore document is written with `codename` and `id` fields (no email).
- On success, the user is redirected to `/heists`.
- Firebase Auth errors are displayed in the form.
- The form is disabled/loading during submission.
