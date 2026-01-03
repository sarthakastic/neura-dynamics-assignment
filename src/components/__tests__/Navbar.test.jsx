import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { createMockStore } from "../../test-utils/mockStore";
import Navbar from "../Navbar";
import { useTheme } from "../../hooks/useTheme";

vi.mock("../../hooks/useTheme", () => ({
  useTheme: vi.fn(),
}));

describe("Navbar", () => {
  let store;
  const mockToggleTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useTheme.mockReturnValue({
      isDark: false,
      toggleTheme: mockToggleTheme,
    });
    store = createMockStore({
      favorites: {
        items: [],
      },
    });
  });

  const renderWithProviders = (ui, initialEntries = ["/"]) => {
    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
      </Provider>
    );
  };

  it("should render MyStore logo", () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByText("MyStore")).toBeInTheDocument();
  });

  it("should render Products link", () => {
    renderWithProviders(<Navbar />);
    const productsLink = screen.getByText("Products");
    expect(productsLink).toBeInTheDocument();
    expect(productsLink.closest("a")).toHaveAttribute("href", "/");
  });

  it("should render Favorites link", () => {
    renderWithProviders(<Navbar />);
    const favoritesLink = screen.getByText("Favorites");
    expect(favoritesLink).toBeInTheDocument();
    expect(favoritesLink.closest("a")).toHaveAttribute("href", "/favourites");
  });

  it("should show favorites count badge when favorites exist", () => {
    store = createMockStore({
      favorites: {
        items: [{ id: 1 }, { id: 2 }, { id: 3 }],
      },
    });
    renderWithProviders(<Navbar />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("should not show favorites count badge when no favorites", () => {
    renderWithProviders(<Navbar />);
    expect(screen.queryByText(/\d+/)).not.toBeInTheDocument();
  });

  it("should render theme toggle button", () => {
    renderWithProviders(<Navbar />);
    const themeButton = screen.getByLabelText("Toggle dark mode");
    expect(themeButton).toBeInTheDocument();
  });

  it("should call toggleTheme when theme button is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Navbar />);

    const themeButton = screen.getByLabelText("Toggle dark mode");
    await user.click(themeButton);

    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it("should show sun icon when dark mode is active", () => {
    useTheme.mockReturnValue({
      isDark: true,
      toggleTheme: mockToggleTheme,
    });
    renderWithProviders(<Navbar />);

    const themeButton = screen.getByLabelText("Toggle dark mode");
    const svg = themeButton.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("should show moon icon when light mode is active", () => {
    useTheme.mockReturnValue({
      isDark: false,
      toggleTheme: mockToggleTheme,
    });
    renderWithProviders(<Navbar />);

    const themeButton = screen.getByLabelText("Toggle dark mode");
    const svg = themeButton.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("should highlight active route", () => {
    renderWithProviders(<Navbar />, ["/"]);

    const productsLink = screen.getByText("Products");
    expect(productsLink.className).toContain("text-gradient-primary");
  });

  it("should highlight favorites route when on favourites page", () => {
    renderWithProviders(<Navbar />, ["/favourites"]);

    const favoritesLink = screen.getByText("Favorites");
    const span = favoritesLink.closest("span");
    expect(span).toBeInTheDocument();
    expect(span.className).toContain("text-gradient-primary");
  });
});
