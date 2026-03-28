import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HeistCardSkeleton from "@/components/HeistCardSkeleton";

describe("HeistCardSkeleton", () => {
  it("renders without crashing", () => {
    render(<HeistCardSkeleton />);
    expect(screen.getByRole("status")).toBeDefined();
  });

  it("has an accessible loading label", () => {
    render(<HeistCardSkeleton />);
    expect(screen.getByLabelText("Loading")).toBeDefined();
  });

  it("contains placeholder elements", () => {
    const { container } = render(<HeistCardSkeleton />);
    const bars = container.querySelectorAll("[data-skeleton]");
    expect(bars.length).toBeGreaterThanOrEqual(4);
  });
});
