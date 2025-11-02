import { createSlice } from "@reduxjs/toolkit";

function loadFavoritesFromStorage() {
  try {
    const saved = localStorage.getItem("favoriteCities");
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("error in favorites:", error);
    return [];
  }
}
function saveFavoritesToStorage(favorites) {
  try {
    localStorage.setItem("favoriteCities", JSON.stringify(favorites));
  } catch (error) {
    console.error("error in favorite :", error);
  }
}

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    cities: loadFavoritesFromStorage(),
  },
  reducers: {
    addFavorite: (state, action) => {
      const city = action.payload;
      const exists = state.cities.some(
        (fav) => fav.name.toLowerCase() === city.name.toLowerCase()
      );
      if (!exists) {
        state.cities.push(city);
        saveFavoritesToStorage(state.cities);
      }
    },
    removeFavorite: (state, action) => {
      const cityName = action.payload;
      state.cities = state.cities.filter(
        (city) => city.name.toLowerCase() !== cityName.toLowerCase()
      );
      saveFavoritesToStorage(state.cities);
    },
    clearFavorites: (state) => {
      state.cities = [];
      saveFavoritesToStorage([]);
    },
    isFavorite: (state, action) => {
      const cityName = action.payload;
      return state.cities.some(
        (city) => city.name.toLowerCase() === cityName.toLowerCase()
      );
    },
  },
});

export const { addFavorite, removeFavorite, clearFavorites } =
  favoritesSlice.actions;

export const selectFavorites = (state) => state.favorites.cities;
export const selectIsFavorite = (cityName) => (state) => {
  return state.favorites.cities.some(
    (city) => city.name.toLowerCase() === cityName.toLowerCase()
  );
};

export default favoritesSlice.reducer;
