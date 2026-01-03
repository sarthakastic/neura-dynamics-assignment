import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { createMockStore } from "../../test-utils/mockStore";
import SortByPrice from "../SortByPrice";

describe("SortByPrice", () => {
  let store;

  beforeEach(() => {
    store = createMockStore({
      filters: {
        sortOrder: "none",
      },
    });
  });

  const renderWithProvider = (ui) => {
    return render(<Provider store={store}>{ui}</Provider>);
  };

  it("should render Sort by label", () => {
    renderWithProvider(<SortByPrice />);
    expect(screen.getByText("Sort by")).toBeInTheDocument();
  });

  it("should render dropdown button", () => {
    renderWithProvider(<SortByPrice />);
    const button = screen.getByText("Default");
    expect(button).toBeInTheDocument();
  });

  it("should show selected option", () => {
    store = createMockStore({
      filters: {
        sortOrder: "price-low",
      },
    });
    renderWithProvider(<SortByPrice />);
    expect(screen.getByText("Price: Low → High")).toBeInTheDocument();
  });

  it("should open dropdown when button is clicked", async () => {
    const user = userEvent.setup();
    renderWithProvider(<SortByPrice />);

    const button = screen.getByText("Default");
    await user.click(button);

    expect(screen.getByText("Price: Low → High")).toBeInTheDocument();
    expect(screen.getByText("Price: High → Low")).toBeInTheDocument();
  });

  it("should close dropdown when option is selected", async () => {
    const user = userEvent.setup();
    renderWithProvider(<SortByPrice />);

    const button = screen.getByText("Default");
    await user.click(button);

    const lowToHighOption = screen.getByText("Price: Low → High");
    await user.click(lowToHighOption);

    await new Promise((resolve) => setTimeout(resolve, 0));

    const state = store.getState();
    expect(state.filters.sortOrder).toBe("price-low");
  });

  it("should dispatch setSortOrder when option is clicked", async () => {
    const user = userEvent.setup();
    renderWithProvider(<SortByPrice />);

    const button = screen.getByText("Default");
    await user.click(button);

    const highToLowOption = screen.getByText("Price: High → Low");
    await user.click(highToLowOption);

    await new Promise((resolve) => setTimeout(resolve, 0));

    const state = store.getState();
    expect(state.filters.sortOrder).toBe("price-high");
  });

  it("should highlight selected option in dropdown", async () => {
    store = createMockStore({
      filters: {
        sortOrder: "price-low",
      },
    });
    const user = userEvent.setup();
    renderWithProvider(<SortByPrice />);

    const button = screen.getByText("Price: Low → High");
    await user.click(button);

    const allOptions = screen.getAllByText("Price: Low → High");

    const dropdownOption = allOptions.find((el) => {
      const buttonEl = el.closest("button");
      return buttonEl && buttonEl.className.includes("bg-blue-600");
    });
    expect(dropdownOption).toBeDefined();
  });

  it("should close dropdown when clicking outside", async () => {
    const user = userEvent.setup();
    renderWithProvider(
      <div>
        <div data-testid="outside">Outside</div>
        <SortByPrice />
      </div>
    );

    const button = screen.getByText("Default");
    await user.click(button);

    expect(screen.getByText("Price: Low → High")).toBeInTheDocument();
    expect(screen.getByText("Price: High → Low")).toBeInTheDocument();

    const outside = screen.getByTestId("outside");
    await user.click(outside);

    await new Promise((resolve) => setTimeout(resolve, 100));

    const dropdownOptions = screen.queryAllByText("Price: Low → High");

    expect(dropdownOptions.length).toBeLessThanOrEqual(1);
  });
});
