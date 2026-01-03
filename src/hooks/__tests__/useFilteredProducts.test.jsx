import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { createMockStore } from "../../test-utils/mockStore";
import { useFilteredProducts } from "../useFilteredProducts";
import { mockProducts } from "../../test-utils/mockData";

describe("useFilteredProducts", () => {
  const createWrapper = (store) => {
    return ({ children }) => <Provider store={store}>{children}</Provider>;
  };

  it("should return all products when no filters applied", () => {
    const store = createMockStore({
      filters: {
        searchQuery: "",
        category: "all",
        sortOrder: "none",
      },
    });

    const { result } = renderHook(() => useFilteredProducts(mockProducts), {
      wrapper: createWrapper(store),
    });

    expect(result.current).toHaveLength(mockProducts.length);
    expect(result.current).toEqual(mockProducts);
  });

  it("should filter by search query", () => {
    const store = createMockStore({
      filters: {
        searchQuery: "Fjallraven",
        category: "all",
        sortOrder: "none",
      },
    });

    const { result } = renderHook(() => useFilteredProducts(mockProducts), {
      wrapper: createWrapper(store),
    });

    expect(result.current).toHaveLength(1);
    expect(result.current[0].title).toContain("Fjallraven");
  });

  it("should filter by category", () => {
    const store = createMockStore({
      filters: {
        searchQuery: "",
        category: "jewelery",
        sortOrder: "none",
      },
    });

    const { result } = renderHook(() => useFilteredProducts(mockProducts), {
      wrapper: createWrapper(store),
    });

    expect(result.current.length).toBeGreaterThan(0);
    result.current.forEach((product) => {
      expect(product.category).toBe("jewelery");
    });
  });

  it("should filter by search query and category", () => {
    const store = createMockStore({
      filters: {
        searchQuery: "Mens",
        category: "men's clothing",
        sortOrder: "none",
      },
    });

    const { result } = renderHook(() => useFilteredProducts(mockProducts), {
      wrapper: createWrapper(store),
    });

    result.current.forEach((product) => {
      expect(product.category).toBe("men's clothing");
      expect(product.title.toLowerCase()).toContain("mens");
    });
  });

  it("should sort by price low to high", () => {
    const store = createMockStore({
      filters: {
        searchQuery: "",
        category: "all",
        sortOrder: "price-low",
      },
    });

    const { result } = renderHook(() => useFilteredProducts(mockProducts), {
      wrapper: createWrapper(store),
    });

    for (let i = 0; i < result.current.length - 1; i++) {
      expect(result.current[i].price).toBeLessThanOrEqual(
        result.current[i + 1].price
      );
    }
  });

  it("should sort by price high to low", () => {
    const store = createMockStore({
      filters: {
        searchQuery: "",
        category: "all",
        sortOrder: "price-high",
      },
    });

    const { result } = renderHook(() => useFilteredProducts(mockProducts), {
      wrapper: createWrapper(store),
    });

    for (let i = 0; i < result.current.length - 1; i++) {
      expect(result.current[i].price).toBeGreaterThanOrEqual(
        result.current[i + 1].price
      );
    }
  });

  it("should combine search, filter, and sort", () => {
    const store = createMockStore({
      filters: {
        searchQuery: "Mens",
        category: "men's clothing",
        sortOrder: "price-low",
      },
    });

    const { result } = renderHook(() => useFilteredProducts(mockProducts), {
      wrapper: createWrapper(store),
    });

    expect(result.current.length).toBeGreaterThan(0);
    result.current.forEach((product) => {
      expect(product.category).toBe("men's clothing");
      expect(product.title.toLowerCase()).toContain("mens");
    });

    for (let i = 0; i < result.current.length - 1; i++) {
      expect(result.current[i].price).toBeLessThanOrEqual(
        result.current[i + 1].price
      );
    }
  });

  it("should return empty array for invalid input", () => {
    const store = createMockStore({
      filters: {
        searchQuery: "",
        category: "all",
        sortOrder: "none",
      },
    });

    const { result } = renderHook(() => useFilteredProducts(null), {
      wrapper: createWrapper(store),
    });

    expect(result.current).toEqual([]);
  });

  it("should return empty array for empty array input", () => {
    const store = createMockStore({
      filters: {
        searchQuery: "",
        category: "all",
        sortOrder: "none",
      },
    });

    const { result } = renderHook(() => useFilteredProducts([]), {
      wrapper: createWrapper(store),
    });

    expect(result.current).toEqual([]);
  });

  it("should handle case-insensitive search", () => {
    const store = createMockStore({
      filters: {
        searchQuery: "FJALLRAVEN",
        category: "all",
        sortOrder: "none",
      },
    });

    const { result } = renderHook(() => useFilteredProducts(mockProducts), {
      wrapper: createWrapper(store),
    });

    expect(result.current.length).toBeGreaterThan(0);
    expect(result.current[0].title).toContain("Fjallraven");
  });

  it("should handle products without price", () => {
    const productsWithMissingPrice = [
      ...mockProducts,
      { id: 999, title: "Test Product", category: "test", price: null },
    ];

    const store = createMockStore({
      filters: {
        searchQuery: "",
        category: "all",
        sortOrder: "price-low",
      },
    });

    const { result } = renderHook(
      () => useFilteredProducts(productsWithMissingPrice),
      {
        wrapper: createWrapper(store),
      }
    );

    expect(result.current).toBeDefined();
  });
});
