# Spec for Expired Heist Card

branch: claude/feature/expired-heist-card
figma_component: Expired Heist Card

## Summary

Add an "Expired Heists" section to the bottom of the `/heists` page that displays heists whose deadline has passed. These heists are considered "Failed" and should be rendered using a new `ExpiredHeistCard` component with a distinct visual treatment (muted styling, failure icon, and a "FAILED" badge). The section should appear below the existing "Your Active Heists" and "Heists You've Assigned" sections.

## Functional Requirements

- Add a new section titled "Expired Heists" (or similar) at the bottom of the `/heists` page, below the two existing sections.
- Query or filter heists where the deadline has passed (i.e. `deadline < now`).
- Each expired heist renders using a new `ExpiredHeistCard` component that visually differs from the active `HeistCard`.
- The expired card should display:
  - A circle-X failure icon (in error color) next to the heist title.
  - The heist title.
  - The deadline date with a calendar icon.
  - A "FAILED" badge with uppercase text in the error color.
  - "To:" label with the assigned agent codename (primary color).
  - "By:" label with the creator codename (secondary color).
- Expired heist cards should not be clickable/navigable (unlike active heist cards).
- If there are no expired heists, the section should either be hidden or show an empty-state message.

## Figma Design Reference

- File: https://www.figma.com/design/mIS3cmRtANeQkXP8E0vJu7/Page-Designs?node-id=34-13&m=dev
- Component name: Expired Heist Card
- Key visual constraints:
  - Compact single-row card, ~86px tall, full container width.
  - Background: `--color-lighter` at 30% opacity with a semi-transparent border (`#1E2939` at 30% opacity), `border-radius: 10px`.
  - Title row: flex row with circle-X icon (16px, `--color-error`) + title (`Inter Medium`, 16px, white) on the left; date cluster + "FAILED" badge on the right.
  - "FAILED" badge: subtle error-tinted background (`rgba(255,100,103,0.05)`), thin error border, `border-radius: 4px`, uppercase 12px text in `--color-error`, `letter-spacing: 0.6px`.
  - Meta row: "To:" and "By:" labels in `--color-body` (14px), codenames in `--color-primary` and `--color-secondary` respectively, each preceded by a 12px person icon.
  - Icons are custom SVGs: circle-X (failure), calendar (date), person silhouette (To/By).

## Possible Edge Cases

- A heist has no deadline set — decide whether it can ever be "expired".
- Many expired heists — consider whether to limit the visible count or add pagination/scrolling.
- A heist's deadline just passed moments ago — ensure the filtering logic handles timezone and timing edge cases cleanly.
- The `finalStatus` field on a `Heist` may already have a value — decide whether expired status is derived from the deadline or stored in `finalStatus`.

## Acceptance Criteria

- An "Expired Heists" section appears at the bottom of the `/heists` page when there are expired heists.
- Each expired heist renders with the failure icon, "FAILED" badge, title, deadline, and assignee/creator info matching the Figma design.
- Active heists do not appear in the expired section and vice versa.
- The section is hidden or shows an appropriate empty state when there are no expired heists.
- The component is responsive and does not break the existing page layout.
- All existing tests continue to pass.

## Open Questions

- Should expired heists be determined purely by deadline date, or should `finalStatus` be set to "failed" in Firestore when a heist expires? If the heist has not been completed and it's past the deadline date, it should be failed.
- Should there be a limit on how many expired heists are shown (e.g. last 10)? No limit.
- Should expired heist cards link to a detail page, or remain non-interactive? Non-interactive.

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- `ExpiredHeistCard` renders title, deadline, assignee codename, creator codename, and "FAILED" badge.
- `ExpiredHeistCard` displays the failure icon.
- The expired heists section renders on the heists page when expired heists exist.
- The expired heists section is hidden or shows empty state when no expired heists exist.
- Active heists (future deadline) do not appear in the expired section.
