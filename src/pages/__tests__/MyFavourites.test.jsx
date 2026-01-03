import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { createMockStore } from "../../test-utils/mockStore";
import MyFavourites from "../MyFavourites";
import { mockProducts } from "../../test-utils/mockData";

describe("MyFavourites", () => {
  let store;

  const renderWithProviders = (ui) => {
    return render(
      <Provider store={store}>
        <BrowserRouter>{ui}</BrowserRouter>
      </Provider>
    );
  };

  it("should render EmptyState when no favorites", () => {
    store = createMockStore({
      favorites: {
        items: [],
      },
    });
    renderWithProviders(<MyFavourites />);
    expect(screen.getByText("My Favourites")).toBeInTheDocument();
    expect(screen.getByText("No favorites yet")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Start adding products to your favorites to see them here."
      )
    ).toBeInTheDocument();
  });

  it("should render favorites count in title", () => {
    store = createMockStore({
      favorites: {
        items: [mockProducts[0], mockProducts[1]],
      },
    });
    renderWithProviders(<MyFavourites />);
    expect(screen.getByText(/My Favourites \(2\)/i)).toBeInTheDocument();
  });

  it("should render favorite products", () => {
    store = createMockStore({
      favorites: {
        items: [mockProducts[0], mockProducts[1]],
      },
    });
    renderWithProviders(<MyFavourites />);
    expect(screen.getByText(mockProducts[0].title)).toBeInTheDocument();
    expect(screen.getByText(mockProducts[1].title)).toBeInTheDocument();
  });

  it("should render all favorite products", () => {
    store = createMockStore({
      favorites: {
        items: mockProducts,
      },
    });
    renderWithProviders(<MyFavourites />);
    mockProducts.forEach((product) => {
      expect(screen.getByText(product.title)).toBeInTheDocument();
    });
  });

  it("should not render EmptyState when favorites exist", () => {
    store = createMockStore({
      favorites: {
        items: [mockProducts[0]],
      },
    });
    renderWithProviders(<MyFavourites />);
    expect(screen.queryByText("No favorites yet")).not.toBeInTheDocument();
  });
});
