import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

interface SearchState {
  searchResults: any[];
  isLoading: boolean;
  error: string | null;
}

interface AuthError {
  message: string;
  code: string;
  response: any;
}

const initialState: SearchState = {
  searchResults: [],
  isLoading: false,
  error: null,
};

// API URL
const API_URL = import.meta.env.VITE_API_URL;

export const getSearchResults = createAsyncThunk(
  "search/getSearchResults",
  async (keyword: string, rejectWithValue: any) => {
    try {
      const response = await axios.get(`${API_URL}/api/shop/search/${keyword}`);
      return response.data;
    } catch (error) {
      console.error(error, "error FROM GET SEARCH RESULTS");
      return rejectWithValue({
        error: (error as AxiosError).message,
        code: (error as AxiosError).code,
        response: (error as AxiosError).response?.data,
      });
    }
  }
);

const searchSlice = createSlice({
  name: "searchSlice",
  initialState,
  reducers: {
    resetSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSearchResults.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getSearchResults.fulfilled, (state, action) => {
      state.isLoading = false;
      state.searchResults = action.payload.data;
    });
    builder.addCase(getSearchResults.rejected, (state, action) => {
      state.isLoading = false;
      state.searchResults = [];
      state.error =
        (action.payload as AuthError)?.message || "An error occurred";
    });
  },
});

export const { resetSearchResults } = searchSlice.actions;
export default searchSlice.reducer;
