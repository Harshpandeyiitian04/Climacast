import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "../redux/store.js";
import "./index.css";
import App from "./App.jsx";

function AppInitializer() {
  useEffect(() => {
    console.log(
      "App initialized with favorites:",
      store.getState().favorites.cities
    );
  }, []);

  return <App />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AppInitializer />
    </Provider>
  </StrictMode>
);
