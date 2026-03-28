# Spec for Heist Card Component

branch: claude/feature/heist-card-component
figma_component: HeistCard

## Summary

Create a `HeistCard` component to display individual heist information on the `/heists` page, replacing the current plain-text rendering. Cards are shown in a responsive 3-column grid for the "active" and "assigned" sections only (expired heists are excluded from display). A `HeistCardSkeleton` component provides a loading placeholder in the same grid layout. The heist title on each card links to `/heists/:id` (the detail page itself is out of scope).

## Figma Design Reference

- File: [Page Designs](https://www.figma.com/design/mIS3cmRtANeQkXP8E0vJu7/Page-Designs?node-id=54-60&m=dev)
- Component name: HeistCard
- Key visual constraints:
  - Vertical flex column with `gap-3`, padding `px-5 pt-5 pb-0`, approximately 378px wide and 178px tall, `rounded-[10px]`
  - Background `bg-lighter` (`#101828`), border `#1e2939` (~0.8px solid), no shadow
  - All text uses Inter font. Title is 16px / leading-6 / tracking -0.02em / white. Metadata rows are 14px / leading-5 / `text-body` for labels
  - Label values use `text-primary` (`#C27AFF`) for "To" username and status, `text-secondary` (`#FB64B6`) for "By" username
  - Three metadata rows, each with a small icon (~12px): two person/user icons and one calendar icon, colored `text-body`
  - Clock/timer icon (~16px) in top-right of header, colored `text-primary`

## Functional Requirements

- Create a `HeistCard` component that accepts a `Heist` object and renders:
  - Heist title (linked to `/heists/{id}`) with a clock icon in the top-right
  - "To" row showing the assigned user's codename
  - "By" row showing the creator's codename
  - Deadline row showing a formatted date with a calendar icon
- Create a `HeistCardSkeleton` component that mimics the card layout with animated placeholder blocks
- Update the `/heists` page to:
  - Render `HeistCard` components in a 3-column responsive grid for "active" and "assigned" sections
  - Remove the expired heists section entirely from the page
  - Show `HeistCardSkeleton` components in the same grid layout during loading
- The heist title should be an anchor (`<Link>`) to `/heists/[id]` but the destination page does not need content yet
- Create an empty `/heists/[id]` route so the link does not 404

## Possible Edge Cases

- No heists returned for a section (show an empty state or hide the section)
- Very long heist titles (truncate or wrap gracefully within the card)
- Very long codenames overflowing their row
- Deadline dates in various formats and timezones

## Acceptance Criteria

- HeistCard displays all four fields (title, assignedTo codename, createdBy codename, deadline) matching the Figma design
- Title links navigate to `/heists/[id]`
- Only active and assigned heists are shown; expired section is removed
- A 3-column responsive grid layout is used (collapsing to fewer columns on smaller screens)
- HeistCardSkeleton renders animated placeholders in the same card dimensions
- Skeletons display in the grid while heist data is loading

## Open Questions

- Should the empty state for a section show a message or simply be hidden? Show a messag.
- Should the detail page (`/heists/[id]`) show a placeholder message or be completely blank? Blank for now is fine.
- What is the desired responsive breakpoint behavior (e.g., 1 column on mobile, 2 on tablet, 3 on desktop)? That's fine.

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- HeistCard renders the title, assignedTo codename, createdBy codename, and formatted deadline
- HeistCard title links to the correct `/heists/[id]` URL
- HeistCardSkeleton renders without errors and contains animated placeholder elements
- The heists page renders cards in a grid layout for active and assigned sections
- The heists page does not render expired heists
- The heists page shows skeletons during loading state
