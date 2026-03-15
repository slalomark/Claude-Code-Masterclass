import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";

const mockLogout = vi.fn().mockResolvedValue(undefined);
vi.mock("@/lib/logout", () => ({
  logout: (...args: unknown[]) => mockLogout(...args),
}));

const mockUseUser = vi.fn();
vi.mock("@/lib/UserContext", () => ({
  useUser: () => mockUseUser(),
}));

import Navbar from "@/components/Navbar";

describe("Navbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUser.mockReturnValue({ user: null, loading: false });
  });

  it("renders the main heading", () => {
    render(<Navbar />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it("renders the Create Heist link", () => {
    render(<Navbar />);

    const createLink = screen.getByRole("link", { name: /create new heist/i });
    expect(createLink).toBeInTheDocument();
    expect(createLink).toHaveAttribute("href", "/heists/create");
  });

  it("renders logout button when user is authenticated", () => {
    mockUseUser.mockReturnValue({ user: { uid: "123" }, loading: false });
    render(<Navbar />);

    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
  });

  it("does not render logout button when user is not authenticated", () => {
    render(<Navbar />);

    expect(
      screen.queryByRole("button", { name: /logout/i }),
    ).not.toBeInTheDocument();
  });

  it("calls logout when the logout button is clicked", async () => {
    const user = userEvent.setup();
    mockUseUser.mockReturnValue({ user: { uid: "123" }, loading: false });
    render(<Navbar />);

    await user.click(screen.getByRole("button", { name: /logout/i }));
    expect(mockLogout).toHaveBeenCalled();
  });
});
