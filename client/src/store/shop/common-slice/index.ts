import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

interface AuthError {
  message: string;
  code: string;
  response: any;
}

interface FeatureImages {
  isLoading: boolean;
  error: string | null;
  featureImageList: any[];
}

const initialState: FeatureImages = {
  featureImageList: [],
  isLoading: false,
  error: null,
};

// API URL
const API_URL = import.meta.env.VITE_API_URL;

export const addFeatureImage = createAsyncThunk(
  "/common/addFeatureImage",
  async (image: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/common/feature/add`, {
        image,
      });
      return response.data;
    } catch (error) {
      console.error(error, "error from ADD FEATURED IMAGE");
      return rejectWithValue({
        message: (error as AxiosError).message || "An error occurred",
        code: (error as AxiosError).code || "500",
        response: (error as AxiosError).response?.data,
      });
    }
  }
);

export const getFeatureImage = createAsyncThunk(
  "/common/getFeatureImage",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/common/feature/get`);
      return response.data;
    } catch (error) {
      console.error(error, "error from GET FEATURED IMAGE");
      return rejectWithValue({
        message: (error as AxiosError).message || "An error occurred",
        code: (error as AxiosError).code || "500",
        response: (error as AxiosError).response?.data,
      });
    }
  }
);

const commonSlice = createSlice({
  name: "commonSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFeatureImage.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getFeatureImage.fulfilled, (state, action) => {
      state.isLoading = false;
      state.featureImageList = action.payload.data;
    });
    builder.addCase(getFeatureImage.rejected, (state, action) => {
      state.featureImageList = [];
      state.isLoading = false;
      state.error =
        (action.payload as AuthError)?.message || "An error occurred";
    });
  },
});

export const {} = commonSlice.actions;
export default commonSlice.reducer;
