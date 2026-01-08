import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

interface AuthError {
  message: string;
  code: string;
  response: any;
}

interface AddressState {
  isLoading: boolean;
  error: string | null;
  addressList: any[];
}

const initialState: AddressState = {
  isLoading: false,
  error: null,
  addressList: [],
};

// API URL
const API_URL = import.meta.env.VITE_API_URL;

// ADD ADDRESS
export const addAddress = createAsyncThunk(
  "address/addAddress",
  async (formData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/shop/address/add`,
        formData
      );
      return response.data;
    } catch (error) {
      console.error(error, "error from addAddress in address-slice FRONTEND");
      return rejectWithValue({
        message: (error as AxiosError).message,
        code: (error as AxiosError).code,
        response: (error as AxiosError).response?.data,
      });
    }
  }
);

// FETCH ALL ADDRESS
export const fetchAllData = createAsyncThunk(
  "address/fetchAllData",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/shop/address/get/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error(error, "error from fetchAllData in address-slice FRONTEND");
      return rejectWithValue({
        message: (error as AxiosError).message,
        code: (error as AxiosError).code,
        response: (error as AxiosError).response?.data,
      });
    }
  }
);

// EDIT ADDRESS
export const editAddress = createAsyncThunk(
  "address/editAddress",
  async (
    {
      userId,
      addressId,
      formData,
    }: { userId: string; addressId: string; formData: any },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/shop/address/update/${userId}/${addressId}`,
        formData
      );
      return response.data;
    } catch (error) {
      console.error(error, "error from editAddress in address-slice FRONTEND");
      return rejectWithValue({
        message: (error as AxiosError).message,
        code: (error as AxiosError).code,
        response: (error as AxiosError).response?.data,
      });
    }
  }
);

// DELETE ADDRESS
export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async (
    { userId, addressId }: { userId: string; addressId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.delete(
        `${API_URL}/api/shop/address/delete/${userId}/${addressId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        error,
        "error from deleteAddress in address-slice FRONTEND"
      );
      return rejectWithValue({
        message: (error as AxiosError).message,
        code: (error as AxiosError).code,
        response: (error as AxiosError).response?.data,
      });
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // ADD ADDRESS
    builder.addCase(addAddress.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addAddress.fulfilled, (state) => {
      state.isLoading = false;
      // state.addressList = action.payload.data;
    });
    builder.addCase(addAddress.rejected, (state, action) => {
      state.isLoading = false;
      // state.addressList = [];
      state.error =
        (action.payload as AuthError)?.message || "An error occurred";
    });

    // FETCH ALL ADDRESS
    builder.addCase(fetchAllData.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchAllData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.addressList = action.payload.data;
    });
    builder.addCase(fetchAllData.rejected, (state, action) => {
      state.isLoading = false;
      state.addressList = [];
      state.error =
        (action.payload as AuthError)?.message || "An error occurred";
    });

    // EDIT ADDRESS
    builder.addCase(editAddress.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(editAddress.fulfilled, (state, action) => {
      state.isLoading = false;
      state.addressList = action.payload.data;
    });
    builder.addCase(editAddress.rejected, (state, action) => {
      state.isLoading = false;
      state.addressList = [];
      state.error =
        (action.payload as AuthError)?.message || "An error occurred";
    });

    // DELETE ADDRESS
    builder.addCase(deleteAddress.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteAddress.fulfilled, (state, action) => {
      state.isLoading = false;
      state.addressList = action.payload.data;
    });
    builder.addCase(deleteAddress.rejected, (state, action) => {
      state.isLoading = false;
      state.addressList = [];
      state.error =
        (action.payload as AuthError)?.message || "An error occurred";
    });
  },
});

export const {} = addressSlice.actions;
export default addressSlice.reducer;
