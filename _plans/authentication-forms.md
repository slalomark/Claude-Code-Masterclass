# Plan: Authentication Forms

## Context
The `/login` and `/signup` pages are empty scaffolds. This plan adds a shared `AuthForm` component that renders email/password fields, a show/hide password toggle, and a submit button. Submitting logs form data to the console. Each form links to the other page so users can switch between them.

---

## Files to Create

### `components/AuthForm/AuthForm.tsx`
- Client component (`"use client"`)
- Props: `mode: "login" | "signup"`
- Local state: `email`, `password`, `showPassword` (boolean, default `false`)
- Email input: `type="email"`, required, basic HTML5 validation
- Password input: `type={showPassword ? "text" : "password"}`, required
- Show/hide toggle button using `lucide-react` icons `Eye` / `EyeOff`; `type="button"` to prevent form submission; `aria-label="Show password"` / `"Hide password"`
- Submit button: label is `"Log In"` when `mode="login"`, `"Sign Up"` when `mode="signup"`; uses existing `.btn` utility class
- On submit: `e.preventDefault()`, then `console.log({ email, password })`
- Switch link: `"Don't have an account? Sign up"` → `/signup` when login mode; `"Already have an account? Log in"` → `/login` when signup mode
- Styled via `AuthForm.module.css`

### `components/AuthForm/AuthForm.module.css`
- Scoped styles for the form layout, input fields, password wrapper (relative positioning for toggle button), and switch link
- Use `@reference "../../app/globals.css"` to access theme tokens
- Inputs styled with `--color-lighter` background, `--color-body` text, border, and focus ring using `--color-primary`

### `components/AuthForm/index.ts`
- Barrel export: `export { default } from './AuthForm'`

### `tests/components/AuthForm.test.tsx`
Tests (using Vitest globals + React Testing Library + `@testing-library/user-event`):
- Renders email and password fields
- Password field is hidden by default (`type="password"`)
- Clicking the show/hide toggle reveals the password (`type="text"`)
- Clicking the toggle again hides it (`type="password"`)
- Clicking the toggle does not submit the form (console.log not called)
- Submitting the form calls `console.log` with correct `{ email, password }`
- Login mode renders a "Log In" button and a link to `/signup`
- Signup mode renders a "Sign Up" button and a link to `/login`

---

## Files to Modify

### `app/(public)/login/page.tsx`
Replace the placeholder content inside `.page-content` with `<AuthForm mode="login" />`.

### `app/(public)/signup/page.tsx`
Replace the placeholder content inside `.page-content` with `<AuthForm mode="signup" />`.

---

## Verification
1. Run `npm run dev` and visit `/login` and `/signup` — forms should render with correct labels, inputs, toggle, and switch links
2. Submit each form with test values — check browser console for `{ email, password }`
3. Toggle the password visibility on both pages
4. Click the switch link on each page to confirm navigation
5. Run `npx vitest tests/components/AuthForm.test.tsx` — all tests should pass
