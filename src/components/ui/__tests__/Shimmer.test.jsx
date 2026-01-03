import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Shimmer from "../Shimmer";

describe("Shimmer", () => {
  it("should render with default props", () => {
    const { container } = render(<Shimmer />);
    const shimmer = container.firstChild;
    expect(shimmer).toBeInTheDocument();
    expect(shimmer.className).toContain("w-full");
    expect(shimmer.className).toContain("h-4");
    expect(shimmer.className).toContain("rounded");
    expect(shimmer.className).toContain("animate-shimmer");
  });

  it("should apply custom width", () => {
    const { container } = render(<Shimmer width="w-1/2" />);
    const shimmer = container.firstChild;
    expect(shimmer.className).toContain("w-1/2");
    expect(shimmer.className).not.toContain("w-full");
  });

  it("should apply custom height", () => {
    const { container } = render(<Shimmer height="h-8" />);
    const shimmer = container.firstChild;
    expect(shimmer.className).toContain("h-8");
    expect(shimmer.className).not.toContain("h-4");
  });

  it("should apply custom rounded", () => {
    const { container } = render(<Shimmer rounded="rounded-full" />);
    const shimmer = container.firstChild;
    expect(shimmer.className).toContain("rounded-full");

    const classList = shimmer.className.split(" ");
    expect(classList).toContain("rounded-full");
    expect(classList).not.toContain("rounded");
  });

  it("should apply custom className", () => {
    const { container } = render(<Shimmer className="custom-class" />);
    const shimmer = container.firstChild;
    expect(shimmer.className).toContain("custom-class");
  });

  it("should combine all custom props", () => {
    const { container } = render(
      <Shimmer
        width="w-1/3"
        height="h-12"
        rounded="rounded-lg"
        className="mb-4"
      />
    );
    const shimmer = container.firstChild;
    expect(shimmer.className).toContain("w-1/3");
    expect(shimmer.className).toContain("h-12");
    expect(shimmer.className).toContain("rounded-lg");
    expect(shimmer.className).toContain("mb-4");
    expect(shimmer.className).toContain("animate-shimmer");
  });
});
