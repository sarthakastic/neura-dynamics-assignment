import { describe, it, expect, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import productReducer, {
  fetchProducts,
  fetchProductById,
} from "../productSlice";
import { setupMSW, server } from "../../../test-utils/server";
import { http, HttpResponse } from "msw";
import { mockProducts, mockProduct } from "../../../test-utils/mockData";
import { API_BASE_URL } from "../../../utils/constants";

setupMSW();

describe("productSlice", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        products: productReducer,
      },
    });
  });

  describe("initial state", () => {
    it("should have correct initial state", () => {
      const state = store.getState().products;
      expect(state).toEqual({
        products: [],
        product: null,
        productsLoading: false,
        productLoading: false,
        productsError: null,
        productError: null,
      });
    });
  });

  describe("fetchProducts async thunk", () => {
    it("should handle pending state", () => {
      store.dispatch(fetchProducts());
      const state = store.getState().products;
      expect(state.productsLoading).toBe(true);
      expect(state.productsError).toBe(null);
    });

    it("should handle fulfilled state with products", async () => {
      await store.dispatch(fetchProducts());
      const state = store.getState().products;
      expect(state.productsLoading).toBe(false);
      expect(state.products).toEqual(mockProducts);
      expect(state.productsError).toBe(null);
    });

    it("should handle rejected state with error message", async () => {
      server.use(
        http.get(`${API_BASE_URL}/products`, () => {
          return HttpResponse.error();
        })
      );

      await store.dispatch(fetchProducts());
      const state = store.getState().products;

      expect(state.productsLoading).toBe(false);
      expect(state.productsError).toBeDefined();
      expect(state.products).toEqual([]);
    });

    it("should handle network error with default message", async () => {
      server.use(
        http.get(`${API_BASE_URL}/products`, () => {
          return HttpResponse.error();
        })
      );

      await store.dispatch(fetchProducts());
      const state = store.getState().products;

      expect(state.productsLoading).toBe(false);
      expect(state.productsError).toBeDefined();
      expect(state.products).toEqual([]);
    });

    it("should update products when fetch succeeds", async () => {
      await store.dispatch(fetchProducts());
      const state = store.getState().products;
      expect(state.products).toHaveLength(mockProducts.length);
      expect(state.products[0]).toHaveProperty("id");
      expect(state.products[0]).toHaveProperty("title");
      expect(state.products[0]).toHaveProperty("price");
    });
  });

  describe("fetchProductById async thunk", () => {
    it("should handle pending state", () => {
      store.dispatch(fetchProductById(1));
      const state = store.getState().products;
      expect(state.productLoading).toBe(true);
      expect(state.productError).toBe(null);
    });

    it("should handle fulfilled state with product", async () => {
      await store.dispatch(fetchProductById(1));
      const state = store.getState().products;
      expect(state.productLoading).toBe(false);
      expect(state.product).toEqual(mockProduct);
      expect(state.productError).toBe(null);
    });

    it("should fetch different products by id", async () => {
      await store.dispatch(fetchProductById(1));
      let state = store.getState().products;
      expect(state.product.id).toBe(1);

      await store.dispatch(fetchProductById(2));
      state = store.getState().products;
      expect(state.product.id).toBe(2);
    });

    it("should handle rejected state with error message", async () => {
      server.use(
        http.get(`${API_BASE_URL}/products/999`, () => {
          return HttpResponse.error();
        })
      );

      await store.dispatch(fetchProductById(999));
      const state = store.getState().products;

      expect(state.productLoading).toBe(false);
      expect(state.productError).toBeDefined();
      expect(state.product).toBe(null);
    });

    it("should handle network error with default message", async () => {
      server.use(
        http.get(`${API_BASE_URL}/products/1`, () => {
          return HttpResponse.error();
        })
      );

      await store.dispatch(fetchProductById(1));
      const state = store.getState().products;

      expect(state.productLoading).toBe(false);
      expect(state.productError).toBeDefined();
      expect(state.product).toBe(null);
    });

    it("should not affect products array when fetching by id", async () => {
      await store.dispatch(fetchProducts());
      const productsBefore = store.getState().products.products;

      await store.dispatch(fetchProductById(1));
      const state = store.getState().products;

      expect(state.products).toEqual(productsBefore);
      expect(state.product).not.toBe(null);
    });
  });

  describe("independent loading states", () => {
    it("should handle fetchProducts and fetchProductById independently", async () => {
      store.dispatch(fetchProducts());
      store.dispatch(fetchProductById(1));

      let state = store.getState().products;
      expect(state.productsLoading).toBe(true);
      expect(state.productLoading).toBe(true);

      await Promise.all([
        store.dispatch(fetchProducts()),
        store.dispatch(fetchProductById(1)),
      ]);

      state = store.getState().products;
      expect(state.productsLoading).toBe(false);
      expect(state.productLoading).toBe(false);
      expect(state.products).toHaveLength(mockProducts.length);
      expect(state.product).not.toBe(null);
    });
  });
});
