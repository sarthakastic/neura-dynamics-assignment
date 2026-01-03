import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../../utils/constants";

export const fetchProductByCategory = createAsyncThunk(
  "filters/fetchProductByCategory",
  async (category, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/categories`);
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.message || "Error fetching product by category. Try again later."
      );
    }
  }
);

const initialState = {
  searchQuery: "",
  category: "all",
  sortOrder: "none",
  productByCategory: [],
  categoryLoading: false,
  categoryError: null,
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    resetFilters: (state) => {
      state.searchQuery = "";
      state.category = "all";
      state.sortOrder = "none";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProductByCategory.pending, (state) => {
      state.categoryLoading = true;
    });
    builder.addCase(fetchProductByCategory.fulfilled, (state, action) => {
      state.categoryLoading = false;
      state.productByCategory = action.payload;
    });
    builder.addCase(fetchProductByCategory.rejected, (state, action) => {
      state.categoryLoading = false;
      state.categoryError = action.payload;
    });
  },
});

export const { setSearchQuery, setCategory, setSortOrder, resetFilters } =
  filtersSlice.actions;
export default filtersSlice.reducer;
