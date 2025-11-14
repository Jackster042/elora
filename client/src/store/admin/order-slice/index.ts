import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

interface AuthError {
  message: string;
  code: string;
  response: any;
}

interface OrderState {
  isLoading: boolean;
  orderList: any[] | null;
  orderDetails: any | null;
  error: string | null;
}

const initialState: OrderState = {
  isLoading: false,
  orderList: [],
  orderDetails: null,
  error: null,
};
// API URL
const API_URL = import.meta.env.VITE_API_URL;

// GET ALL ORDERS
export const getAllOrdersForAdmin = createAsyncThunk(
  "admin/getAllOrdersForAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/orders/get`);
      return response.data;
    } catch (error) {
      console.error(error, "error from getAllOrdersForAdmin");
      return rejectWithValue({
        message: (error as AxiosError).message,
        code: (error as AxiosError).code,
        response: (error as AxiosError).response?.data,
      });
    }
  }
);
// GET ORDER DETAILS
export const getOrderDetailsForAdmin = createAsyncThunk(
  "admin/getOrderDetailsForAdmin",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/admin/orders/details/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(error, "error from getOrderDetailsForAdmin");
      return rejectWithValue({
        message: (error as AxiosError).message,
        code: (error as AxiosError).code,
        response: (error as AxiosError).response?.data,
      });
    }
  }
);
// UPDATE ORDER STATUS
export const updateOrderStatus = createAsyncThunk(
  "/admin/updateOrderStatus",
  async (
    { id, orderStatus }: { id: string; orderStatus: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/admin/orders/update/${id}`,
        { orderStatus }
      );
      return response.data;
    } catch (error) {
      console.error(error, "error from updateOrderStatus");
      return rejectWithValue({
        message: (error as AxiosError).message,
        code: (error as AxiosError).code,
        response: (error as AxiosError).response?.data,
      });
    }
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrdersForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersForAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.orderList = [];
        state.error =
          (action.payload as AuthError)?.message || "An error occurred";
      })
      .addCase(getOrderDetailsForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetailsForAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.orderDetails = null;
        state.error =
          (action.payload as AuthError)?.message || "An error occurred";
      });
  },
});

export const { resetOrderDetails } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;
