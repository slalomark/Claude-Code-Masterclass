# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server at localhost:3000
npm run build     # Production build
npm run lint      # ESLint
npm test          # Run all tests with Vitest
npx vitest tests/components/Navbar.test.tsx  # Run a single test file
```

## Architecture

**Next.js 16 App Router** with two route groups that share no layout:

- `app/(public)/` — unauthenticated pages (splash `/`, `/login`, `/signup`, `/preview`). The splash page (`page.tsx`) is intended to redirect to `/heists` when logged in or `/login` when not — auth routing is not yet implemented.
- `app/(dashboard)/` — authenticated pages under `/heists`. Layout wraps all dashboard pages with the `Navbar` component.

**Path alias:** `@/` maps to the repo root (e.g. `@/components/Navbar`).

**Styling:** Tailwind CSS v4 with a custom theme defined in `app/globals.css` via `@theme`. Shared utility classes (`.page-content`, `.center-content`, `.form-title`) are also defined there. Component-scoped styles use CSS Modules (e.g. `Navbar.module.css`).

**Components** live in `components/<ComponentName>/` with an `index.ts` barrel export.

**Tests** mirror the component path under `tests/` and use Vitest + Testing Library with jsdom. Vitest globals are enabled — no need to import `describe`/`it`/`expect`.

## Rules

When checking out a branch use `git switch -c` syntax.
