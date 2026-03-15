import { render, screen } from "@testing-library/react";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockUseUser = vi.fn();
vi.mock("@/lib/UserContext", () => ({
  useUser: () => mockUseUser(),
}));

vi.mock("@/components/Loader", () => ({
  default: () => <div role="status">Loading</div>,
}));

import PublicLayout from "@/app/(public)/layout";

describe("PublicLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loader while auth state is loading", () => {
    mockUseUser.mockReturnValue({ user: null, loading: true });
    render(<PublicLayout>Children</PublicLayout>);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryByText("Children")).not.toBeInTheDocument();
  });

  it("renders children when user is not authenticated", () => {
    mockUseUser.mockReturnValue({ user: null, loading: false });
    render(<PublicLayout>Children</PublicLayout>);

    expect(screen.getByText("Children")).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("redirects to /heists when user is authenticated", () => {
    mockUseUser.mockReturnValue({ user: { uid: "123" }, loading: false });
    render(<PublicLayout>Children</PublicLayout>);

    expect(mockPush).toHaveBeenCalledWith("/heists");
    expect(screen.queryByText("Children")).not.toBeInTheDocument();
  });
});
