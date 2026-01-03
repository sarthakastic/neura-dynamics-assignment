import { createSelector } from "@reduxjs/toolkit";

export const selectAllProducts = (state) => state.products.items;
export const selectProductsStatus = (state) => state.products.status;
export const selectSelectedProduct = (state) => state.products.selectedProduct;

export const selectFavorites = (state) => state.favorites.items;
export const selectFavoritesCount = (state) => state.favorites.items.length;

export const selectFilters = (state) => state.filters;

export const selectCategories = createSelector(
  [selectAllProducts],
  (products) => {
    const categories = products.map((p) => p.category);
    return ["all", ...new Set(categories)];
  }
);

export const selectFilteredProducts = createSelector(
  [selectAllProducts, selectFilters],
  (products, filters) => {
    let result = [...products];

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(query));
    }

    // Filter by category
    if (filters.category && filters.category !== "all") {
      result = result.filter((p) => p.category === filters.category);
    }

    // Sort by price
    if (filters.sortOrder === "asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortOrder === "desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }
);

export const selectIsFavorite = (productId) =>
  createSelector([selectFavorites], (favorites) =>
    favorites.some((item) => item.id === productId)
  );
