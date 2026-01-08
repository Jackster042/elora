import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { localCart, LocalCartItem } from "@/utils/localCart";
import type { CartItem } from "@/types";

interface ServerCart {
  _id: string;
  userId: string;
  items: CartItem[];
  createdAt?: string;
  updatedAt?: string;
}

const normalizeCart = (cart: any): ServerCart | null => {
  if (!cart) return null;

  const items: CartItem[] = Array.isArray(cart.items)
    ? cart.items.map((item: any) => ({
        ...item,
        // Ensure these fields exist for UI code paths
        _id: item._id ?? item.productId,
        salePrice: item.salePrice ?? 0,
      }))
    : [];

  return {
    ...cart,
    items,
  } as ServerCart;
};

interface CartState {
  cartItems: ServerCart | null;
  localCartItems: LocalCartItem[];
  isLoading: boolean;
  error: string | null;
}

interface AuthError {
  message: string;
  code: string;
  response: any;
}

const initialState: CartState = {
  cartItems: null,
  localCartItems: [],
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

// MERGE GUEST CART
export const mergeGuestCart = createAsyncThunk(
  "cart/mergeGuestCart",
  async (userId: string, { rejectWithValue }) => {
    try {
      const localItems = localCart.get();

      if (localItems.length === 0) {
        return { merged: false };
      }

      // Add each local item to server cart
      for (const item of localItems) {
        await axios.post(`${API_URL}/api/shop/cart/add`, {
          userId,
          productId: item.productId,
          quantity: item.quantity,
        });
      }

      // Clear local cart after successful merge
      localCart.clear();

      // Fetch updated cart from server
      const response = await axios.get(`${API_URL}/api/shop/cart/get/${userId}`);

      return { merged: true, data: response.data.data };
    } catch (error) {
      console.error(error, "error from MERGE GUEST CART - FRONTEND");
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
  reducers: {
    // Guest cart actions (synchronous, no API calls)
    addToLocalCart: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const result = localCart.add(action.payload.productId, action.payload.quantity);
      if (!result.success) {
        // Store error in state for UI to display
        state.error = result.message || 'Cart limit exceeded';
      }
      state.localCartItems = localCart.get();
    },

    updateLocalCart: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      localCart.update(action.payload.productId, action.payload.quantity);
      state.localCartItems = localCart.get();
    },

    removeFromLocalCart: (state, action: PayloadAction<string>) => {
      localCart.remove(action.payload);
      state.localCartItems = localCart.get();
    },

    loadLocalCart: (state) => {
      state.localCartItems = localCart.get();
    },

    clearLocalCart: (state) => {
      localCart.clear();
      state.localCartItems = [];
    },
  },
  extraReducers: (builder) => {
    // ADD TO CART
    builder.addCase(addToCart.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addToCart.fulfilled, (state, action) => {
      state.isLoading = false;
      state.cartItems = normalizeCart(action.payload.data);
    });
    builder.addCase(addToCart.rejected, (state, action) => {
      state.isLoading = false;
      state.cartItems = null;
      state.error =
        (action.payload as AuthError)?.message || "An error occurred";
    });

    // GET CART
    builder.addCase(getCart.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getCart.fulfilled, (state, action) => {
      state.isLoading = false;
      state.cartItems = normalizeCart(action.payload.data);
    });
    builder.addCase(getCart.rejected, (state, action) => {
      state.isLoading = false;
      state.cartItems = null;
      state.error =
        (action.payload as AuthError)?.message || "An error occurred";
    });

    // UPDATE QUANTITY
    builder.addCase(updateQuantity.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateQuantity.fulfilled, (state, action) => {
      state.isLoading = false;
      state.cartItems = normalizeCart(action.payload.data);
    });
    builder.addCase(updateQuantity.rejected, (state, action) => {
      state.isLoading = false;
      state.cartItems = null;
      state.error =
        (action.payload as AuthError)?.message || "An error occurred";
    });

    // REMOVE FROM CART
    builder.addCase(removeFromCart.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(removeFromCart.fulfilled, (state, action) => {
      state.isLoading = false;
      state.cartItems = normalizeCart(action.payload.data);
    });
    builder.addCase(removeFromCart.rejected, (state, action) => {
      state.isLoading = false;
      state.cartItems = null;
      state.error =
        (action.payload as AuthError)?.message || "An error occurred";
    });

    // MERGE GUEST CART
    builder.addCase(mergeGuestCart.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(mergeGuestCart.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload.merged) {
        state.cartItems = normalizeCart(action.payload.data);
        state.localCartItems = []; // Clear local cart items from state
      }
    });
    builder.addCase(mergeGuestCart.rejected, (state, action) => {
      state.isLoading = false;
      state.error =
        (action.payload as AuthError)?.message || "An error occurred";
    });
  },
});

export const {
  addToLocalCart,
  updateLocalCart,
  removeFromLocalCart,
  loadLocalCart,
  clearLocalCart,
} = shopCartSlice.actions;
export default shopCartSlice.reducer;
