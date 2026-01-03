import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { setupMSW, addMSWHandler } from "../../test-utils/server";
import { createMockStore } from "../../test-utils/mockStore";
import Home from "../Home";
import { mockProducts, mockCategories } from "../../test-utils/mockData";
import { http, HttpResponse } from "msw";
import { API_BASE_URL } from "../../utils/constants";

setupMSW();

describe("Home", () => {
  let store;

  beforeEach(() => {
    store = createMockStore({
      products: {
        products: [],
        productsLoading: false,
        productsError: null,
      },
      filters: {
        searchQuery: "",
        category: "all",
        sortOrder: "none",
        productByCategory: mockCategories,
      },
    });
  });

  const renderWithProviders = (ui) => {
    return render(
      <Provider store={store}>
        <BrowserRouter>{ui}</BrowserRouter>
      </Provider>
    );
  };

  it("should render hero section", () => {
    store = createMockStore({
      products: {
        products: mockProducts,
        productsLoading: false,
        productsError: null,
      },
      filters: {
        searchQuery: "",
        category: "all",
        sortOrder: "none",
        productByCategory: mockCategories,
      },
    });
    renderWithProviders(<Home />);
    expect(screen.getByText("Discover")).toBeInTheDocument();
    expect(screen.getByText("Amazing")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
  });

  it("should render SearchBar component", () => {
    store = createMockStore({
      products: {
        products: mockProducts,
        productsLoading: false,
        productsError: null,
      },
      filters: {
        searchQuery: "",
        category: "all",
        sortOrder: "none",
        productByCategory: mockCategories,
      },
    });
    renderWithProviders(<Home />);
    expect(
      screen.getByPlaceholderText("Search products...")
    ).toBeInTheDocument();
  });

  it("should render CategoryFilter component", () => {
    store = createMockStore({
      products: {
        products: mockProducts,
        productsLoading: false,
        productsError: null,
      },
      filters: {
        searchQuery: "",
        category: "all",
        sortOrder: "none",
        productByCategory: mockCategories,
      },
    });
    renderWithProviders(<Home />);
    expect(screen.getByText("Categories")).toBeInTheDocument();
  });

  it("should render SortByPrice component", () => {
    store = createMockStore({
      products: {
        products: mockProducts,
        productsLoading: false,
        productsError: null,
      },
      filters: {
        searchQuery: "",
        category: "all",
        sortOrder: "none",
        productByCategory: mockCategories,
      },
    });
    renderWithProviders(<Home />);
    expect(screen.getByText("Sort by")).toBeInTheDocument();
  });

  it("should render loading skeleton when productsLoading is true", () => {
    store = createMockStore({
      products: {
        products: [],
        productsLoading: true,
        productsError: null,
      },
      filters: {
        searchQuery: "",
        category: "all",
        sortOrder: "none",
        productByCategory: mockCategories,
      },
    });
    renderWithProviders(<Home />);
    // Should show skeleton (check for animate-shimmer class)
    const skeletons = document.querySelectorAll(".animate-shimmer");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("should render error message when productsError exists", async () => {
    // Override MSW handler to return error
    addMSWHandler(
      http.get(`${API_BASE_URL}/products`, () => {
        return HttpResponse.json(
          { error: "Failed to fetch products" },
          { status: 500 }
        );
      })
    );

    store = createMockStore({
      products: {
        products: [],
        productsLoading: false,
        productsError: "Failed to fetch products",
      },
      filters: {
        searchQuery: "",
        category: "all",
        sortOrder: "none",
        productByCategory: mockCategories,
      },
    });
    renderWithProviders(<Home />);
    await waitFor(() => {
      expect(
        screen.getByText(/Error: Failed to fetch products/i)
      ).toBeInTheDocument();
    });
  });

  it("should render products when loaded", async () => {
    store = createMockStore({
      products: {
        products: mockProducts,
        productsLoading: false,
        productsError: null,
      },
      filters: {
        searchQuery: "",
        category: "all",
        sortOrder: "none",
        productByCategory: mockCategories,
      },
    });
    renderWithProviders(<Home />);
    await waitFor(() => {
      expect(screen.getByText(mockProducts[0].title)).toBeInTheDocument();
    });
  });

  it("should render 'No products match your filters' when filters applied but no matches", async () => {
    store = createMockStore({
      products: {
        products: mockProducts,
        productsLoading: false,
        productsError: null,
      },
      filters: {
        searchQuery: "nonexistent product",
        category: "all",
        sortOrder: "none",
        productByCategory: mockCategories,
      },
    });
    renderWithProviders(<Home />);
    await waitFor(() => {
      expect(
        screen.getByText(/No products match your filters/i)
      ).toBeInTheDocument();
    });
  });

  it("should render 'No products available' when products array is empty", async () => {
    addMSWHandler(
      http.get(`${API_BASE_URL}/products`, () => {
        return HttpResponse.json([]);
      })
    );

    store = createMockStore({
      products: {
        products: [],
        productsLoading: false,
        productsError: null,
      },
      filters: {
        searchQuery: "",
        category: "all",
        sortOrder: "none",
        productByCategory: mockCategories,
      },
    });
    renderWithProviders(<Home />);
    await waitFor(
      () => {
        expect(screen.getByText(/No products available/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it("should dispatch fetchProducts and fetchProductByCategory on mount", async () => {
    const dispatchSpy = vi.spyOn(store, "dispatch");
    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalled();
    });
  });

  it("should render Clear Filters button", async () => {
    store = createMockStore({
      products: {
        products: mockProducts,
        productsLoading: false,
        productsError: null,
      },
      filters: {
        searchQuery: "",
        category: "all",
        sortOrder: "none",
        productByCategory: mockCategories,
      },
    });
    renderWithProviders(<Home />);
    await waitFor(() => {
      const clearButton = screen.getByText("Clear Filters");
      expect(clearButton).toBeInTheDocument();
    });
  });

  it("should disable Clear Filters button when no filters applied", async () => {
    store = createMockStore({
      products: {
        products: mockProducts,
        productsLoading: false,
        productsError: null,
      },
      filters: {
        searchQuery: "",
        category: "all",
        sortOrder: "none",
        productByCategory: mockCategories,
      },
    });
    renderWithProviders(<Home />);
    await waitFor(() => {
      const clearButton = screen.getByText("Clear Filters");
      expect(clearButton).toBeDisabled();
    });
  });
});
