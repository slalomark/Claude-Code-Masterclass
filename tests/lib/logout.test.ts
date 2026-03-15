import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/firebase", () => ({ auth: {} }));

const mockSignOut = vi.fn().mockResolvedValue(undefined);
vi.mock("firebase/auth", () => ({
  signOut: (...args: unknown[]) => mockSignOut(...args),
}));

import { logout } from "@/lib/logout";
import { auth } from "@/lib/firebase";

describe("logout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls signOut with the auth instance", async () => {
    await logout();
    expect(mockSignOut).toHaveBeenCalledWith(auth);
  });
});
