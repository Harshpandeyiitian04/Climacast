import { useDispatch, useSelector } from "react-redux";
import {
  toggleTemperatureUnit,
  selectTemperatureUnit,
  setTheme,
  selectTheme,
} from "../../../redux/slices/settingsslice";
import "./settingspanel.css";

function SettingsPanel({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const temperatureUnit = useSelector(selectTemperatureUnit);
  const theme = useSelector(selectTheme);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target.className === "settings-overlay") {
      onClose();
    }
  };

  return (
    <div className="settings-overlay" onClick={handleOverlayClick}>
      <div className="settings-panel" role="dialog" aria-labelledby="settings-title" aria-modal="true">
        <div className="settings-header">
          <h2 id="settings-title">⚙️ Settings</h2>
          <button
            className="close-btn"
            onClick={onClose}
            type="button"
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>

        <div className="settings-content">
          <fieldset className="setting-section">
            <legend className="setting-header">
              <h3>🌡️ Temperature Unit</h3>
              <p className="setting-description">
                Choose your preferred temperature scale
              </p>
            </legend>
            <div className="setting-control">
              <div className="toggle-group" role="radiogroup" aria-label="Temperature unit">
                <button
                  type="button"
                  className={`toggle-option ${
                    temperatureUnit === "celsius" ? "active" : ""
                  }`}
                  onClick={() =>
                    temperatureUnit !== "celsius" &&
                    dispatch(toggleTemperatureUnit())
                  }
                  role="radio"
                  aria-checked={temperatureUnit === "celsius"}
                  aria-label="Celsius"
                >
                  <span className="toggle-icon" aria-hidden="true">🌡️</span>
                  <div>
                    <div className="toggle-label">Celsius</div>
                    <div className="toggle-sublabel">°C</div>
                  </div>
                </button>
                <button
                  type="button"
                  className={`toggle-option ${
                    temperatureUnit === "fahrenheit" ? "active" : ""
                  }`}
                  onClick={() =>
                    temperatureUnit !== "fahrenheit" &&
                    dispatch(toggleTemperatureUnit())
                  }
                  role="radio"
                  aria-checked={temperatureUnit === "fahrenheit"}
                  aria-label="Fahrenheit"
                >
                  <span className="toggle-icon" aria-hidden="true">🌡️</span>
                  <div>
                    <div className="toggle-label">Fahrenheit</div>
                    <div className="toggle-sublabel">°F</div>
                  </div>
                </button>
              </div>
            </div>
          </fieldset>

          <fieldset className="setting-section">
            <legend className="setting-header">
              <h3>🎨 Theme</h3>
              <p className="setting-description">
                Customize your visual experience
              </p>
            </legend>
            <div className="setting-control">
              <div className="toggle-group" role="radiogroup" aria-label="Theme">
                <button
                  type="button"
                  className={`toggle-option ${
                    theme === "light" ? "active" : ""
                  }`}
                  onClick={() => dispatch(setTheme("light"))}
                  role="radio"
                  aria-checked={theme === "light"}
                  aria-label="Light theme"
                >
                  <span className="toggle-icon" aria-hidden="true">☀️</span>
                  <div>
                    <div className="toggle-label">Light</div>
                    <div className="toggle-sublabel">Default theme</div>
                  </div>
                </button>
                <button
                  type="button"
                  className={`toggle-option ${
                    theme === "dark" ? "active" : ""
                  }`}
                  onClick={() => dispatch(setTheme("dark"))}
                  role="radio"
                  aria-checked={theme === "dark"}
                  aria-label="Dark theme"
                  disabled
                >
                  <span className="toggle-icon" aria-hidden="true">🌙</span>
                  <div>
                    <div className="toggle-label">Dark</div>
                    <div className="toggle-sublabel">Coming soon</div>
                  </div>
                </button>
              </div>
            </div>
          </fieldset>

          <div className="setting-section">
            <div className="setting-header">
              <h3>🔄 Auto Refresh</h3>
              <p className="setting-description">
                Weather data refreshes automatically every 60 seconds
              </p>
            </div>
            <div className="setting-info">
              <div className="info-badge" role="status">
                <span className="badge-icon" aria-hidden="true">✓</span>
                <span>Enabled</span>
              </div>
            </div>
          </div>

          <div className="setting-section">
            <div className="setting-header">
              <h3>💾 Data Caching</h3>
              <p className="setting-description">
                Reduces API calls by caching data for 60 seconds
              </p>
            </div>
            <div className="setting-info">
              <div className="info-badge" role="status">
                <span className="badge-icon" aria-hidden="true">✓</span>
                <span>Active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <button className="save-btn" onClick={onClose} type="button">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPanel;
