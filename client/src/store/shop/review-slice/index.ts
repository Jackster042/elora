import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

interface AuthError {
  message: string;
  code: string;
  response: any;
}

interface ReviewState {
  isLoading: boolean;
  reviews: any[];
  error: string | null;
}

const initialState: ReviewState = {
  isLoading: false,
  error: null,
  reviews: [],
};

// API URL
const API_URL = import.meta.env.VITE_API_URL;

export const addReview = createAsyncThunk(
  "/order/addReview",
  async (formData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/shop/review/add`,
        formData
      );
      return response.data;
    } catch (error) {
      console.error(error, "error from ADD REVIEW CLIENT SIDE");
      return rejectWithValue({
        message: (error as AxiosError).message,
        code: (error as AxiosError).code,
        response: (error as AxiosError).response?.data,
      });
    }
  }
);

export const getReviews = createAsyncThunk(
  "/order/getReviews",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/shop/review/${productId}`
      );
      return response.data;
    } catch (error) {
      console.error(error, "error from GET REVIEW CLIENT SIDE");
      return rejectWithValue({
        message: (error as AxiosError).message,
        code: (error as AxiosError).code,
        response: (error as AxiosError).response?.data,
      });
    }
  }
);

const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getReviews.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getReviews.fulfilled, (state, action) => {
      state.isLoading = false;
      state.reviews = action.payload.data;
    });
    builder.addCase(getReviews.rejected, (state, action) => {
      state.isLoading = false;
      state.reviews = [];
      state.error =
        (action.payload as AuthError)?.message || "An error occurred";
    });
  },
});

export const {} = reviewSlice.actions;
export default reviewSlice.reducer;
