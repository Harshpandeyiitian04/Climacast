import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCurrentWeather, getForecast } from "../../services/weatherapi";

export const fetchCurrentWeather = createAsyncThunk(
  "weather/fetchCurrent",
  async (city, { rejectWithValue }) => {
    try {
      const data = await getCurrentWeather(city);
      return { city, data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.message || error.message
      );
    }
  }
);

export const fetchForecast = createAsyncThunk(
  "weather/fetchForecast",
  async ({ city, days = 7 }, { rejectWithValue }) => {
    try {
      const data = await getForecast(city, days);
      return { city, data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.message || error.message
      );
    }
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    currentWeather: {},
    forecasts: {},
    selectedCity: null,
  },
  reducers: {
    setSelectedCity: (state, action) => {
      state.selectedCity = action.payload;
    },
    clearCityWeather: (state, action) => {
      const city = action.payload;
      delete state.currentWeather[city];
      delete state.forecasts[city];
    },
    clearAllWeather: (state) => {
      state.currentWeather = {};
      state.forecasts = {};
      state.selectedCity = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentWeather.pending, (state, action) => {
        const city = action.meta.arg;
        state.currentWeather[city] = {
          ...state.currentWeather[city],
          loading: true,
          error: null,
        };
      })
      .addCase(fetchCurrentWeather.fulfilled, (state, action) => {
        const { city, data } = action.payload;
        state.currentWeather[city] = {
          data,
          loading: false,
          error: null,
          lastUpdated: Date.now(),
        };
      })
      .addCase(fetchCurrentWeather.rejected, (state, action) => {
        const city = action.meta.arg;
        state.currentWeather[city] = {
          ...state.currentWeather[city],
          loading: false,
          error: action.payload,
        };
      });

    builder
      .addCase(fetchForecast.pending, (state, action) => {
        const { city, days = 7 } = action.meta.arg;
        const key = `${city.toLowerCase()}-${days}`;
        state.forecasts[key] = {
          ...state.forecasts[key],
          loading: true,
          error: null,
        };
      })
      .addCase(fetchForecast.fulfilled, (state, action) => {
        const { city, data } = action.payload;
        const days = action.meta.arg.days || 7;
        const key = `${city.toLowerCase()}-${days}`;
        state.forecasts[key] = {
          data,
          loading: false,
          error: null,
          lastUpdated: Date.now(),
        };
      })
      .addCase(fetchForecast.rejected, (state, action) => {
        const { city, days = 7 } = action.meta.arg;
        const key = `${city.toLowerCase()}-${days}`;
        state.forecasts[key] = {
          ...state.forecasts[key],
          loading: false,
          error: action.payload,
        };
      });
  },
});

export const { setSelectedCity, clearCityWeather, clearAllWeather } =
  weatherSlice.actions;
export default weatherSlice.reducer;
