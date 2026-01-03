import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./slices/productSlice";
import favoritesReducer from "./slices/favoritesSlice";
import filtersReducer from "./slices/filtersSlice";

export const store = configureStore({
  reducer: {
    products: productSlice,
    favorites: favoritesReducer,
    filters: filtersReducer,
  },
});
