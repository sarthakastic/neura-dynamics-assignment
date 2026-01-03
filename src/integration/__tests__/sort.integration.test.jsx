import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { setupMSW } from "../../test-utils/server";
import { createMockStore } from "../../test-utils/mockStore";
import Home from "../../pages/Home";
import { mockProducts } from "../../test-utils/mockData";

setupMSW();

describe("Sort Integration Tests", () => {
  let store;
  let user;

  beforeEach(() => {
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

  const renderWithProviders = (ui) => {
    return render(
      <Provider store={store}>
        <BrowserRouter>{ui}</BrowserRouter>
      </Provider>
    );
  };

  it("should sort products by price low to high", async () => {
    renderWithProviders(<Home />);

    const sortButton = screen.getByText("Default");
    await user.click(sortButton);

    const lowToHighOption = screen.getByText("Price: Low → High");
    await user.click(lowToHighOption);

    await waitFor(() => {
      const state = store.getState();
      expect(state.filters.sortOrder).toBe("price-low");
    });

    await waitFor(() => {
      const prices = screen.getAllByText(/\$\d+\.\d+/);
      if (prices.length > 1) {
        const priceValues = prices.map((price) =>
          parseFloat(price.textContent.replace("$", ""))
        );
        for (let i = 0; i < priceValues.length - 1; i++) {
          expect(priceValues[i]).toBeLessThanOrEqual(priceValues[i + 1]);
        }
      }
    });
  });

  it("should sort products by price high to low", async () => {
    renderWithProviders(<Home />);

    const sortButton = screen.getByText("Default");
    await user.click(sortButton);

    const highToLowOption = screen.getByText("Price: High → Low");
    await user.click(highToLowOption);

    await waitFor(() => {
      const state = store.getState();
      expect(state.filters.sortOrder).toBe("price-high");
    });

    await waitFor(() => {
      const prices = screen.getAllByText(/\$\d+\.\d+/);
      if (prices.length > 1) {
        const priceValues = prices.map((price) =>
          parseFloat(price.textContent.replace("$", ""))
        );
        for (let i = 0; i < priceValues.length - 1; i++) {
          expect(priceValues[i]).toBeGreaterThanOrEqual(priceValues[i + 1]);
        }
      }
    });
  });

  it("should reset to default sort order", async () => {
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

    const sortButton = screen.getByText("Price: Low → High");
    await user.click(sortButton);

    const defaultOption = screen.getByText("Default");
    await user.click(defaultOption);

    await waitFor(() => {
      const state = store.getState();
      expect(state.filters.sortOrder).toBe("none");
    });
  });

  it("should persist sort order across interactions", async () => {
    renderWithProviders(<Home />);

    const sortButton = screen.getByText("Default");
    await user.click(sortButton);
    const lowToHighOption = screen.getByText("Price: Low → High");
    await user.click(lowToHighOption);

    await waitFor(() => {
      const state = store.getState();
      expect(state.filters.sortOrder).toBe("price-low");
    });

    const state = store.getState();
    expect(state.filters.sortOrder).toBe("price-low");
  });

  it("should work with search query applied", async () => {
    store = createMockStore({
      products: {
        products: mockProducts,
        productsLoading: false,
        productsError: null,
      },
      filters: {
        searchQuery: "Mens",
        category: "all",
        sortOrder: "none",
        productByCategory: ["electronics", "jewelery", "men's clothing"],
      },
    });

    renderWithProviders(<Home />);

    const sortButton = screen.getByText("Default");
    await user.click(sortButton);
    const lowToHighOption = screen.getByText("Price: Low → High");
    await user.click(lowToHighOption);

    await waitFor(() => {
      const state = store.getState();
      expect(state.filters.sortOrder).toBe("price-low");
    });

    await waitFor(() => {
      const mensProducts = screen.getAllByText(/Mens/i);
      expect(mensProducts.length).toBeGreaterThan(0);
    });
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

    const sortButton = screen.getByText("Default");
    await user.click(sortButton);
    const highToLowOption = screen.getByText("Price: High → Low");
    await user.click(highToLowOption);

    await waitFor(() => {
      const state = store.getState();
      expect(state.filters.sortOrder).toBe("price-high");
    });

    await waitFor(() => {
      const products = screen.getAllByText(/Fjallraven|Mens/i);
      expect(products.length).toBeGreaterThan(0);
    });
  });

  it("should reset sort order when Clear Filters is clicked", async () => {
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
      const clearButton = screen.getByText("Clear Filters");
      expect(clearButton).not.toBeDisabled();
    });
    const clearButton = screen.getByText("Clear Filters");
    await user.click(clearButton);

    await waitFor(() => {
      const state = store.getState();
      expect(state.filters.sortOrder).toBe("none");
    });
  });

  it("should show selected sort option in dropdown button", async () => {
    store = createMockStore({
      products: {
        products: mockProducts,
        productsLoading: false,
        productsError: null,
      },
      filters: {
        searchQuery: "",
        category: "all",
        sortOrder: "price-high",
        productByCategory: ["electronics", "jewelery", "men's clothing"],
      },
    });

    renderWithProviders(<Home />);

    expect(screen.getByText("Price: High → Low")).toBeInTheDocument();
  });
});
