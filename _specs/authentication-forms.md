# Spec for authentication-forms

branch: claude/feature/authentication-forms
figma_component (if used): N/A

## Summary
Build reusable authentication forms for the `/login` and `/signup` pages. Each form includes email and password fields, a toggle to show/hide the password, and a submit button. On submission, form data is logged to the console. Users can easily navigate between the login and signup forms via a link/toggle.

## Functional Requirements
- Email input field (type email) with appropriate label
- Password input field with a show/hide toggle icon button
- Submit button labeled "Login" on the login form and "Sign Up" on the signup form
- On form submission, log the email and password values to the console (no real auth yet)
- A clearly visible link/prompt to switch between the login and signup forms (e.g. "Don't have an account? Sign up" and "Already have an account? Log in")
- Forms should be built as a shared component or in a way that avoids duplication between the two pages

## Figma Design Reference (only if reference)
- N/A

## Possible Edge Cases
- User submits with empty email or password field
- User submits with an invalid email format
- Password toggle state should reset when navigating between forms
- Clicking the hide/show icon should not submit the form

## Acceptance Criteria
- `/login` renders an email field, password field with show/hide toggle, and a "Login" submit button
- `/signup` renders an email field, password field with show/hide toggle, and a "Sign Up" submit button
- Submitting either form logs `{ email, password }` to the browser console
- Password is hidden by default; clicking the toggle reveals/hides it
- Each page has a working link to switch to the other form page
- Forms are accessible: inputs have associated labels, button has a descriptive aria-label or visible text

## Open Questions
- Should the shared form be a standalone component (e.g. `AuthForm`) or built inline per page? Standalone component.
- Should basic HTML5 validation be used, or deferred until real auth is implemented? Light validation.
- Any specific icon library already in use for the show/hide password icon? No.

## Testing Guidelines
Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:
- Renders email and password fields
- Password field is hidden by default (type="password")
- Clicking the show/hide toggle changes the password field visibility (type="text")
- Clicking the show/hide toggle does not submit the form
- Submitting the form calls console.log with the correct email and password values
- A link to switch between login and signup is present and points to the correct route
