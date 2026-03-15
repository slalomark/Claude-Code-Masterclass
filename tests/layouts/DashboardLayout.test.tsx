import { render, screen } from "@testing-library/react";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockUseUser = vi.fn();
vi.mock("@/lib/UserContext", () => ({
  useUser: () => mockUseUser(),
}));

vi.mock("@/components/Navbar", () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));

vi.mock("@/components/Loader", () => ({
  default: () => <div role="status">Loading</div>,
}));

import DashboardLayout from "@/app/(dashboard)/layout";

describe("DashboardLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loader while auth state is loading", () => {
    mockUseUser.mockReturnValue({ user: null, loading: true });
    render(<DashboardLayout>Children</DashboardLayout>);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryByText("Children")).not.toBeInTheDocument();
    expect(screen.queryByTestId("navbar")).not.toBeInTheDocument();
  });

  it("redirects to /login when user is not authenticated", () => {
    mockUseUser.mockReturnValue({ user: null, loading: false });
    render(<DashboardLayout>Children</DashboardLayout>);

    expect(mockPush).toHaveBeenCalledWith("/login");
    expect(screen.queryByText("Children")).not.toBeInTheDocument();
  });

  it("renders Navbar and children when user is authenticated", () => {
    mockUseUser.mockReturnValue({ user: { uid: "123" }, loading: false });
    render(<DashboardLayout>Children</DashboardLayout>);

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByText("Children")).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
