import { renderHook } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/lib/firebase", () => ({ db: {} }));

const mockUseUser = vi.fn();
vi.mock("@/lib/UserContext", () => ({
  useUser: () => mockUseUser(),
}));

const mockOnSnapshot = vi.fn();
const mockQuery = vi.fn(() => "query-ref");
const mockCollection = vi.fn(() => "collection-ref");
const mockWhere = vi.fn((...args: unknown[]) => args);
const mockWithConverter = vi.fn(() => "converted-collection-ref");

vi.mock("firebase/firestore", () => ({
  onSnapshot: (...args: unknown[]) => mockOnSnapshot(...args),
  query: (...args: unknown[]) => mockQuery(...args),
  collection: (...args: unknown[]) => {
    const ref = mockCollection(...args);
    return { withConverter: mockWithConverter, ref };
  },
  where: (...args: unknown[]) => mockWhere(...args),
  Timestamp: { now: () => "mock-timestamp" },
}));

import { useHeists } from "@/hooks";

describe("useHeists", () => {
  const mockUnsubscribe = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnSnapshot.mockReturnValue(mockUnsubscribe);
    mockUseUser.mockReturnValue({ user: { uid: "user1" }, loading: false });
  });

  it("returns loading true while user auth is loading", () => {
    mockUseUser.mockReturnValue({ user: null, loading: true });

    const { result } = renderHook(() => useHeists("active"));

    expect(result.current.loading).toBe(true);
    expect(result.current.heists).toEqual([]);
    expect(mockOnSnapshot).not.toHaveBeenCalled();
  });

  it("returns empty heists when user is null for active filter", () => {
    mockUseUser.mockReturnValue({ user: null, loading: false });

    const { result } = renderHook(() => useHeists("active"));

    expect(result.current.heists).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(mockOnSnapshot).not.toHaveBeenCalled();
  });

  it("returns empty heists when user is null for assigned filter", () => {
    mockUseUser.mockReturnValue({ user: null, loading: false });

    const { result } = renderHook(() => useHeists("assigned"));

    expect(result.current.heists).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(mockOnSnapshot).not.toHaveBeenCalled();
  });

  it("builds correct query for active filter", () => {
    renderHook(() => useHeists("active"));

    expect(mockWhere).toHaveBeenCalledWith("assignedTo", "==", "user1");
    expect(mockWhere).toHaveBeenCalledWith("deadline", ">", "mock-timestamp");
  });

  it("builds correct query for assigned filter", () => {
    renderHook(() => useHeists("assigned"));

    expect(mockWhere).toHaveBeenCalledWith("createdBy", "==", "user1");
    expect(mockWhere).toHaveBeenCalledWith("deadline", ">", "mock-timestamp");
  });

  it("builds correct query for expired filter", () => {
    renderHook(() => useHeists("expired"));

    expect(mockWhere).toHaveBeenCalledWith("deadline", "<=", "mock-timestamp");
    expect(mockWhere).toHaveBeenCalledTimes(1);
  });

  it("returns heists from snapshot", () => {
    mockOnSnapshot.mockImplementation(
      (q: unknown, onNext: (snapshot: unknown) => void) => {
        onNext({
          docs: [
            { data: () => ({ id: "h1", title: "Heist 1", finalStatus: null }) },
            {
              data: () => ({
                id: "h2",
                title: "Heist 2",
                finalStatus: "success",
              }),
            },
          ],
        });
        return mockUnsubscribe;
      },
    );

    const { result } = renderHook(() => useHeists("active"));

    expect(result.current.heists).toEqual([
      { id: "h1", title: "Heist 1", finalStatus: null },
      { id: "h2", title: "Heist 2", finalStatus: "success" },
    ]);
    expect(result.current.loading).toBe(false);
  });

  it("filters out null finalStatus for expired filter", () => {
    mockOnSnapshot.mockImplementation(
      (q: unknown, onNext: (snapshot: unknown) => void) => {
        onNext({
          docs: [
            { data: () => ({ id: "h1", title: "Heist 1", finalStatus: null }) },
            {
              data: () => ({
                id: "h2",
                title: "Heist 2",
                finalStatus: "success",
              }),
            },
            {
              data: () => ({
                id: "h3",
                title: "Heist 3",
                finalStatus: "failure",
              }),
            },
          ],
        });
        return mockUnsubscribe;
      },
    );

    const { result } = renderHook(() => useHeists("expired"));

    expect(result.current.heists).toEqual([
      { id: "h2", title: "Heist 2", finalStatus: "success" },
      { id: "h3", title: "Heist 3", finalStatus: "failure" },
    ]);
  });

  it("sets error state on snapshot error", () => {
    mockOnSnapshot.mockImplementation(
      (
        q: unknown,
        onNext: (snapshot: unknown) => void,
        onError: (err: unknown) => void,
      ) => {
        onError({ message: "Permission denied" });
        return mockUnsubscribe;
      },
    );

    const { result } = renderHook(() => useHeists("active"));

    expect(result.current.error).toBe("Permission denied");
    expect(result.current.loading).toBe(false);
  });

  it("cleans up listener on unmount", () => {
    mockOnSnapshot.mockReturnValue(mockUnsubscribe);

    const { unmount } = renderHook(() => useHeists("active"));
    unmount();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });
});
