import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

interface AuthError {
  message: string;
  code: string;
  response: any;
}

interface OrderState {
  approvalURL: string | null;
  orderId: any[] | null;
  orderList: any[] | null;
  orderDetails: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  approvalURL: null,
  orderId: null,
  orderList: [],
  orderDetails: null,
  loading: false,
  error: null,
};

// API URL
const API_URL = import.meta.env.VITE_API_URL;

// CREATE NEW ORDER
export const createNewOrder = createAsyncThunk(
  "order/createNewOrder",
  async (orderData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/shop/order/create`,
        orderData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: (error as AxiosError).message,
        code: (error as AxiosError).code,
        response: (error as AxiosError).response?.data,
      });
    }
  }
);

// CAPTURE PAYMENT
export const capturePayment = createAsyncThunk(
  "order/capturePayment",
  async (
    {
      orderId,
      paymentId,
      payerId,
    }: { orderId: string; paymentId: string; payerId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${API_URL}/api/shop/order/capture`, {
        orderId,
        paymentId,
        payerId,
      });
      return response.data;
    } catch (error) {
      console.error(error, "error from CAPTURE PAYMENT - FRONTEND");
      return rejectWithValue({
        message: (error as AxiosError).message,
        code: (error as AxiosError).code,
        response: (error as AxiosError).response?.data,
      });
    }
  }
);

export const getAllOrdersByUser = createAsyncThunk(
  "order/getAllOrdersByUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/shop/order/list/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error(error, "error from GET ALL ORDERS BY USER - FRONTEND");
      return rejectWithValue({
        message: (error as AxiosError).message,
        code: (error as AxiosError).code,
        response: (error as AxiosError).response?.data,
      });
    }
  }
);

export const getOrderDetails = createAsyncThunk(
  "order/getOrderDetails",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/shop/order/details/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(error, "error from GET ORDER DETAILS - FRONTEND");
      return rejectWithValue({
        message: (error as AxiosError).message,
        code: (error as AxiosError).code,
        response: (error as AxiosError).response?.data,
      });
    }
  }
);

const orderSlice = createSlice({
  name: "shoppingOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    // CREATE NEW ORDER
    builder.addCase(createNewOrder.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createNewOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.approvalURL = action.payload.approvalURL;
      state.orderId = action.payload.orderId;
      sessionStorage.setItem(
        "currentOrderId",
        JSON.stringify(action.payload.orderId)
      );
    });
    builder.addCase(createNewOrder.rejected, (state, action) => {
      state.loading = false;
      state.approvalURL = null;
      state.orderId = null;
      state.error =
        (action.payload as AuthError)?.message || "An error occurred";
    });
    // GET ALL ORDERS BY USER
    builder.addCase(getAllOrdersByUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllOrdersByUser.fulfilled, (state, action) => {
      state.loading = false;
      state.orderList = action.payload.data;
    });
    builder.addCase(getAllOrdersByUser.rejected, (state, action) => {
      state.loading = false;
      state.orderList = [];
      state.error =
        (action.payload as AuthError)?.message || "An error occurred";
    });
    // GET ORDER DETAILS
    builder.addCase(getOrderDetails.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getOrderDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.orderDetails = action.payload.data;
    });
    builder.addCase(getOrderDetails.rejected, (state, action) => {
      state.loading = false;
      state.orderDetails = null;
      state.error =
        (action.payload as AuthError)?.message || "An error occurred";
    });
  },
});

export const { resetOrderDetails } = orderSlice.actions;
export default orderSlice.reducer;
