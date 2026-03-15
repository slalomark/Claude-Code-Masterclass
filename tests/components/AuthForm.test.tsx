import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AuthForm from "@/components/AuthForm";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockSignup = vi.fn();
const mockGetSignupErrorMessage = vi.fn(() => "Something went wrong.");
vi.mock("@/lib/signup", () => ({
  signup: (...args: unknown[]) => mockSignup(...args),
  getSignupErrorMessage: (...args: unknown[]) =>
    mockGetSignupErrorMessage(...args),
}));

const mockLogin = vi.fn();
vi.mock("@/lib/login", () => ({
  login: (...args: unknown[]) => mockLogin(...args),
  getLoginErrorMessage: vi.fn(() => "Login failed. Please try again."),
}));

describe("AuthForm", () => {
  it("renders email and password fields", () => {
    render(<AuthForm mode="login" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("password field is hidden by default", () => {
    render(<AuthForm mode="login" />);
    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "type",
      "password",
    );
  });

  it("clicking the toggle reveals the password", async () => {
    const user = userEvent.setup();
    render(<AuthForm mode="login" />);
    await user.click(screen.getByRole("button", { name: "Show password" }));
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "text");
  });

  it("clicking the toggle again hides the password", async () => {
    const user = userEvent.setup();
    render(<AuthForm mode="login" />);
    await user.click(screen.getByRole("button", { name: "Show password" }));
    await user.click(screen.getByRole("button", { name: "Hide password" }));
    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "type",
      "password",
    );
  });

  it("clicking the toggle does not submit the form", async () => {
    const user = userEvent.setup();
    render(<AuthForm mode="login" />);
    await user.click(screen.getByRole("button", { name: "Show password" }));
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("login mode renders Log In button and link to signup", () => {
    render(<AuthForm mode="login" />);
    expect(screen.getByRole("button", { name: "Log In" })).toBeInTheDocument();
    const link = screen.getByRole("link", { name: "Sign up" });
    expect(link).toHaveAttribute("href", "/signup");
  });

  it("signup mode renders Sign Up button and link to login", () => {
    render(<AuthForm mode="signup" />);
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument();
    const link = screen.getByRole("link", { name: "Log in" });
    expect(link).toHaveAttribute("href", "/login");
  });
});

describe("AuthForm signup mode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSignup.mockResolvedValue(undefined);
  });

  it("calls signup with email and password on submit", async () => {
    const user = userEvent.setup();
    render(<AuthForm mode="signup" />);

    await user.type(screen.getByLabelText("Email"), "new@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Sign Up" }));

    expect(mockSignup).toHaveBeenCalledWith("new@example.com", "password123");
  });

  it("redirects to /heists on success", async () => {
    const user = userEvent.setup();
    render(<AuthForm mode="signup" />);

    await user.type(screen.getByLabelText("Email"), "new@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Sign Up" }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/heists");
    });
  });

  it("displays error on failure", async () => {
    mockSignup.mockRejectedValue(new Error("fail"));
    mockGetSignupErrorMessage.mockReturnValue(
      "That email is already registered.",
    );
    const user = userEvent.setup();
    render(<AuthForm mode="signup" />);

    await user.type(screen.getByLabelText("Email"), "new@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Sign Up" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "That email is already registered.",
      );
    });
  });

  it("shows loading text on button during submission", async () => {
    let resolveSignup: () => void;
    mockSignup.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveSignup = resolve;
        }),
    );
    const user = userEvent.setup();
    render(<AuthForm mode="signup" />);

    await user.type(screen.getByLabelText("Email"), "new@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Sign Up" }));

    expect(
      screen.getByRole("button", { name: "Signing up..." }),
    ).toBeDisabled();

    resolveSignup!();
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Sign Up" })).toBeEnabled();
    });
  });

  it("disables inputs during loading", async () => {
    let resolveSignup: () => void;
    mockSignup.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveSignup = resolve;
        }),
    );
    const user = userEvent.setup();
    render(<AuthForm mode="signup" />);

    await user.type(screen.getByLabelText("Email"), "new@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Sign Up" }));

    expect(screen.getByLabelText("Email")).toBeDisabled();
    expect(screen.getByLabelText("Password")).toBeDisabled();

    resolveSignup!();
    await waitFor(() => {
      expect(screen.getByLabelText("Email")).toBeEnabled();
    });
  });
});
