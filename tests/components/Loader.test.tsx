import { render, screen } from "@testing-library/react";
import Loader from "@/components/Loader";

describe("Loader", () => {
  it("renders with status role and loading label", () => {
    render(<Loader />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Loading");
  });
});
