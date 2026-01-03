import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import EmptyState from "../EmptyState";

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("EmptyState", () => {
  it("should render title when provided", () => {
    renderWithRouter(<EmptyState title="Test Title" message="Test message" />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("should not render title when not provided", () => {
    renderWithRouter(<EmptyState message="Test message" />);
    expect(screen.queryByText("Test Title")).not.toBeInTheDocument();
  });

  it("should render message", () => {
    renderWithRouter(<EmptyState message="Test message" />);
    expect(screen.getByText("Test message")).toBeInTheDocument();
  });

  it("should render description when provided", () => {
    renderWithRouter(
      <EmptyState message="Test message" description="Test description" />
    );
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("should not render description when not provided", () => {
    renderWithRouter(<EmptyState message="Test message" />);
    expect(screen.queryByText("Test description")).not.toBeInTheDocument();
  });

  it("should render default icon when no icon provided", () => {
    const { container } = renderWithRouter(
      <EmptyState message="Test message" />
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("should render custom icon when provided", () => {
    const CustomIcon = () => <div data-testid="custom-icon">Custom Icon</div>;
    renderWithRouter(
      <EmptyState message="Test message" icon={<CustomIcon />} />
    );
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  describe("action with Link", () => {
    it("should render Link when action.to is provided", () => {
      renderWithRouter(
        <EmptyState
          message="Test message"
          action={{ label: "Go Home", to: "/" }}
        />
      );
      const link = screen.getByText("Go Home");
      expect(link).toBeInTheDocument();
      expect(link.closest("a")).toHaveAttribute("href", "/");
    });
  });

  describe("action with onClick", () => {
    it("should render Button when action.onClick is provided", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      renderWithRouter(
        <EmptyState
          message="Test message"
          action={{ label: "Click me", onClick: handleClick }}
        />
      );

      const button = screen.getByText("Click me");
      expect(button).toBeInTheDocument();

      await user.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  it("should not render action when action is not provided", () => {
    renderWithRouter(<EmptyState message="Test message" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("should render all props together", () => {
    const handleClick = vi.fn();
    renderWithRouter(
      <EmptyState
        title="My Title"
        message="My message"
        description="My description"
        action={{ label: "Action", onClick: handleClick }}
      />
    );

    expect(screen.getByText("My Title")).toBeInTheDocument();
    expect(screen.getByText("My message")).toBeInTheDocument();
    expect(screen.getByText("My description")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
  });
});
