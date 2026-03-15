import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AuthForm from "@/components/AuthForm";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/lib/signup", () => ({
  signup: vi.fn(),
  getSignupErrorMessage: vi.fn(),
}));

const mockLogin = vi.fn();
const mockGetLoginErrorMessage = vi.fn(() => "Login failed. Please try again.");
vi.mock("@/lib/login", () => ({
  login: (...args: unknown[]) => mockLogin(...args),
  getLoginErrorMessage: (...args: unknown[]) =>
    mockGetLoginErrorMessage(...args),
}));

async function fillAndSubmitLoginForm(
  user: ReturnType<typeof userEvent.setup>,
) {
  await user.type(screen.getByLabelText("Email"), "test@example.com");
  await user.type(screen.getByLabelText("Password"), "secret123");
  await user.click(screen.getByRole("button", { name: "Log In" }));
}

describe("AuthForm login mode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLogin.mockResolvedValue(undefined);
  });

  it("calls login with email and password on submit", async () => {
    const user = userEvent.setup();
    render(<AuthForm mode="login" />);

    await fillAndSubmitLoginForm(user);

    expect(mockLogin).toHaveBeenCalledWith("test@example.com", "secret123");
  });

  it("shows loading state during login", async () => {
    let resolveLogin: () => void;
    mockLogin.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveLogin = resolve;
        }),
    );
    const user = userEvent.setup();
    render(<AuthForm mode="login" />);

    await fillAndSubmitLoginForm(user);

    expect(
      screen.getByRole("button", { name: "Logging in..." }),
    ).toBeDisabled();
    expect(screen.getByLabelText("Email")).toBeDisabled();
    expect(screen.getByLabelText("Password")).toBeDisabled();

    resolveLogin!();
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Log In" })).toBeEnabled();
    });
  });

  it("displays success message on successful login", async () => {
    const user = userEvent.setup();
    render(<AuthForm mode="login" />);

    await fillAndSubmitLoginForm(user);

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent("Login successful!");
    });
  });

  it("does not redirect after successful login", async () => {
    const user = userEvent.setup();
    render(<AuthForm mode="login" />);

    await fillAndSubmitLoginForm(user);

    await waitFor(() => {
      expect(screen.getByRole("status")).toBeInTheDocument();
    });
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("does not clear form fields after successful login", async () => {
    const user = userEvent.setup();
    render(<AuthForm mode="login" />);

    await fillAndSubmitLoginForm(user);

    await waitFor(() => {
      expect(screen.getByRole("status")).toBeInTheDocument();
    });
    expect(screen.getByLabelText("Email")).toHaveValue("test@example.com");
    expect(screen.getByLabelText("Password")).toHaveValue("secret123");
  });

  it("displays error message on failed login", async () => {
    mockLogin.mockRejectedValue(new Error("fail"));
    mockGetLoginErrorMessage.mockReturnValue("Invalid email or password.");
    const user = userEvent.setup();
    render(<AuthForm mode="login" />);

    await fillAndSubmitLoginForm(user);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Invalid email or password.",
      );
    });
  });

  it("success message auto-dismisses after 3 seconds", async () => {
    vi.useFakeTimers();
    render(<AuthForm mode="login" />);

    // Use fireEvent instead of userEvent to avoid fake timer conflicts
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "secret123" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Log In" }));
    });

    expect(screen.getByRole("status")).toHaveTextContent("Login successful!");

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    vi.useRealTimers();
  });
});
