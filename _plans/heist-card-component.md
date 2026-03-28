# Plan: Heist Card Component

## Context

The `/heists` page currently renders heist data as plain `<p>` tags. This plan implements the HeistCard component (matching Figma design), a skeleton loading state, and a responsive grid layout. The expired heists section is removed per spec. Empty sections show a message.

**Spec:** `_specs/heist-card-component.md`
**Branch:** `claude/feature/heist-card-component`

---

## Step 1: Create HeistCard component (TDD)

### Test first: `tests/components/HeistCard.test.tsx`
- Render with a fixture `Heist` object
- Assert: title text rendered, title is a link to `/heists/{id}`, assignedToCodename shown, createdByCodename shown, formatted deadline shown

### Component: `components/HeistCard/HeistCard.tsx`
- Props: `{ heist: Heist }`
- Structure:
  - Header row: `Link` wrapping title + `Clock` icon top-right (16px, text-primary)
  - Meta row 1: `User` icon (12px) + "To:" label (text-body) + assignedToCodename (text-primary)
  - Meta row 2: `User` icon (12px) + "By:" label (text-body) + createdByCodename (text-secondary)
  - Meta row 3: `Calendar` icon (12px) + formatted deadline (text-body)
- Date format: `heist.deadline.toLocaleDateString()` (simple, no external lib)

### Styles: `components/HeistCard/HeistCard.module.css`
- `.card` — flex col, gap-3, px-5 pt-5 pb-0, rounded-[10px], bg-lighter, border-[#1e2939], w-full
- `.header` — flex, justify-between, items-start
- `.title` — text-base, leading-6, tracking-[-0.02em], text-heading
- `.clockIcon` — text-primary, flex-shrink-0
- `.metaRow` — flex, items-center, gap-2, text-sm, leading-5
- `.metaLabel` — text-body
- `.toValue` — text-primary
- `.byValue` — text-secondary

### Barrel: `components/HeistCard/index.ts`

---

## Step 2: Create HeistCardSkeleton component (TDD)

### Test: `tests/components/HeistCardSkeleton.test.tsx`
- Renders without error
- Has `role="status"` and `aria-label="Loading"`
- Contains animated placeholder elements

### Component: `components/HeistCardSkeleton/HeistCardSkeleton.tsx`
- No props
- Same outer card shell (dimensions, bg, border, padding)
- Placeholder bars: title bar (75% width), three meta row bars (50% width), icon circles
- All bars use `bg-[#1e2939]` with CSS pulse animation

### Styles: `components/HeistCardSkeleton/HeistCardSkeleton.module.css`
- Same card shell styles as HeistCard
- `.bar` — rounded, bg-[#1e2939], pulse animation (1.5s ease-in-out infinite, opacity 1→0.4→1)
- Size variants: `.barTitle` (h-5 w-3/4), `.barMeta` (h-4 w-1/2), `.barIcon` (h-4 w-4 rounded-full)

### Barrel: `components/HeistCardSkeleton/index.ts`

---

## Step 3: Update heists page

### Modify: `app/(dashboard)/heists/page.tsx`
- Remove `useHeists("expired")` call and all expired-related code
- Import `HeistCard` and `HeistCardSkeleton`
- Loading state: render two sections each with a 3-skeleton grid (instead of `<Loader />`)
- Data state: render HeistCard in responsive grid `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`
- Empty state: `<p>` message per section when `heists.length === 0` (e.g., "No active heists right now.")
- Each section has `<h2>` heading + grid container

---

## Step 4: Create empty detail route

### Create: `app/(dashboard)/heists/[id]/page.tsx`
- Minimal page component, blank content (per spec answer)

---

## Step 5: Verify

- `npm test` — all tests pass
- `npm run lint` — no lint errors
- `npm run build` — clean build
- Manual check: `npm run dev` → visit `/heists`, verify grid layout, skeleton loading, card rendering, link navigation

---

## Key Files

| Action | Path |
|--------|------|
| Create | `components/HeistCard/HeistCard.tsx` |
| Create | `components/HeistCard/HeistCard.module.css` |
| Create | `components/HeistCard/index.ts` |
| Create | `components/HeistCardSkeleton/HeistCardSkeleton.tsx` |
| Create | `components/HeistCardSkeleton/HeistCardSkeleton.module.css` |
| Create | `components/HeistCardSkeleton/index.ts` |
| Create | `app/(dashboard)/heists/[id]/page.tsx` |
| Create | `tests/components/HeistCard.test.tsx` |
| Create | `tests/components/HeistCardSkeleton.test.tsx` |
| Modify | `app/(dashboard)/heists/page.tsx` |

## Reuse

- `Heist` type from `@/types/firestore`
- `useHeists` hook from `@/hooks` (existing, unchanged)
- `Clock`, `User`, `Calendar` icons from `lucide-react`
- CSS module pattern with `@reference "../../app/globals.css"` + `@apply`
- Theme tokens: `bg-lighter`, `text-primary`, `text-secondary`, `text-body`, `text-heading`
- Accessibility pattern from `Loader` component: `role="status"` + `aria-label="Loading"`
