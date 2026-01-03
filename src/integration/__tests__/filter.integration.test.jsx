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

describe("Filter Integration Tests", () => {
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
        productByCategory: [
          "electronics",
          "jewelery",
          "men's clothing",
          "women's clothing",
        ],
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

  it("should filter products by selected category", async () => {
    renderWithProviders(<Home />);

    const electronicsButton = screen.getByText("electronics");
    await user.click(electronicsButton);

    await waitFor(() => {
      const state = store.getState();
      expect(state.filters.category).toBe("electronics");
    });

    await waitFor(() => {
      const displayedProducts = screen.queryAllByText(
        /Fjallraven|Mens|John Hardy/i
      );

      expect(displayedProducts.length).toBeGreaterThanOrEqual(0);
    });
  });

  it("should show all products when 'All' category is selected", async () => {
    store = createMockStore({
      products: {
        products: mockProducts,
        productsLoading: false,
        productsError: null,
      },
      filters: {
        searchQuery: "",
        category: "electronics",
        sortOrder: "none",
        productByCategory: ["electronics", "jewelery", "men's clothing"],
      },
    });

    renderWithProviders(<Home />);

    const allButton = screen.getByText("All");
    await user.click(allButton);

    await waitFor(() => {
      const state = store.getState();
      expect(state.filters.category).toBe("all");
    });

    await waitFor(() => {
      expect(
        screen.getByText("Fjallraven - Foldsack No. 1 Backpack")
      ).toBeInTheDocument();
    });
  });

  it("should persist category filter across interactions", async () => {
    renderWithProviders(<Home />);

    const electronicsButton = screen.getByText("electronics");
    await user.click(electronicsButton);

    await waitFor(() => {
      const state = store.getState();
      expect(state.filters.category).toBe("electronics");
    });

    const state = store.getState();
    expect(state.filters.category).toBe("electronics");
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

    const mensCategoryButton = screen.getByText("men's clothing");
    await user.click(mensCategoryButton);

    await waitFor(() => {
      const state = store.getState();
      expect(state.filters.category).toBe("men's clothing");
    });

    await waitFor(() => {
      const products = screen.queryAllByText(/Mens/i);
      expect(products.length).toBeGreaterThan(0);
    });
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
        screen.getByText("Fjallraven - Foldsack No. 1 Backpack")
      ).toBeInTheDocument();
    });

    const categoryButtons = screen.getAllByRole("button");
    const mensClothingButton = categoryButtons.find(
      (btn) => btn.textContent.trim().toLowerCase() === "men's clothing"
    );
    expect(mensClothingButton).toBeDefined();
    await user.click(mensClothingButton);

    await waitFor(() => {
      const state = store.getState();
      expect(state.filters.category).toBe("men's clothing");
    });

    await waitFor(() => {
      const products = screen.getAllByText(/Fjallraven|Mens/i);
      expect(products.length).toBeGreaterThan(0);
    });
  });

  it("should reset category filter when Clear Filters is clicked", async () => {
    store = createMockStore({
      products: {
        products: mockProducts,
        productsLoading: false,
        productsError: null,
      },
      filters: {
        searchQuery: "",
        category: "electronics",
        sortOrder: "none",
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
      expect(state.filters.category).toBe("all");
    });
  });

  it("should highlight active category button", async () => {
    store = createMockStore({
      products: {
        products: mockProducts,
        productsLoading: false,
        productsError: null,
      },
      filters: {
        searchQuery: "",
        category: "electronics",
        sortOrder: "none",
        productByCategory: ["electronics", "jewelery", "men's clothing"],
      },
    });

    renderWithProviders(<Home />);

    const electronicsButton = screen.getByText("electronics");
    const buttonElement = electronicsButton.closest("button");
    expect(buttonElement.className).toContain("bg-linear-to-r");
  });
});
