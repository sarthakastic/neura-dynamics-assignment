import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter, useParams } from "react-router-dom";
import { setupMSW } from "../../test-utils/server";
import { createMockStore } from "../../test-utils/mockStore";
import ProductDetail from "../ProductDetail";
import { mockProduct } from "../../test-utils/mockData";

setupMSW();

const mockUseParams = vi.fn();
const mockUseProductDetail = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => mockUseParams(),
  };
});

vi.mock("../../hooks/useProductDetail", () => ({
  useProductDetail: (id) => mockUseProductDetail(id),
}));

describe("ProductDetail", () => {
  let store;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({ id: "1" });
    mockUseProductDetail.mockReturnValue({
      product: null,
      productLoading: false,
      productError: null,
      isFavorite: false,
      handleToggleFavorite: vi.fn(),
    });
    store = createMockStore({
      products: {
        product: null,
        productLoading: false,
        productError: null,
      },
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

  it("should render loading skeleton when productLoading is true", () => {
    mockUseProductDetail.mockReturnValue({
      product: null,
      productLoading: true,
      productError: null,
      isFavorite: false,
      handleToggleFavorite: vi.fn(),
    });
    renderWithProviders(<ProductDetail />);

    const skeletons = document.querySelectorAll(".animate-shimmer");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("should render error message when productError exists", () => {
    mockUseProductDetail.mockReturnValue({
      product: null,
      productLoading: false,
      productError: "Failed to fetch product",
      isFavorite: false,
      handleToggleFavorite: vi.fn(),
    });
    renderWithProviders(<ProductDetail />);
    expect(
      screen.getByText(/Error: Failed to fetch product/i)
    ).toBeInTheDocument();
  });

  it("should render 'Product not found' when product is null", () => {
    mockUseProductDetail.mockReturnValue({
      product: null,
      productLoading: false,
      productError: null,
      isFavorite: false,
      handleToggleFavorite: vi.fn(),
    });
    renderWithProviders(<ProductDetail />);
    expect(screen.getByText("Product not found")).toBeInTheDocument();
  });

  it("should render ProductDetailView when product is loaded", () => {
    mockUseProductDetail.mockReturnValue({
      product: mockProduct,
      productLoading: false,
      productError: null,
      isFavorite: false,
      handleToggleFavorite: vi.fn(),
    });
    renderWithProviders(<ProductDetail />);
    expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
  });

  it("should use product id from route params", () => {
    mockUseParams.mockReturnValue({ id: "2" });
    store = createMockStore({
      products: {
        product: { ...mockProduct, id: 2 },
        productLoading: false,
        productError: null,
      },
      favorites: {
        items: [],
      },
    });
    renderWithProviders(<ProductDetail />);
    expect(mockUseParams).toHaveBeenCalled();
  });
});
