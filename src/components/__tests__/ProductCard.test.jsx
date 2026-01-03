import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { createMockStore } from "../../test-utils/mockStore";
import ProductCard from "../ProductCard";
import { mockProduct } from "../../test-utils/mockData";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("ProductCard", () => {
  let store;

  beforeEach(() => {
    vi.clearAllMocks();
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

  it("should render product title", () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
  });

  it("should render product price", () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    expect(screen.getByText(`$${mockProduct.price}`)).toBeInTheDocument();
  });

  it("should render product image", () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    const image = screen.getByAltText(mockProduct.title);
    expect(image).toBeInTheDocument();
    expect(image.src).toBe(mockProduct.image);
  });

  it("should render product rating", () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    expect(
      screen.getByText(
        `${mockProduct.rating.rate} (${mockProduct.rating.count})`
      )
    ).toBeInTheDocument();
  });

  it("should render product category", () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    expect(screen.getByText(mockProduct.category)).toBeInTheDocument();
  });

  it("should render View Detail button", () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    expect(screen.getByText("View Detail")).toBeInTheDocument();
  });

  it("should navigate to product detail when View Detail is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductCard product={mockProduct} />);

    const viewDetailButton = screen.getByText("View Detail");
    await user.click(viewDetailButton);

    expect(mockNavigate).toHaveBeenCalledWith(`/product/${mockProduct.id}`);
  });

  it("should show unfilled heart icon when product is not favorite", () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    const favoriteButton = screen.getByLabelText("Add to favorites");
    expect(favoriteButton).toBeInTheDocument();
  });

  it("should show filled heart icon when product is favorite", () => {
    store = createMockStore({
      favorites: {
        items: [mockProduct],
      },
    });
    renderWithProviders(<ProductCard product={mockProduct} />);
    const favoriteButton = screen.getByLabelText("Remove from favorites");
    expect(favoriteButton).toBeInTheDocument();
  });

  it("should dispatch toggleFavorite when favorite button is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductCard product={mockProduct} />);

    const favoriteButton = screen.getByLabelText("Add to favorites");
    await user.click(favoriteButton);

    await new Promise((resolve) => setTimeout(resolve, 0));

    const state = store.getState();
    expect(state.favorites.items).toHaveLength(1);
    expect(state.favorites.items[0].id).toBe(mockProduct.id);
  });

  it("should remove from favorites when favorite button is clicked on favorite", async () => {
    store = createMockStore({
      favorites: {
        items: [mockProduct],
      },
    });
    const user = userEvent.setup();
    renderWithProviders(<ProductCard product={mockProduct} />);

    const favoriteButton = screen.getByLabelText("Remove from favorites");
    await user.click(favoriteButton);

    await new Promise((resolve) => setTimeout(resolve, 0));

    const state = store.getState();
    expect(state.favorites.items).toHaveLength(0);
  });

  it("should handle product without rating", () => {
    const productWithoutRating = { ...mockProduct, rating: null };
    renderWithProviders(<ProductCard product={productWithoutRating} />);
    expect(screen.getByText("N/A (0)")).toBeInTheDocument();
  });
});
