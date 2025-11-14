import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import axios from "axios";

interface ShopProductsState {
  isLoading: boolean;
  products: any[];
  productDetails: any; // TODO: ??
  error: string | null;
}

interface AuthError {
  message: string;
  code: string;
  response: any;
}

const initialState: ShopProductsState = {
  isLoading: false,
  products: [],
  productDetails: null,
  error: null,
};

// API URL
const API_URL = import.meta.env.VITE_API_URL;

// GET FILTERED PRODUCTS
export const getFilteredProducts = createAsyncThunk(
  "/products/getFilteredProducts",

  async (
    { filterParams, sortParams }: { filterParams: any; sortParams: any },
    { rejectWithValue }
  ) => {
    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams,
    });

    try {
      const response = await axios.get(
        `${API_URL}/api/shop/products/get?${query}`
      );
      return response.data;
    } catch (error) {
      console.error(error, "error from GET FILTERED PRODUCTS");
      return rejectWithValue({
        message: (error as AxiosError).message,
        code: (error as AxiosError).code,
        response: (error as AxiosError).response?.data,
      });
    }
  }
);

export const getProductDetails = createAsyncThunk(
  "/products.getProductDetails",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/shop/products/get/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(error, "error from GET PRODUCT DETAILS");
      return rejectWithValue({
        message: (error as AxiosError).message,
        code: (error as AxiosError).code,
        response: (error as AxiosError).response?.data,
      });
    }
  }
);

const ShopProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getFilteredProducts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getFilteredProducts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.products = action.payload.products;
    });
    builder.addCase(getFilteredProducts.rejected, (state, action) => {
      state.isLoading = false;
      state.products = [];
      state.error =
        (action.payload as AuthError)?.message || "An error occurred";
    });
    builder.addCase(getProductDetails.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getProductDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.productDetails = action.payload.product;
    });
    builder.addCase(getProductDetails.rejected, (state, action) => {
      state.isLoading = false;
      state.productDetails = null;
      state.error =
        (action.payload as AuthError)?.message || "An error occurred";
    });
  },
});

export const { setProductDetails } = ShopProductSlice.actions;
export default ShopProductSlice.reducer;
