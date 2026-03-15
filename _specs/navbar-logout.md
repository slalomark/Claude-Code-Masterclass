# Spec for Navbar Logout

branch: claude/feature/navbar-logout
figma_component: LogoutButton

## Summary
Add a logout button to the existing Navbar component that signs the user out of Firebase Auth when clicked. The button should only be visible when the user is currently logged in. No redirect behaviour is required after logout at this stage.

## Functional Requirements
- Add a logout button inside the existing Navbar component.
- The button calls Firebase Auth's sign-out method when clicked.
- The button is only rendered when a user is currently authenticated.
- After sign-out, the user's auth state updates (logged out) but no page redirect occurs.
- The button text reads "Logout".

## Figma Design Reference
- File: https://www.figma.com/design/mIS3cmRtANeQkXP8E0vJu7/Page-Designs?node-id=57-18&m=dev
- Component name: LogoutButton
- Key visual constraints:
  - Outlined/ghost button style with a white 1px solid border and transparent background.
  - Rounded corners (10px border radius).
  - White "Logout" text, 16px Inter Regular, centered.
  - Button dimensions approximately 127px wide by 38px tall.
  - Should sit within the Navbar layout alongside existing nav items.

## Possible Edge Cases
- User clicks logout while a network request is in flight — sign-out should still proceed gracefully.
- User is already logged out — the button should simply not be visible, no error state needed.
- Rapid double-click on the logout button — should not trigger multiple sign-out calls or errors.

## Acceptance Criteria
- The logout button appears in the Navbar only when the user is authenticated.
- Clicking the button signs the user out via Firebase Auth.
- The button is not visible when no user is logged in.
- The button matches the Figma design reference (outlined style, white border, rounded corners, white text).

## Open Questions
- Should the button be disabled while the sign-out request is in progress, or is a simple click guard sufficient? Click guard sufficient.
- Where exactly in the Navbar should the button be positioned relative to other nav items? Left of the 'Create New Heist' button.

## Testing Guidelines
Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:
- The logout button renders when a user is authenticated.
- The logout button does not render when no user is authenticated.
- Clicking the logout button calls the Firebase sign-out function.
