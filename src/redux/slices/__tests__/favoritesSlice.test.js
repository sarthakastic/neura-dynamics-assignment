import { describe, it, expect, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import favoritesReducer, {
  addToFavorites,
  removeFromFavorites,
  toggleFavorite,
} from "../favoritesSlice";
import { mockProduct, mockProducts } from "../../../test-utils/mockData";

describe("favoritesSlice", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        favorites: favoritesReducer,
      },
    });
  });

  describe("initial state", () => {
    it("should have correct initial state", () => {
      const state = store.getState().favorites;
      expect(state).toEqual({
        items: [],
      });
    });
  });

  describe("addToFavorites", () => {
    it("should add product to favorites when not exists", () => {
      store.dispatch(addToFavorites(mockProduct));
      const state = store.getState().favorites;
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(mockProduct);
    });

    it("should not add duplicate product", () => {
      store.dispatch(addToFavorites(mockProduct));
      store.dispatch(addToFavorites(mockProduct));
      const state = store.getState().favorites;
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(mockProduct);
    });

    it("should add multiple different products", () => {
      const product1 = mockProducts[0];
      const product2 = mockProducts[1];

      store.dispatch(addToFavorites(product1));
      store.dispatch(addToFavorites(product2));

      const state = store.getState().favorites;
      expect(state.items).toHaveLength(2);
      expect(state.items).toContainEqual(product1);
      expect(state.items).toContainEqual(product2);
    });

    it("should not add product if it already exists", () => {
      const product = mockProduct;
      store.dispatch(addToFavorites(product));
      store.dispatch(addToFavorites(product));
      store.dispatch(addToFavorites(product));

      const state = store.getState().favorites;
      expect(state.items).toHaveLength(1);
    });
  });

  describe("removeFromFavorites", () => {
    it("should remove product from favorites by id", () => {
      const product1 = mockProducts[0];
      const product2 = mockProducts[1];

      store.dispatch(addToFavorites(product1));
      store.dispatch(addToFavorites(product2));

      store.dispatch(removeFromFavorites(product1.id));

      const state = store.getState().favorites;
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(product2);
    });

    it("should not remove anything if product not in favorites", () => {
      const product = mockProduct;
      store.dispatch(addToFavorites(product));
      store.dispatch(removeFromFavorites(999));

      const state = store.getState().favorites;
      expect(state.items).toHaveLength(1);
    });

    it("should handle removing from empty favorites", () => {
      store.dispatch(removeFromFavorites(1));
      const state = store.getState().favorites;
      expect(state.items).toHaveLength(0);
    });
  });

  describe("toggleFavorite", () => {
    it("should add product when not in favorites", () => {
      store.dispatch(toggleFavorite(mockProduct));
      const state = store.getState().favorites;
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(mockProduct);
    });

    it("should remove product when already in favorites", () => {
      const product = mockProduct;
      store.dispatch(toggleFavorite(product));
      store.dispatch(toggleFavorite(product));

      const state = store.getState().favorites;
      expect(state.items).toHaveLength(0);
    });

    it("should toggle product multiple times", () => {
      const product = mockProduct;
      store.dispatch(toggleFavorite(product));
      store.dispatch(toggleFavorite(product));
      store.dispatch(toggleFavorite(product));

      const state = store.getState().favorites;
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(product);
    });

    it("should handle multiple products independently", () => {
      const product1 = mockProducts[0];
      const product2 = mockProducts[1];

      store.dispatch(toggleFavorite(product1));
      store.dispatch(toggleFavorite(product2));
      store.dispatch(toggleFavorite(product1));

      const state = store.getState().favorites;
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(product2);
    });

    it("should not add duplicate when toggling same product twice", () => {
      const product = mockProduct;
      store.dispatch(toggleFavorite(product));
      store.dispatch(toggleFavorite(product));
      store.dispatch(toggleFavorite(product));

      const state = store.getState().favorites;
      expect(state.items).toHaveLength(1);
    });
  });

  describe("combined operations", () => {
    it("should handle add, remove, and toggle together", () => {
      const product1 = mockProducts[0];
      const product2 = mockProducts[1];
      const product3 = mockProducts[2];

      store.dispatch(addToFavorites(product1));
      store.dispatch(addToFavorites(product2));
      store.dispatch(toggleFavorite(product3));
      store.dispatch(removeFromFavorites(product1.id));
      store.dispatch(toggleFavorite(product2));

      const state = store.getState().favorites;
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(product3);
    });
  });
});
