# Plan: Expired Heist Card Component

## Context

The `/heists` page currently shows two sections: "Your Active Heists" and "Heists You've Assigned". We need to add a third section at the bottom for expired heists — those past their deadline that were never completed. These render as "Failed" using a new compact `ExpiredHeistCard` component with distinct visual treatment per the Figma design.

## Step 1: Fix the `useHeists` expired filter

**File:** `hooks/useHeists.ts` (line 64)

The hook already supports an `"expired"` filter, but the client-side filter logic is inverted. It currently keeps heists where `finalStatus !== null` (resolved heists). Per the spec, expired means **past deadline AND not completed** — so change to `finalStatus === null`.

```
- results = results.filter((heist) => heist.finalStatus !== null);
+ results = results.filter((heist) => heist.finalStatus === null);
```

No other code uses the `"expired"` filter today, so this is safe.

## Step 2: Create the `ExpiredHeistCard` component

Three files following the existing component pattern:

**`components/ExpiredHeistCard/ExpiredHeistCard.tsx`**
- Props: `{ heist: Heist }`
- Non-interactive (no links, no hover states)
- Two-row layout matching Figma:
  - **Row 1 (header):** `CircleX` icon (16px, error color) + title (16px, white) on left; `Calendar` icon + deadline date + "FAILED" badge on right
  - **Row 2 (meta):** "To:" + `assignedToCodename` (primary) and "By:" + `createdByCodename` (secondary) with `User` icons (12px)
- Icons: `CircleX`, `User`, `Calendar` from `lucide-react`

**`components/ExpiredHeistCard/ExpiredHeistCard.module.css`**
- Uses `@reference "../../app/globals.css"` pattern
- Card: `rgba(16,24,40,0.3)` background, `rgba(30,41,57,0.3)` border, `border-radius: 10px`, compact height
- FAILED badge: `rgba(255,100,103,0.05)` bg, thin error border, 4px radius, uppercase 12px text in `--color-error`, `letter-spacing: 0.6px`
- Reuse same token patterns as HeistCard for meta labels/values

**`components/ExpiredHeistCard/index.ts`**
- `export { default } from "./ExpiredHeistCard";`

## Step 3: Update the heists page

**File:** `app/(dashboard)/heists/page.tsx`

- Import `ExpiredHeistCard`
- Add `const expired = useHeists("expired")`
- Include `expired.loading` and `expired.error` in existing checks
- After the "Heists You've Assigned" section, conditionally render:
  - Only if `expired.heists.length > 0` (hidden when empty)
  - Section heading: "Expired Heists"
  - Same `GRID` class for responsive layout
  - Map heists to `<ExpiredHeistCard>`

## Step 4: Write tests

**File:** `tests/components/ExpiredHeistCard.test.tsx`

Following the pattern in `tests/components/HeistCard.test.tsx`:
- Create a `mockExpiredHeist` with past deadline and `finalStatus: null`
- Test: renders heist title as plain text (not a link)
- Test: displays "FAILED" badge text
- Test: displays `CircleX` failure icon
- Test: shows assigned-to and created-by codenames
- Test: shows formatted deadline date

## Verification

1. Run `npm test` — all existing + new tests pass
2. Run `npm run build` — no type errors
3. Run `npm run dev` — visually verify the expired section appears at bottom of `/heists` with correct styling
