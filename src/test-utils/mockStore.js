import { configureStore } from '@reduxjs/toolkit';
import productSlice from '../redux/slices/productSlice';
import favoritesReducer from '../redux/slices/favoritesSlice';
import filtersReducer from '../redux/slices/filtersSlice';
import { mockStoreState } from './mockData';

/**
 * Creates a mock Redux store for testing
 * @param {Object} preloadedState - Optional initial state to override defaults
 * @returns {Object} Configured Redux store
 */
export const createMockStore = (preloadedState = {}) => {
  const initialState = {
    products: {
      ...mockStoreState.products,
      ...preloadedState.products,
    },
    filters: {
      ...mockStoreState.filters,
      ...preloadedState.filters,
    },
    favorites: {
      ...mockStoreState.favorites,
      ...preloadedState.favorites,
    },
  };

  return configureStore({
    reducer: {
      products: productSlice,
      favorites: favoritesReducer,
      filters: filtersReducer,
    },
    preloadedState: initialState,
  });
};

/**
 * Helper to get a store with products loaded
 */
export const createStoreWithProducts = (products = mockStoreState.products.products) => {
  return createMockStore({
    products: {
      ...mockStoreState.products,
      products,
      productsLoading: false,
    },
  });
};

/**
 * Helper to get a store with filters applied
 */
export const createStoreWithFilters = (filters = {}) => {
  return createMockStore({
    filters: {
      ...mockStoreState.filters,
      ...filters,
    },
  });
};

/**
 * Helper to get a store with favorites
 */
export const createStoreWithFavorites = (favorites = []) => {
  return createMockStore({
    favorites: {
      items: favorites,
    },
  });
};

