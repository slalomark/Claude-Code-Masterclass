# Plan: Login Form Submit

## Context

The login form at `app/(public)/login/` currently stubs out submission with a `console.log`. We need to wire it up to Firebase `signInWithEmailAndPassword`, show a success message styled like the Navbar logout button, and handle errors. The success message should auto-dismiss after a short delay. No redirect needed. Spec: `_specs/login-form-submit.md`.

## Step 1: Create `lib/login.ts`

Mirror the pattern in `lib/signup.ts`.

- `export async function login(email: string, password: string): Promise<void>` — calls `signInWithEmailAndPassword(auth, email, password)` from `firebase/auth`
- `export function getLoginErrorMessage(error: unknown): string` — maps Firebase error codes:
  - `auth/invalid-credential` → "Invalid email or password."
  - `auth/invalid-email` → "Please enter a valid email address."
  - `auth/user-disabled` → "This account has been disabled."
  - `auth/too-many-requests` → "Too many failed attempts. Please try again later."
  - Fallback: "Login failed. Please try again."

## Step 2: Add `.success` class to `components/AuthForm/AuthForm.module.css`

Add after `.error`:

```css
.success {
  @apply bg-transparent border border-white text-white text-base font-normal px-4 py-2 rounded-[10px] text-center;
}
```

Matches `.logoutBtn` from `Navbar.module.css` but without cursor/hover styles (it's a message, not a button).

## Step 3: Modify `components/AuthForm/AuthForm.tsx`

- Add `useEffect` to React import
- Import `login`, `getLoginErrorMessage` from `@/lib/login`
- Add `success` state: `const [success, setSuccess] = useState<string | null>(null)`
- Add auto-dismiss effect:
  ```ts
  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(null), 3000);
    return () => clearTimeout(timer);
  }, [success]);
  ```
- Replace the login stub (`console.log` block, lines 25-28) with:
  ```ts
  setError(null);
  setSuccess(null);
  setLoading(true);
  try {
    await login(email, password);
    setSuccess("Login successful!");
  } catch (err) {
    setError(getLoginErrorMessage(err));
  } finally {
    setLoading(false);
  }
  return;
  ```
- Update button loading text to show "Logging in..." for login mode
- Add success message JSX after the error block:
  ```tsx
  {success && (
    <p role="status" className={styles.success}>
      {success}
    </p>
  )}
  ```

## Step 4: Update `tests/components/AuthForm.test.tsx`

Two tests reference `console.log` for login mode and will break:
- Line 51-58: "clicking the toggle does not submit the form" — update to check `mockLogin` was not called instead of spying on `console.log`
- Line 60-74: "submitting the form logs email and password" — remove entirely (replaced by new test file)

Both require adding a `login` mock to this file's mock setup.

## Step 5: Create `tests/lib/login.test.ts`

Follow `tests/lib/logout.test.ts` pattern:
- Mock `@/lib/firebase` as `{ auth: {} }`
- Mock `firebase/auth` with `signInWithEmailAndPassword` as `vi.fn()`
- Tests: verify correct args passed, verify errors propagate
- Tests for `getLoginErrorMessage`: each mapped code + unknown fallback

## Step 6: Create `tests/components/AuthForm.login.test.tsx`

Follow `tests/components/AuthForm.test.tsx` pattern. Must also mock `@/lib/signup` and `@/lib/login`.

Tests:
1. Calls `login` with email and password on submit
2. Shows "Logging in..." loading state and disables inputs
3. Displays success message (`role="status"`) on success
4. Does not redirect after success (`mockPush` not called)
5. Does not clear form fields after success
6. Displays error message on failure
7. Success message auto-dismisses after 3s (use `vi.useFakeTimers()` + `userEvent.setup({ advanceTimers: vi.advanceTimersByTime })`)

## Verification

1. `npx vitest tests/lib/login.test.ts` — unit tests pass
2. `npx vitest tests/components/AuthForm.login.test.tsx` — integration tests pass
3. `npx vitest tests/components/AuthForm.test.tsx` — existing tests still pass
4. `npm test` — full suite passes
5. `npm run build` — no type errors
6. Manual: visit `/login`, submit with valid/invalid credentials, confirm success message appears and auto-dismisses
