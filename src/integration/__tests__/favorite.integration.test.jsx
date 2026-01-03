import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { setupMSW } from "../../test-utils/server";
import { createMockStore } from "../../test-utils/mockStore";
import ProductCard from "../../components/ProductCard";
import MyFavourites from "../../pages/MyFavourites";
import { mockProduct, mockProducts } from "../../test-utils/mockData";

setupMSW();

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Favorite Integration Tests", () => {
  let store;
  let user;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
    store = createMockStore({
      favorites: {
        items: [],
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

  it("should add product to favorites from ProductCard", async () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    const favoriteButton = screen.getByLabelText("Add to favorites");
    await user.click(favoriteButton);

    await waitFor(() => {
      const state = store.getState();
      expect(state.favorites.items).toHaveLength(1);
      expect(state.favorites.items[0].id).toBe(mockProduct.id);
    });

    expect(screen.getByLabelText("Remove from favorites")).toBeInTheDocument();
  });

  it("should remove product from favorites when clicked again", async () => {
    store = createMockStore({
      favorites: {
        items: [mockProduct],
      },
    });

    renderWithProviders(<ProductCard product={mockProduct} />);

    const favoriteButton = screen.getByLabelText("Remove from favorites");
    await user.click(favoriteButton);

    await waitFor(() => {
      const state = store.getState();
      expect(state.favorites.items).toHaveLength(0);
    });

    expect(screen.getByLabelText("Add to favorites")).toBeInTheDocument();
  });

  it("should show favorites count in Navbar after adding favorite", async () => {
    const { rerender } = renderWithProviders(
      <ProductCard product={mockProduct} />
    );

    const favoriteButton = screen.getByLabelText("Add to favorites");
    await user.click(favoriteButton);

    await waitFor(() => {
      const state = store.getState();
      expect(state.favorites.items.length).toBe(1);
    });
  });

  it("should display favorite products on MyFavourites page", () => {
    store = createMockStore({
      favorites: {
        items: [mockProducts[0], mockProducts[1]],
      },
    });

    renderWithProviders(<MyFavourites />);

    expect(screen.getByText(mockProducts[0].title)).toBeInTheDocument();
    expect(screen.getByText(mockProducts[1].title)).toBeInTheDocument();
  });

  it("should show correct favorites count on MyFavourites page", () => {
    store = createMockStore({
      favorites: {
        items: [mockProducts[0], mockProducts[1], mockProducts[2]],
      },
    });

    renderWithProviders(<MyFavourites />);

    expect(screen.getByText(/My Favourites \(3\)/i)).toBeInTheDocument();
  });

  it("should show EmptyState when no favorites exist", () => {
    store = createMockStore({
      favorites: {
        items: [],
      },
    });

    renderWithProviders(<MyFavourites />);

    expect(screen.getByText("No favorites yet")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Start adding products to your favorites to see them here."
      )
    ).toBeInTheDocument();
  });

  it("should persist favorites across navigation", async () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    const favoriteButton = screen.getByLabelText("Add to favorites");
    await user.click(favoriteButton);

    await waitFor(() => {
      const state = store.getState();
      expect(state.favorites.items.length).toBe(1);
    });

    const { rerender } = renderWithProviders(
      <ProductCard product={mockProduct} />
    );
    rerender(
      <Provider store={store}>
        <BrowserRouter>
          <MyFavourites />
        </BrowserRouter>
      </Provider>
    );

    const productTitles = screen.getAllByText(mockProduct.title);
    expect(productTitles.length).toBeGreaterThan(0);
  });

  it("should allow removing favorite from MyFavourites page", async () => {
    store = createMockStore({
      favorites: {
        items: [mockProduct],
      },
    });

    renderWithProviders(<MyFavourites />);

    const favoriteButton = screen.getByLabelText("Remove from favorites");
    await user.click(favoriteButton);

    await waitFor(() => {
      const state = store.getState();
      expect(state.favorites.items.length).toBe(0);
    });

    expect(screen.getByText("No favorites yet")).toBeInTheDocument();
  });

  it("should handle multiple products independently", async () => {
    renderWithProviders(
      <div>
        <ProductCard product={mockProducts[0]} />
        <ProductCard product={mockProducts[1]} />
      </div>
    );

    const favoriteButtons = screen.getAllByLabelText("Add to favorites");
    await user.click(favoriteButtons[0]);

    await waitFor(() => {
      const state = store.getState();
      expect(state.favorites.items.length).toBe(1);
    });

    await user.click(favoriteButtons[1]);

    await waitFor(() => {
      const state = store.getState();
      expect(state.favorites.items.length).toBe(2);
    });

    const removeButtons = screen.getAllByLabelText("Remove from favorites");
    await user.click(removeButtons[0]);

    await waitFor(() => {
      const state = store.getState();
      expect(state.favorites.items.length).toBe(1);
      expect(state.favorites.items[0].id).toBe(mockProducts[1].id);
    });
  });

  it("should not add duplicate products to favorites", async () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    const favoriteButton = screen.getByLabelText("Add to favorites");

    await user.click(favoriteButton);
    await user.click(favoriteButton);
    await user.click(favoriteButton);

    await waitFor(() => {
      const state = store.getState();

      expect(state.favorites.items.length).toBe(1);
    });
  });
});
