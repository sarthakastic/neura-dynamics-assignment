import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { setupMSW } from "../../test-utils/server";
import { createMockStore } from "../../test-utils/mockStore";
import Home from "../../pages/Home";
import { mockProducts } from "../../test-utils/mockData";

setupMSW();

describe("Search Integration Tests", () => {
  let store;
  let user;

  beforeEach(() => {
    vi.useRealTimers();
    user = userEvent.setup();
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
        productByCategory: ["electronics", "jewelery", "men's clothing"],
      },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const renderWithProviders = (ui) => {
    return render(
      <Provider store={store}>
        <BrowserRouter>{ui}</BrowserRouter>
      </Provider>
    );
  };

  it("should filter products in real-time when user types in search bar", async () => {
    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Search products...")
      ).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Search products...");
    await user.type(searchInput, "Fjallraven");

    await waitFor(
      () => {
        expect(
          screen.getByText("Fjallraven - Foldsack No. 1 Backpack")
        ).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    await waitFor(
      () => {
        expect(
          screen.queryByText("Mens Casual Premium Slim Fit T-Shirts")
        ).not.toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it("should be case-insensitive when searching", async () => {
    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Search products...")
      ).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Search products...");
    await user.type(searchInput, "FJALLRAVEN");

    await waitFor(
      () => {
        expect(
          screen.getByText("Fjallraven - Foldsack No. 1 Backpack")
        ).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it("should show all products when search is cleared", async () => {
    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Search products...")
      ).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Search products...");

    await user.type(searchInput, "Fjallraven");

    await waitFor(
      () => {
        expect(
          screen.getByText("Fjallraven - Foldsack No. 1 Backpack")
        ).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    await user.clear(searchInput);

    await waitFor(
      () => {
        expect(
          screen.getByText("Fjallraven - Foldsack No. 1 Backpack")
        ).toBeInTheDocument();
        expect(
          screen.getByText("Mens Casual Premium Slim Fit T-Shirts")
        ).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it("should update product count when searching", async () => {
    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Search products...")
      ).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Search products...");
    await user.type(searchInput, "Mens");

    await waitFor(
      () => {
        const countText = screen.getByText(/products found/i);
        expect(countText).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it("should show 'No products match your filters' when search has no results", async () => {
    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Search products...")
      ).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Search products...");
    await user.type(searchInput, "nonexistentproduct123");

    await waitFor(
      () => {
        expect(
          screen.getByText(/No products match your filters/i)
        ).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it("should work with category filter applied", async () => {
    store = createMockStore({
      products: {
        products: mockProducts,
        productsLoading: false,
        productsError: null,
      },
      filters: {
        searchQuery: "",
        category: "men's clothing",
        sortOrder: "none",
        productByCategory: ["electronics", "jewelery", "men's clothing"],
      },
    });

    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Search products...")
      ).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Search products...");
    await user.type(searchInput, "Mens");

    await waitFor(
      () => {
        const mensProducts = screen.getAllByText(/Mens/i);
        expect(mensProducts.length).toBeGreaterThan(0);

        mensProducts.forEach((product) => {
          expect(product).toBeInTheDocument();
        });
      },
      { timeout: 2000 }
    );
  });

  it("should work with sort applied", async () => {
    store = createMockStore({
      products: {
        products: mockProducts,
        productsLoading: false,
        productsError: null,
      },
      filters: {
        searchQuery: "",
        category: "all",
        sortOrder: "price-low",
        productByCategory: ["electronics", "jewelery", "men's clothing"],
      },
    });

    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Search products...")
      ).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Search products...");
    await user.type(searchInput, "Mens");

    await waitFor(
      () => {
        const mensProducts = screen.getAllByText(/Mens/i);
        expect(mensProducts.length).toBeGreaterThan(0);
      },
      { timeout: 2000 }
    );
  });

  it("should debounce rapid search input changes", async () => {
    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Search products...")
      ).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Search products...");

    await user.type(searchInput, "lap", { delay: 50 });

    let state = store.getState();
    expect(state.filters.searchQuery).toBe("");

    await waitFor(
      () => {
        state = store.getState();
        expect(state.filters.searchQuery).toBe("lap");
      },
      { timeout: 2000 }
    );
  });
});
