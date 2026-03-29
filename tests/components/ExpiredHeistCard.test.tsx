import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ExpiredHeistCard from "@/components/ExpiredHeistCard";
import { Heist } from "@/types/firestore";

const mockExpiredHeist: Heist = {
  id: "heist-expired-1",
  title: "The Vault Job",
  description: "A failed vault heist",
  createdBy: "user-1",
  createdByCodename: "Mastermind",
  assignedTo: "user-2",
  assignedToCodename: "ShadowFox",
  deadline: new Date("2026-01-15T12:00:00Z"),
  finalStatus: null,
  createdAt: new Date("2025-12-01T10:00:00Z"),
};

describe("ExpiredHeistCard", () => {
  it("renders the heist title as plain text, not a link", () => {
    render(<ExpiredHeistCard heist={mockExpiredHeist} />);
    expect(screen.getByText("The Vault Job")).toBeDefined();
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("displays the FAILED badge", () => {
    render(<ExpiredHeistCard heist={mockExpiredHeist} />);
    expect(screen.getByText("FAILED")).toBeDefined();
  });

  it("displays the failure icon", () => {
    render(<ExpiredHeistCard heist={mockExpiredHeist} />);
    expect(screen.getByTestId("fail-icon")).toBeDefined();
  });

  it("displays the assigned-to codename", () => {
    render(<ExpiredHeistCard heist={mockExpiredHeist} />);
    expect(screen.getByText("ShadowFox")).toBeDefined();
  });

  it("displays the created-by codename", () => {
    render(<ExpiredHeistCard heist={mockExpiredHeist} />);
    expect(screen.getByText("Mastermind")).toBeDefined();
  });

  it("displays the formatted deadline", () => {
    render(<ExpiredHeistCard heist={mockExpiredHeist} />);
    const formatted = mockExpiredHeist.deadline.toLocaleDateString();
    expect(screen.getByText(formatted)).toBeDefined();
  });
});
