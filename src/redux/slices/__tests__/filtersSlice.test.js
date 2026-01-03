import { describe, it, expect, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import filtersReducer, {
  setSearchQuery,
  setCategory,
  setSortOrder,
  resetFilters,
  fetchProductByCategory,
} from "../filtersSlice";
import { setupMSW, server } from "../../../test-utils/server";
import { http, HttpResponse } from "msw";
import { mockCategories } from "../../../test-utils/mockData";
import { API_BASE_URL } from "../../../utils/constants";

setupMSW();

describe("filtersSlice", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        filters: filtersReducer,
      },
    });
  });

  describe("initial state", () => {
    it("should have correct initial state", () => {
      const state = store.getState().filters;
      expect(state).toEqual({
        searchQuery: "",
        category: "all",
        sortOrder: "none",
        productByCategory: [],
        categoryLoading: false,
        categoryError: null,
      });
    });
  });

  describe("setSearchQuery", () => {
    it("should update searchQuery", () => {
      store.dispatch(setSearchQuery("laptop"));
      const state = store.getState().filters;
      expect(state.searchQuery).toBe("laptop");
    });

    it("should update searchQuery with empty string", () => {
      store.dispatch(setSearchQuery(""));
      const state = store.getState().filters;
      expect(state.searchQuery).toBe("");
    });

    it("should update searchQuery with special characters", () => {
      store.dispatch(setSearchQuery("test@123"));
      const state = store.getState().filters;
      expect(state.searchQuery).toBe("test@123");
    });
  });

  describe("setCategory", () => {
    it("should update category", () => {
      store.dispatch(setCategory("electronics"));
      const state = store.getState().filters;
      expect(state.category).toBe("electronics");
    });

    it("should update category to 'all'", () => {
      store.dispatch(setCategory("all"));
      const state = store.getState().filters;
      expect(state.category).toBe("all");
    });

    it("should update category multiple times", () => {
      store.dispatch(setCategory("electronics"));
      store.dispatch(setCategory("jewelery"));
      const state = store.getState().filters;
      expect(state.category).toBe("jewelery");
    });
  });

  describe("setSortOrder", () => {
    it("should update sortOrder to 'price-low'", () => {
      store.dispatch(setSortOrder("price-low"));
      const state = store.getState().filters;
      expect(state.sortOrder).toBe("price-low");
    });

    it("should update sortOrder to 'price-high'", () => {
      store.dispatch(setSortOrder("price-high"));
      const state = store.getState().filters;
      expect(state.sortOrder).toBe("price-high");
    });

    it("should update sortOrder to 'none'", () => {
      store.dispatch(setSortOrder("none"));
      const state = store.getState().filters;
      expect(state.sortOrder).toBe("none");
    });
  });

  describe("resetFilters", () => {
    it("should reset all filters to initial state", () => {
      store.dispatch(setSearchQuery("laptop"));
      store.dispatch(setCategory("electronics"));
      store.dispatch(setSortOrder("price-low"));

      store.dispatch(resetFilters());

      const state = store.getState().filters;
      expect(state.searchQuery).toBe("");
      expect(state.category).toBe("all");
      expect(state.sortOrder).toBe("none");
    });

    it("should reset filters even when already at initial state", () => {
      store.dispatch(resetFilters());
      const state = store.getState().filters;
      expect(state.searchQuery).toBe("");
      expect(state.category).toBe("all");
      expect(state.sortOrder).toBe("none");
    });
  });

  describe("fetchProductByCategory async thunk", () => {
    it("should handle pending state", () => {
      store.dispatch(fetchProductByCategory());
      const state = store.getState().filters;
      expect(state.categoryLoading).toBe(true);
      expect(state.categoryError).toBe(null);
    });

    it("should handle fulfilled state with categories", async () => {
      await store.dispatch(fetchProductByCategory());
      const state = store.getState().filters;
      expect(state.categoryLoading).toBe(false);
      expect(state.productByCategory).toEqual(mockCategories);
      expect(state.categoryError).toBe(null);
    });

    it("should handle rejected state", async () => {
      server.use(
        http.get(`${API_BASE_URL}/products/categories`, () => {
          return HttpResponse.error();
        })
      );

      await store.dispatch(fetchProductByCategory());
      const state = store.getState().filters;

      expect(state.categoryLoading).toBe(false);
      expect(state.categoryError).toBeDefined();
      expect(state.productByCategory).toEqual([]);
    });

    it("should handle network error with default message", async () => {
      server.use(
        http.get(`${API_BASE_URL}/products/categories`, () => {
          return HttpResponse.error();
        })
      );

      await store.dispatch(fetchProductByCategory());
      const state = store.getState().filters;

      expect(state.categoryLoading).toBe(false);
      expect(state.categoryError).toBeDefined();
    });
  });
});
