import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "../Button";

describe("Button", () => {
  it("should render with children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("should call onClick when clicked", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should not call onClick when disabled", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Button onClick={handleClick} disabled>
        Click me
      </Button>
    );

    await user.click(screen.getByText("Click me"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  describe("variants", () => {
    it("should render primary variant by default", () => {
      const { container } = render(<Button>Primary</Button>);
      const button = container.querySelector("button");
      expect(button.className).toContain("bg-blue-600");
    });

    it("should render secondary variant", () => {
      const { container } = render(
        <Button variant="secondary">Secondary</Button>
      );
      const button = container.querySelector("button");
      expect(button.className).toContain("bg-gray-600");
    });

    it("should render outline variant", () => {
      const { container } = render(<Button variant="outline">Outline</Button>);
      const button = container.querySelector("button");
      expect(button.className).toContain("border");
    });

    it("should render gradient variant", () => {
      const { container } = render(
        <Button variant="gradient">Gradient</Button>
      );
      const button = container.querySelector("button");
      expect(button.className).toContain("bg-gradient-to-r");
    });
  });

  describe("sizes", () => {
    it("should render small size", () => {
      const { container } = render(<Button size="sm">Small</Button>);
      const button = container.querySelector("button");
      expect(button.className).toContain("py-1.5");
      expect(button.className).toContain("text-sm");
    });

    it("should render medium size by default", () => {
      const { container } = render(<Button>Medium</Button>);
      const button = container.querySelector("button");
      expect(button.className).toContain("py-2");
      expect(button.className).toContain("text-base");
    });

    it("should render large size", () => {
      const { container } = render(<Button size="lg">Large</Button>);
      const button = container.querySelector("button");
      expect(button.className).toContain("py-3");
      expect(button.className).toContain("text-lg");
    });
  });

  it("should apply fullWidth class when fullWidth is true", () => {
    const { container } = render(<Button fullWidth>Full Width</Button>);
    const button = container.querySelector("button");
    expect(button.className).toContain("w-full");
  });

  it("should apply custom className", () => {
    const { container } = render(
      <Button className="custom-class">Custom</Button>
    );
    const button = container.querySelector("button");
    expect(button.className).toContain("custom-class");
  });

  it("should have correct type attribute", () => {
    const { container } = render(<Button type="submit">Submit</Button>);
    const button = container.querySelector("button");
    expect(button.type).toBe("submit");
  });

  it("should have button type by default", () => {
    const { container } = render(<Button>Button</Button>);
    const button = container.querySelector("button");
    expect(button.type).toBe("button");
  });

  it("should pass through additional props", () => {
    const { container } = render(
      <Button data-testid="custom-button" aria-label="Custom button">
        Test
      </Button>
    );
    const button = container.querySelector("button");
    expect(button.getAttribute("data-testid")).toBe("custom-button");
    expect(button.getAttribute("aria-label")).toBe("Custom button");
  });
});
