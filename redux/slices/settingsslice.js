import { createSlice } from "@reduxjs/toolkit";

function loadSettingsFromStorage() {
  try {
    const saved = localStorage.getItem("userSettings");
    return saved
      ? JSON.parse(saved)
      : { temperatureUnit: "celsius", theme: "light" };
  } catch (error) {
    console.error("Error loading settings:", error);
    return { temperatureUnit: "celsius", theme: "light" };
  }
}

function saveSettingsToStorage(settings) {
  try {
    localStorage.setItem("userSettings", JSON.stringify(settings));
  } catch (error) {
    console.error("Error saving settings:", error);
  }
}

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    temperatureUnit: loadSettingsFromStorage().temperatureUnit || "celsius",
    theme: loadSettingsFromStorage().theme || "light",
  },
  reducers: {
    toggleTemperatureUnit: (state) => {
      state.temperatureUnit =
        state.temperatureUnit === "celsius" ? "fahrenheit" : "celsius";
      saveSettingsToStorage({
        temperatureUnit: state.temperatureUnit,
        theme: state.theme,
      });
    },
    setTemperatureUnit: (state, action) => {
      state.temperatureUnit = action.payload;
      saveSettingsToStorage({
        temperatureUnit: state.temperatureUnit,
        theme: state.theme,
      });
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      saveSettingsToStorage({
        temperatureUnit: state.temperatureUnit,
        theme: state.theme,
      });
    },
  },
});

export const { toggleTemperatureUnit, setTemperatureUnit, setTheme } =
  settingsSlice.actions;
export const selectTemperatureUnit = (state) => state.settings.temperatureUnit;
export const selectTheme = (state) => state.settings.theme;
export default settingsSlice.reducer;
