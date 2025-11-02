import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { searchCities } from "../../services/weatherapi";

export const searchForCities = createAsyncThunk(
  "search/searchCities",
  async (query, { rejectWithValue }) => {
    try {
      const data = await searchCities(query);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.message || error.message
      );
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    query: "",
    results: [],
    loading: false,
    error: null,
    searchHistory: [],
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.query = action.payload;
    },
    clearSearchResults: (state) => {
      state.results = [];
      state.query = "";
      state.error = null;
    },
    addToSearchHistory: (state, action) => {
      const city = action.payload;
      state.searchHistory = state.searchHistory.filter(
        (item) => item.name !== city.name
      );
      state.searchHistory.unshift(city);
      if (state.searchHistory.length > 10) {
        state.searchHistory = state.searchHistory.slice(0, 10);
      }
    },
    clearSearchHistory: (state) => {
      state.searchHistory = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchForCities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchForCities.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
        state.error = null;
      })
      .addCase(searchForCities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.results = [];
      });
  },
});

export const {
  setSearchQuery,
  clearSearchResults,
  addToSearchHistory,
  clearSearchHistory,
} = searchSlice.actions;
export const selectSearchResults = (state) => state.search.results;
export const selectSearchQuery = (state) => state.search.query;
export const selectSearchLoading = (state) => state.search.loading;
export const selectSearchHistory = (state) => state.search.searchHistory;
export default searchSlice.reducer;
