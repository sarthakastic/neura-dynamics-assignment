import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../../utils/constants";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      console.log("indie api");
      const response = await fetch(`${API_BASE_URL}/products`);
      const data = await response.json();
      console.log("indie data", response, "GGGHHJJJJBbjkkkkkkkkkk", data);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.message || "Error fetching products. Try again later."
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.message || "Error fetching product. Try again later."
      );
    }
  }
);

const initialState = {
  products: [],
  product: null,
  productsLoading: false,
  productLoading: false,
  productsError: null,
  productError: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (state) => {
      state.productsLoading = true;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.productsLoading = false;
      state.products = action.payload;
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.productsLoading = false;
      state.productsError = action.payload;
    });
    builder.addCase(fetchProductById.pending, (state) => {
      state.productLoading = true;
    });
    builder.addCase(fetchProductById.fulfilled, (state, action) => {
      state.productLoading = false;
      state.product = action.payload;
    });
    builder.addCase(fetchProductById.rejected, (state, action) => {
      state.productLoading = false;
      state.productError = action.payload;
    });
  },
});

export const {} = productSlice.actions;
export default productSlice.reducer;
