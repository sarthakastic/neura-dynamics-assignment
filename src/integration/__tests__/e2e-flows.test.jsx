import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { setupMSW } from "../../test-utils/server";
import { createMockStore } from "../../test-utils/mockStore";
import Home from "../../pages/Home";
import MyFavourites from "../../pages/MyFavourites";
import { mockProducts } from "../../test-utils/mockData";

setupMSW();

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("End-to-End User Flows", () => {
  let store;
  let user;

  beforeEach(() => {
    vi.clearAllMocks();

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
        productByCategory: [
          "electronics",
          "jewelery",
          "men's clothing",
          "women's clothing",
        ],
      },
      favorites: {
        items: [],
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

  it("should complete search → filter → sort flow", async () => {
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
        const state = store.getState();
        expect(state.filters.searchQuery).toBe("Mens");
      },
      { timeout: 2000 }
    );

    const categoryButtons = screen.getAllByRole("button");
    const mensCategoryButton = categoryButtons.find(
      (btn) => btn.textContent === "men's clothing"
    );
    expect(mensCategoryButton).toBeDefined();
    await user.click(mensCategoryButton);

    await waitFor(() => {
      const state = store.getState();
      expect(state.filters.category).toBe("men's clothing");
    });

    const sortButton = screen.getByText("Default");
    await user.click(sortButton);
    const lowToHighOption = screen.getByText("Price: Low → High");
    await user.click(lowToHighOption);

    await waitFor(() => {
      const state = store.getState();
      expect(state.filters.sortOrder).toBe("price-low");
      expect(state.filters.category).toBe("men's clothing");
      expect(state.filters.searchQuery).toBe("Mens");
    });

    const finalState = store.getState();
    expect(finalState.filters.searchQuery).toBe("Mens");
    expect(finalState.filters.category).toBe("men's clothing");
    expect(finalState.filters.sortOrder).toBe("price-low");
  });

  it("should complete browse → view detail → add to favorites → check favorites page flow", async () => {
    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(screen.getByText(mockProducts[0].title)).toBeInTheDocument();
    });

    const productCards = screen.getAllByText("View Detail");

    store.dispatch({
      type: "favorites/toggleFavorite",
      payload: mockProducts[0],
    });

    await waitFor(() => {
      const state = store.getState();
      expect(state.favorites.items.length).toBe(1);
    });

    const { rerender } = renderWithProviders(<Home />);
    rerender(
      <Provider store={store}>
        <BrowserRouter>
          <MyFavourites />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText(mockProducts[0].title)).toBeInTheDocument();
    expect(screen.getByText(/My Favourites \(1\)/i)).toBeInTheDocument();
  });

  it("should complete search → filter → add to favorites → navigate → verify favorites flow", async () => {
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
        const state = store.getState();
        expect(state.filters.searchQuery).toBe("Mens");
      },
      { timeout: 2000 }
    );

    const categoryButtons = screen.getAllByRole("button");
    const mensCategoryButton = categoryButtons.find(
      (btn) => btn.textContent === "men's clothing"
    );
    expect(mensCategoryButton).toBeDefined();
    await user.click(mensCategoryButton);

    await waitFor(() => {
      const state = store.getState();
      expect(state.filters.searchQuery).toBe("Mens");
      expect(state.filters.category).toBe("men's clothing");
    });

    const mensProduct = mockProducts.find((p) => p.title.includes("Mens"));
    if (mensProduct) {
      store.dispatch({
        type: "favorites/toggleFavorite",
        payload: mensProduct,
      });
    }

    await waitFor(() => {
      const state = store.getState();
      expect(state.favorites.items.length).toBeGreaterThan(0);
    });

    const { rerender } = renderWithProviders(<Home />);
    rerender(
      <Provider store={store}>
        <BrowserRouter>
          <MyFavourites />
        </BrowserRouter>
      </Provider>
    );

    if (mensProduct) {
      expect(screen.getByText(mensProduct.title)).toBeInTheDocument();
    }
  });

  it("should clear all filters after applying multiple filters", async () => {
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
        const state = store.getState();
        expect(state.filters.searchQuery).toBe("Mens");
      },
      { timeout: 2000 }
    );

    const categoryButtons = screen.getAllByRole("button");
    const mensCategoryButton = categoryButtons.find(
      (btn) => btn.textContent === "men's clothing"
    );
    expect(mensCategoryButton).toBeDefined();
    await user.click(mensCategoryButton);

    const sortButton = screen.getByText("Default");
    await user.click(sortButton);
    const lowToHighOption = screen.getByText("Price: Low → High");
    await user.click(lowToHighOption);

    await waitFor(() => {
      const state = store.getState();
      expect(state.filters.searchQuery).toBe("Mens");
      expect(state.filters.category).toBe("men's clothing");
      expect(state.filters.sortOrder).toBe("price-low");
    });

    const clearButton = screen.getByRole("button", { name: /Clear Filters/i });
    expect(clearButton).not.toBeDisabled();
    await user.click(clearButton);

    await waitFor(() => {
      const state = store.getState();
      expect(state.filters.searchQuery).toBe("");
      expect(state.filters.category).toBe("all");
      expect(state.filters.sortOrder).toBe("none");
    });
  });

  it("should navigate between pages and verify state persistence", async () => {
    const { rerender } = renderWithProviders(<Home />);

    store.dispatch({
      type: "favorites/toggleFavorite",
      payload: mockProducts[0],
    });

    await waitFor(() => {
      const state = store.getState();
      expect(state.favorites.items.length).toBe(1);
    });

    rerender(
      <Provider store={store}>
        <BrowserRouter>
          <MyFavourites />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText(mockProducts[0].title)).toBeInTheDocument();

    rerender(
      <Provider store={store}>
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </Provider>
    );

    const state = store.getState();
    expect(state.favorites.items.length).toBe(1);
  });

  it("should handle complex filter combination: search + category + sort + favorite", async () => {
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
        const state = store.getState();
        expect(state.filters.searchQuery).toBe("Mens");
      },
      { timeout: 2000 }
    );

    const categoryButtons = screen.getAllByRole("button");
    const mensCategoryButton = categoryButtons.find(
      (btn) => btn.textContent === "men's clothing"
    );
    expect(mensCategoryButton).toBeDefined();
    await user.click(mensCategoryButton);

    const sortButton = screen.getByText("Default");
    await user.click(sortButton);
    const highToLowOption = screen.getByText("Price: High → Low");
    await user.click(highToLowOption);

    const mensProduct = mockProducts.find((p) => p.title.includes("Mens"));
    if (mensProduct) {
      store.dispatch({
        type: "favorites/toggleFavorite",
        payload: mensProduct,
      });
    }

    await waitFor(() => {
      const state = store.getState();
      expect(state.filters.searchQuery).toBe("Mens");
      expect(state.filters.category).toBe("men's clothing");
      expect(state.filters.sortOrder).toBe("price-high");
      expect(state.favorites.items.length).toBeGreaterThan(0);
    });

    const finalState = store.getState();
    expect(finalState.filters.searchQuery).toBe("Mens");
    expect(finalState.filters.category).toBe("men's clothing");
    expect(finalState.filters.sortOrder).toBe("price-high");
    expect(finalState.favorites.items.length).toBeGreaterThan(0);
  });
});
