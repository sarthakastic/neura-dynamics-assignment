/**
 * Example test file to verify testing setup
 * This can be deleted once you start writing real tests
 */
import { describe, it, expect } from "vitest";
import { mockProducts } from "./mockData";

describe("Test Setup Verification", () => {
  it("should run tests successfully", () => {
    expect(true).toBe(true);
  });

  it("should have access to test utilities", () => {
    expect(mockProducts).toBeDefined();
    expect(Array.isArray(mockProducts)).toBe(true);
  });
});
