import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CategoryButton from "../CategoryButton";

describe("CategoryButton", () => {
  it("should render children", () => {
    render(<CategoryButton>Electronics</CategoryButton>);
    expect(screen.getByText("Electronics")).toBeInTheDocument();
  });

  it("should call onClick when clicked", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(<CategoryButton onClick={handleClick}>Electronics</CategoryButton>);

    await user.click(screen.getByText("Electronics"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should apply active styles when active is true", () => {
    const { container } = render(
      <CategoryButton active>Electronics</CategoryButton>
    );
    const button = container.querySelector("button");
    expect(button.className).toContain("bg-linear-to-r");
    expect(button.className).toContain("from-blue-500");
  });

  it("should apply inactive styles when active is false", () => {
    const { container } = render(
      <CategoryButton active={false}>Electronics</CategoryButton>
    );
    const button = container.querySelector("button");
    expect(button.className).toContain("bg-gray-200");
    expect(button.className).not.toContain("bg-linear-to-r");
  });

  it("should capitalize children text", () => {
    const { container } = render(<CategoryButton>electronics</CategoryButton>);
    const button = container.querySelector("button");
    expect(button.className).toContain("capitalize");
  });

  it("should have focus ring styles", () => {
    const { container } = render(<CategoryButton>Electronics</CategoryButton>);
    const button = container.querySelector("button");
    expect(button.className).toContain("focus:ring-2");
    expect(button.className).toContain("focus:ring-blue-500/40");
  });
});
