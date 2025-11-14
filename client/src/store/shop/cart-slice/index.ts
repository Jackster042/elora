import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

interface CartState {
  cartItems: any[];
  isLoading: boolean;
  error: string | null;
}

interface AuthError {
  message: string;
  code: string;
  response: any;
}

const initialState: CartState = {
  cartItems: [],
  isLoading: false,
  error: null,
};

// API URL
const API_URL = import.meta.env.VITE_API_URL;

// ADD TO CART
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    {
      userId,
      productId,
      quantity,
    }: { userId: string; productId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${API_URL}/api/shop/cart/add`, {
        userId,
        productId,
        quantity,
      });
      return response.data;
    } catch (error) {
      console.error(error, "error from ADD TO CART - FRONTEND");
      return rejectWithValue({
        message: (error as AxiosError).message,
        code: (error as AxiosError).code,
        response: (error as AxiosError).response?.data,
      });
    }
  }
);

// GET CART
export const getCart = createAsyncThunk(
  "cart/getCart",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/shop/cart/get/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error(error, "error from GET CART - FRONTEND");
      return rejectWithValue({
        message: (error as AxiosError).message,
        code: (error as AxiosError).code,
        response: (error as AxiosError).response?.data,
      });
    }
  }
);

// UPDATE QUANTITY
export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async (
    {
      userId,
      productId,
      quantity,
    }: { userId: string; productId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(`${API_URL}/api/shop/cart/update-cart`, {
        userId,
        productId,
        quantity,
      });
      return response.data;
    } catch (error) {
      console.error(error, "error from UPDATE QUANTITY - FRONTEND");
      return rejectWithValue({
        message: (error as AxiosError).message,
        code: (error as AxiosError).code,
        response: (error as AxiosError).response?.data,
      });
    }
  }
);

// REMOVE FROM CART
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (
    { userId, productId }: { userId: string; productId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.delete(
        `${API_URL}/api/shop/cart/${userId}/${productId}`
      );
      return response.data;
    } catch (error) {
      console.error(error, "error from REMOVE FROM CART - FRONTEND");
      return rejectWithValue({
        message: (error as AxiosError).message,
        code: (error as AxiosError).code,
        response: (error as AxiosError).response?.data,
      });
    }
  }
);

const shopCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // ADD TO CART
    builder.addCase(addToCart.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addToCart.fulfilled, (state, action) => {
      state.isLoading = false;
      state.cartItems = action.payload.data;
    });
    builder.addCase(addToCart.rejected, (state, action) => {
      state.isLoading = false;
      state.cartItems = [];
      state.error =
        (action.payload as AuthError)?.message || "An error occurred";
    });

    // GET CART
    builder.addCase(getCart.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getCart.fulfilled, (state, action) => {
      state.isLoading = false;
      state.cartItems = action.payload.data;
    });
    builder.addCase(getCart.rejected, (state, action) => {
      state.isLoading = false;
      state.cartItems = [];
      state.error =
        (action.payload as AuthError)?.message || "An error occurred";
    });

    // UPDATE QUANTITY
    builder.addCase(updateQuantity.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateQuantity.fulfilled, (state, action) => {
      state.isLoading = false;
      state.cartItems = action.payload.data;
    });
    builder.addCase(updateQuantity.rejected, (state, action) => {
      state.isLoading = false;
      state.cartItems = [];
      state.error =
        (action.payload as AuthError)?.message || "An error occurred";
    });

    // REMOVE FROM CART
    builder.addCase(removeFromCart.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(removeFromCart.fulfilled, (state, action) => {
      state.isLoading = false;
      state.cartItems = action.payload.data;
    });
    builder.addCase(removeFromCart.rejected, (state, action) => {
      state.isLoading = false;
      state.cartItems = [];
      state.error =
        (action.payload as AuthError)?.message || "An error occurred";
    });
  },
});

export const {} = shopCartSlice.actions;
export default shopCartSlice.reducer;
