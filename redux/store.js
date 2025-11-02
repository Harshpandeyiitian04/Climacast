import { configureStore } from "@reduxjs/toolkit";
import weatherReducer from "./slices/weatherslice";
import favoritesReducer from "./slices/favoritesslice";
import settingsReducer from "./slices/settingsslice";
import searchReducer from "./slices/searchslice";

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    favorites: favoritesReducer,
    settings: settingsReducer,
    search: searchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["weather/fetchCurrent/fulfilled"],
      },
    }),
});
export default store;
