# Spec for Login Form Submit

branch: claude/feature/login-form-submit

## Summary

Wire up the login form in `app/(public)/login/` so that submitting valid credentials authenticates the user via Firebase and displays a success message inline. Currently the `handleSubmit` function in `AuthForm` only logs the credentials to the console when `mode === "login"`. This feature replaces that placeholder with a real login call and post-login feedback. No redirect is needed at this stage.

## Functional Requirements

- When the user submits the login form with valid email and password, call the Firebase `signInWithEmailAndPassword` function (mirroring how `signup` already works in `lib/signup.ts`).
- While the login request is in flight, disable the form inputs and show a loading state on the submit button (e.g. "Logging in...").
- On successful login, display a visible success message (e.g. "Login successful!") within the form area. Do not redirect the user.
- On failed login (wrong credentials, network error, etc.), display a user-friendly error message in the existing error area (`role="alert"`). Map Firebase error codes to readable messages (e.g. `auth/invalid-credential` → "Invalid email or password.").
- Create a `login` helper function in a new `lib/login.ts` file, following the same pattern as `lib/signup.ts`.
- Create a `getLoginErrorMessage` helper in the same file for mapping Firebase auth error codes to user-facing strings.
- The success message should use the same styling as the logout button in the Navbar (`.logoutBtn` style: transparent background, white border, white text, rounded corners). Apply this as a styled element within the form, not as an actual button.

## Possible Edge Cases

- User submits with empty fields (handled by HTML `required` attribute).
- User submits while a previous request is still in flight (button should be disabled during loading).
- Firebase returns an unexpected error code — fall back to a generic "Login failed. Please try again." message.
- Network timeout or offline state — the generic fallback message should cover this.

## Acceptance Criteria

- Submitting the login form with correct credentials calls Firebase auth and shows a success message.
- Submitting with incorrect credentials shows an appropriate error message.
- The form is disabled during the login request.
- The success message element uses the same visual style as the Navbar logout button (transparent bg, white border, white text, rounded).
- No page redirect occurs after login.
- A `lib/login.ts` module exists with `login` and `getLoginErrorMessage` exports.

## Open Questions

- Should the success message auto-dismiss after a delay, or persist until the user navigates away? Auto-dismiss after a short delay.
- Should the form fields be cleared after a successful login? No.

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- `tests/lib/login.test.ts` — unit tests for the `login` function: verifies it calls `signInWithEmailAndPassword` with the correct arguments, and that `getLoginErrorMessage` maps known Firebase error codes to friendly strings.
- `tests/components/AuthForm.login.test.tsx` — integration tests for the AuthForm in login mode: verifies that submitting shows a loading state, displays a success message on success, and displays an error message on failure.
