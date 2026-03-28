import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HeistCard from "@/components/HeistCard";
import { Heist } from "@/types/firestore";

const mockHeist: Heist = {
  id: "heist-123",
  title: "Steal the Diamond",
  description: "A daring diamond heist",
  createdBy: "user-1",
  createdByCodename: "Mastermind",
  assignedTo: "user-2",
  assignedToCodename: "ShadowFox",
  deadline: new Date("2026-04-15T12:00:00Z"),
  finalStatus: null,
  createdAt: new Date("2026-03-28T10:00:00Z"),
};

describe("HeistCard", () => {
  it("renders the heist title", () => {
    render(<HeistCard heist={mockHeist} />);
    expect(screen.getByText("Steal the Diamond")).toBeDefined();
  });

  it("renders the title as a link to the detail page", () => {
    render(<HeistCard heist={mockHeist} />);
    const link = screen.getByRole("link", { name: /steal the diamond/i });
    expect(link.getAttribute("href")).toBe("/heists/heist-123");
  });

  it("displays the assigned-to codename", () => {
    render(<HeistCard heist={mockHeist} />);
    expect(screen.getByText("ShadowFox")).toBeDefined();
  });

  it("displays the created-by codename", () => {
    render(<HeistCard heist={mockHeist} />);
    expect(screen.getByText("Mastermind")).toBeDefined();
  });

  it("displays the formatted deadline", () => {
    render(<HeistCard heist={mockHeist} />);
    const formatted = mockHeist.deadline.toLocaleDateString();
    expect(screen.getByText(formatted)).toBeDefined();
  });
});
