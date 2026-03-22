import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateHeistForm from "@/components/CreateHeistForm";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/lib/UserContext", () => ({
  useUser: () => ({
    user: { uid: "user1", displayName: "ShadowFox" },
    loading: false,
  }),
}));

const mockFetchUsers = vi.fn();
const mockCreateHeist = vi.fn();
vi.mock("@/lib/heists", () => ({
  fetchUsers: (...args: unknown[]) => mockFetchUsers(...args),
  createHeist: (...args: unknown[]) => mockCreateHeist(...args),
}));

vi.mock("firebase/firestore", () => ({
  serverTimestamp: () => "server-timestamp",
}));

const fakeUsers = [
  { id: "user2", codename: "NightOwl" },
  { id: "user3", codename: "StealthWolf" },
];

describe("CreateHeistForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchUsers.mockResolvedValue(fakeUsers);
    mockCreateHeist.mockResolvedValue("new-id");
  });

  it("renders all expected fields", async () => {
    render(<CreateHeistForm />);

    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
    });
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Assigned To")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create Heist" }),
    ).toBeInTheDocument();
  });

  it("fetches users excluding the current user", async () => {
    render(<CreateHeistForm />);

    await waitFor(() => {
      expect(mockFetchUsers).toHaveBeenCalledWith("user1");
    });
  });

  it("populates the dropdown with fetched users", async () => {
    render(<CreateHeistForm />);

    await waitFor(() => {
      expect(screen.getByText("NightOwl")).toBeInTheDocument();
    });
    expect(screen.getByText("StealthWolf")).toBeInTheDocument();
  });

  it("submit button is disabled when fields are empty", async () => {
    render(<CreateHeistForm />);

    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: "Create Heist" })).toBeDisabled();
  });

  it("submits with correct data and redirects on success", async () => {
    const user = userEvent.setup();
    render(<CreateHeistForm />);

    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText("Title"), "Bank Job");
    await user.type(screen.getByLabelText("Description"), "A daring heist");
    await user.selectOptions(screen.getByLabelText("Assigned To"), "user2");
    await user.click(screen.getByRole("button", { name: "Create Heist" }));

    await waitFor(() => {
      expect(mockCreateHeist).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Bank Job",
          description: "A daring heist",
          createdBy: "user1",
          createdByCodename: "ShadowFox",
          assignedTo: "user2",
          assignedToCodename: "NightOwl",
          finalStatus: null,
          deadline: expect.any(Date),
          createdAt: "server-timestamp",
        }),
      );
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/heists");
    });
  });

  it("shows loading state during submission", async () => {
    let resolveCreate: (value: string) => void;
    mockCreateHeist.mockImplementation(
      () =>
        new Promise<string>((resolve) => {
          resolveCreate = resolve;
        }),
    );

    const user = userEvent.setup();
    render(<CreateHeistForm />);

    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText("Title"), "Bank Job");
    await user.type(screen.getByLabelText("Description"), "A daring heist");
    await user.selectOptions(screen.getByLabelText("Assigned To"), "user2");
    await user.click(screen.getByRole("button", { name: "Create Heist" }));

    expect(screen.getByRole("button", { name: "Creating..." })).toBeDisabled();

    resolveCreate!("new-id");
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/heists");
    });
  });

  it("displays error on submission failure", async () => {
    mockCreateHeist.mockRejectedValue(new Error("Firestore error"));

    const user = userEvent.setup();
    render(<CreateHeistForm />);

    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText("Title"), "Bank Job");
    await user.type(screen.getByLabelText("Description"), "A daring heist");
    await user.selectOptions(screen.getByLabelText("Assigned To"), "user2");
    await user.click(screen.getByRole("button", { name: "Create Heist" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Failed to create heist. Please try again.",
      );
    });
  });
});
