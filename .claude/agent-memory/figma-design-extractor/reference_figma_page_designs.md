---
name: Figma Page Designs file
description: Figma file ID and key node IDs for the Page Designs file used in this project
type: reference
---

Figma file: https://www.figma.com/design/mIS3cmRtANeQkXP8E0vJu7/Page-Designs

Key nodes inspected:
- HeistCard component: node-id=54-60 (https://www.figma.com/design/mIS3cmRtANeQkXP8E0vJu7/Page-Designs?node-id=54-60)
- ExpiredHeistCard component: node-id=34-13 (https://www.figma.com/design/mIS3cmRtANeQkXP8E0vJu7/Page-Designs?node-id=34-13)

Design tokens confirmed to match globals.css:
- Card background: #101828 at 30% opacity → `--color-lighter` with opacity modifier
- Body/label text: #99A1AF → `--color-body`
- Primary accent (To field username): #C27AFF → `--color-primary`
- Secondary accent (By field username): #FB64B6 → `--color-secondary`
- Error/failed badge text: #FF6467 → `--color-error`
- Error/failed badge background: rgba(255,100,103,0.05) — error at 5% opacity
- Error/failed badge border: rgba(255,100,103,0.2) — error at 20% opacity
- Card border: rgba(30,41,57,0.3) — #1E2939 not in theme, used semi-transparent
- Font: Inter → `--font-sans`

ExpiredHeistCard visual notes:
- Single-row compact card (~86px tall), no hover/expand affordance
- "FAILED" badge: uppercase, 12px, letter-spacing 0.6px, rounded-[4px], error color scheme
- Task title row: 16px medium white text + right-aligned date+badge cluster
- Meta row: To: @username (primary) and By: @username (secondary), 14px regular body text with person icons
- Small circle-X icon (16px) left of title indicating failure state
- Calendar icon (12px) left of date string
- Person icon (12px) left of each To/By label
