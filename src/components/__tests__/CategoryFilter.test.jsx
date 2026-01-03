import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { createMockStore } from "../../test-utils/mockStore";
import CategoryFilter from "../CategoryFilter";
import { mockCategories } from "../../test-utils/mockData";

describe("CategoryFilter", () => {
  let store;

  beforeEach(() => {
    store = createMockStore({
      filters: {
        category: "all",
        productByCategory: mockCategories,
      },
    });
  });

  const renderWithProvider = (ui) => {
    return render(<Provider store={store}>{ui}</Provider>);
  };

  it("should render Categories label", () => {
    renderWithProvider(<CategoryFilter />);
    expect(screen.getByText("Categories")).toBeInTheDocument();
  });

  it("should render 'All' button", () => {
    renderWithProvider(<CategoryFilter />);
    expect(screen.getByText("All")).toBeInTheDocument();
  });

  it("should render all category buttons", () => {
    renderWithProvider(<CategoryFilter />);
    expect(screen.getByText("All")).toBeInTheDocument();
    mockCategories.forEach((category) => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  it("should highlight active category", () => {
    store = createMockStore({
      filters: {
        category: "electronics",
        productByCategory: mockCategories,
      },
    });
    renderWithProvider(<CategoryFilter />);

    const electronicsButton = screen.getByText("electronics");
    const buttonElement = electronicsButton.closest("button");
    expect(buttonElement.className).toContain("bg-linear-to-r");
  });

  it("should dispatch setCategory when category button is clicked", async () => {
    const user = userEvent.setup();
    renderWithProvider(<CategoryFilter />);

    const electronicsButton = screen.getByText("electronics");
    await user.click(electronicsButton);

    await new Promise((resolve) => setTimeout(resolve, 0));

    const state = store.getState();
    expect(state.filters.category).toBe("electronics");
  });

  it("should highlight 'All' when category is 'all'", () => {
    store = createMockStore({
      filters: {
        category: "all",
        productByCategory: mockCategories,
      },
    });
    renderWithProvider(<CategoryFilter />);

    const allButton = screen.getByText("All");
    const buttonElement = allButton.closest("button");
    expect(buttonElement.className).toContain("bg-linear-to-r");
  });

  it("should handle empty categories array", () => {
    store = createMockStore({
      filters: {
        category: "all",
        productByCategory: [],
      },
    });
    renderWithProvider(<CategoryFilter />);

    expect(screen.getByText("All")).toBeInTheDocument();
    mockCategories.forEach((category) => {
      expect(screen.queryByText(category)).not.toBeInTheDocument();
    });
  });
});
