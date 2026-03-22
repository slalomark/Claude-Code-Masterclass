# Spec for Create Heist Form

branch: claude/feature/create-heist-form

## Summary

Build the "Create a New Heist" form on the existing page at `app/(dashboard)/heists/create/page.tsx`. The form collects user input matching the `CreateHeistInput` interface, writes a new document to the Firestore `heists` collection on submission, and redirects the user to `/heists`. The `createdAt` timestamp is set via `serverTimestamp()` and the `deadline` is automatically calculated as 48 hours from creation time. Users are selected from the Firestore `users` collection so the heist can be assigned to any registered user.

## Functional Requirements

- Display a form with the following user-editable fields:
  - **Title** — text input (required)
  - **Description** — textarea (required)
  - **Assigned To** — dropdown/select populated from the `users` collection, displaying each user's codename and storing their user ID and codename
- The following fields are set programmatically (not shown as editable inputs):
  - `createdBy` — the currently authenticated user's ID
  - `createdByCodename` — the currently authenticated user's codename
  - `deadline` — automatically set to 48 hours from the current time
  - `finalStatus` — set to `null`
  - `createdAt` — set via Firestore `serverTimestamp()`
- On form submission:
  - Validate all required fields are filled
  - Create a new document in the `heists` Firestore collection using the `CreateHeistInput` interface
  - Show a loading/disabled state on the submit button while the write is in progress
  - On success, redirect the user to `/heists`
  - On failure, display an inline error message without losing the user's input
- Fetch the list of users (codenames and IDs) from the Firestore `users` collection on page load to populate the "Assigned To" dropdown

## Possible Edge Cases

- The `users` collection is empty or the fetch fails — show a meaningful message and disable the "Assigned To" field
- Network error during document creation — display an error and keep the form populated so the user can retry
- User submits the form multiple times quickly — disable the submit button after the first click to prevent duplicate documents
- Very long title or description — consider reasonable max-length constraints on the inputs
- The authenticated user's session has expired — handle the auth error gracefully

## Acceptance Criteria

- The form renders inside the existing `CreateHeistPage` component using the project's shared CSS classes (`center-content`, `page-content`, `form-title`, `btn`)
- All fields from `CreateHeistInput` are correctly populated when the document is written to Firestore
- The "Assigned To" dropdown is populated with codenames fetched from the `users` collection
- `createdAt` uses `serverTimestamp()` and `deadline` is set to 48 hours from now
- After a successful submission the user is redirected to `/heists`
- Form validation prevents submission with empty required fields
- An error state is displayed if the Firestore write fails
- The submit button is disabled while the write is in progress

## Open Questions

- Is there a `users` Firestore type/interface defined yet, or does one need to be created? Figure this out by analyzing codebase.
- Should the current user be excluded from the "Assigned To" dropdown (i.e., can a user assign a heist to themselves)? Yes.
- Is there an existing auth context/hook that provides the current user's ID and codename? Yes.

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- Form renders all expected fields (title, description, assigned-to dropdown, submit button)
- Submit button is disabled when required fields are empty
- Submit button shows a loading/disabled state during submission
- Successful submission calls Firestore `addDoc` with the correct data shape matching `CreateHeistInput`
- Error state is displayed when the Firestore write fails
- The "Assigned To" dropdown renders options from a mocked users list
