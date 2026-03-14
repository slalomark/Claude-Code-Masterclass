import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AuthForm from "@/components/AuthForm";

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
    const spy = vi.spyOn(console, "log");
    const user = userEvent.setup();
    render(<AuthForm mode="login" />);
    await user.click(screen.getByRole("button", { name: "Show password" }));
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it("submitting the form logs email and password", async () => {
    const spy = vi.spyOn(console, "log");
    const user = userEvent.setup();
    render(<AuthForm mode="login" />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.click(screen.getByRole("button", { name: "Log In" }));

    expect(spy).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "secret123",
    });
    spy.mockRestore();
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
