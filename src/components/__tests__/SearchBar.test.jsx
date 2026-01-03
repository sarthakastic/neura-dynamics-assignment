import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { createMockStore } from "../../test-utils/mockStore";
import SearchBar from "../SearchBar";

describe("SearchBar", () => {
  let store;

  beforeEach(() => {
    vi.useRealTimers();
    store = createMockStore({
      filters: {
        searchQuery: "",
      },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const renderWithProvider = (ui) => {
    return render(<Provider store={store}>{ui}</Provider>);
  };

  it("should render search input", async () => {
    renderWithProvider(<SearchBar />);
    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Search products...")
      ).toBeInTheDocument();
    });
  });

  it("should update local state on input change", async () => {
    const user = userEvent.setup();
    renderWithProvider(<SearchBar />);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Search products...")
      ).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText("Search products...");
    await user.type(input, "laptop");

    expect(input.value).toBe("laptop");
  });

  it("should dispatch setSearchQuery after debounce", async () => {
    const user = userEvent.setup();
    renderWithProvider(<SearchBar />);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Search products...")
      ).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText("Search products...");
    await user.type(input, "laptop");

    await waitFor(
      () => {
        const state = store.getState();
        expect(state.filters.searchQuery).toBe("laptop");
      },
      { timeout: 1000 }
    );
  });

  it("should not dispatch setSearchQuery before debounce delay", async () => {
    const user = userEvent.setup();
    renderWithProvider(<SearchBar />);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Search products...")
      ).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText("Search products...");
    await user.type(input, "laptop");

    let state = store.getState();
    expect(state.filters.searchQuery).toBe("");

    await new Promise((resolve) => setTimeout(resolve, 400));

    state = store.getState();
    expect(state.filters.searchQuery).toBe("");
  });

  it("should show product count when productsCount > 0", async () => {
    renderWithProvider(<SearchBar productsCount={5} />);

    await waitFor(() => {
      expect(screen.getByText("5 products found")).toBeInTheDocument();
    });
  });

  it("should not show product count when productsCount is 0", () => {
    renderWithProvider(<SearchBar productsCount={0} />);
    expect(screen.queryByText(/products found/)).not.toBeInTheDocument();
  });

  it("should sync with Redux searchQuery state", async () => {
    store = createMockStore({
      filters: {
        searchQuery: "existing query",
      },
    });
    renderWithProvider(<SearchBar />);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Search products...")
      ).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText("Search products...");
    expect(input.value).toBe("existing query");
  });

  it("should debounce multiple rapid changes", async () => {
    const user = userEvent.setup();
    renderWithProvider(<SearchBar />);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Search products...")
      ).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText("Search products...");
    await user.type(input, "lap", { delay: 50 });

    let state = store.getState();
    expect(state.filters.searchQuery).toBe("");

    await waitFor(
      () => {
        state = store.getState();
        expect(state.filters.searchQuery).toBe("lap");
      },
      { timeout: 1000 }
    );
  });
});
