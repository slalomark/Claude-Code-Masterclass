import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import { UserProvider, useUser } from "@/lib/UserContext";

vi.mock("@/lib/firebase", () => ({
  auth: {},
}));

const mockOnAuthStateChanged = vi.fn();
vi.mock("firebase/auth", () => ({
  onAuthStateChanged: (auth: unknown, callback: (user: unknown) => void) =>
    mockOnAuthStateChanged(auth, callback),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <UserProvider>{children}</UserProvider>
);

describe("useUser", () => {
  beforeEach(() => {
    mockOnAuthStateChanged.mockReset();
    mockOnAuthStateChanged.mockReturnValue(() => {});
  });

  it("exposes loading: true before Firebase resolves", () => {
    // Never call the callback — simulates pending auth state
    mockOnAuthStateChanged.mockImplementation(() => () => {});

    const { result } = renderHook(() => useUser(), { wrapper });
    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBeNull();
  });

  it("returns { user: null, loading: false } when no user is authenticated", () => {
    mockOnAuthStateChanged.mockImplementation(
      (_auth: unknown, callback: (user: null) => void) => {
        callback(null);
        return () => {};
      },
    );

    const { result } = renderHook(() => useUser(), { wrapper });
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("returns the user object when authenticated", () => {
    const fakeUser = { uid: "abc123", email: "test@example.com" };
    mockOnAuthStateChanged.mockImplementation(
      (_auth: unknown, callback: (user: typeof fakeUser) => void) => {
        callback(fakeUser);
        return () => {};
      },
    );

    const { result } = renderHook(() => useUser(), { wrapper });
    expect(result.current.user).toEqual(fakeUser);
    expect(result.current.loading).toBe(false);
  });

  it("updates when Firebase fires a new auth state change", () => {
    let storedCallback: (user: unknown) => void = () => {};
    mockOnAuthStateChanged.mockImplementation(
      (_auth: unknown, callback: (user: unknown) => void) => {
        storedCallback = callback;
        callback(null);
        return () => {};
      },
    );

    const { result } = renderHook(() => useUser(), { wrapper });
    expect(result.current.user).toBeNull();

    const newUser = { uid: "xyz789", email: "new@example.com" };
    act(() => {
      storedCallback(newUser);
    });

    expect(result.current.user).toEqual(newUser);
  });

  it("throws a descriptive error when called outside UserProvider", () => {
    expect(() => renderHook(() => useUser())).toThrow(
      "useUser must be used within a UserProvider",
    );
  });
});
