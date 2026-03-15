import { login, getLoginErrorMessage } from "@/lib/login";
import { auth } from "@/lib/firebase";

vi.mock("@/lib/firebase", () => ({ auth: {} }));

const mockSignIn = vi.fn();
vi.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: (...args: unknown[]) => mockSignIn(...args),
}));

describe("login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSignIn.mockResolvedValue(undefined);
  });

  it("calls signInWithEmailAndPassword with auth and credentials", async () => {
    await login("test@example.com", "password123");
    expect(mockSignIn).toHaveBeenCalledWith(
      auth,
      "test@example.com",
      "password123",
    );
  });

  it("propagates Firebase errors", async () => {
    mockSignIn.mockRejectedValue(new Error("auth failed"));
    await expect(login("test@example.com", "wrong")).rejects.toThrow(
      "auth failed",
    );
  });
});

describe("getLoginErrorMessage", () => {
  it("returns friendly message for auth/invalid-credential", () => {
    const error = Object.assign(new Error(), {
      code: "auth/invalid-credential",
    });
    expect(getLoginErrorMessage(error)).toBe("Invalid email or password.");
  });

  it("returns friendly message for auth/invalid-email", () => {
    const error = Object.assign(new Error(), { code: "auth/invalid-email" });
    expect(getLoginErrorMessage(error)).toBe(
      "Please enter a valid email address.",
    );
  });

  it("returns friendly message for auth/user-disabled", () => {
    const error = Object.assign(new Error(), { code: "auth/user-disabled" });
    expect(getLoginErrorMessage(error)).toBe("This account has been disabled.");
  });

  it("returns friendly message for auth/too-many-requests", () => {
    const error = Object.assign(new Error(), {
      code: "auth/too-many-requests",
    });
    expect(getLoginErrorMessage(error)).toBe(
      "Too many failed attempts. Please try again later.",
    );
  });

  it("returns default message for unknown errors", () => {
    expect(getLoginErrorMessage(new Error("unknown"))).toBe(
      "Login failed. Please try again.",
    );
  });
});
