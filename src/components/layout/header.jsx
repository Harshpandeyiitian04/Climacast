import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleTemperatureUnit,
  selectTemperatureUnit,
} from "../../../redux/slices/settingsslice";
import SettingsPanel from "../settings/settingspanel";
import "./header.css";

function Header() {
  const dispatch = useDispatch();
  const temperatureUnit = useSelector(selectTemperatureUnit);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <header className="header">
        <div className="header-content">
          <h1>🌤️ Climacast</h1>
          <div className="header-actions">
            <button
              onClick={() => dispatch(toggleTemperatureUnit())}
              className="unit-toggle-btn"
              title="Toggle temperature unit"
            >
              °{temperatureUnit === "celsius" ? "C" : "F"} → °
              {temperatureUnit === "celsius" ? "F" : "C"}
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="settings-btn"
              title="Open settings"
            >
              ⚙️ Settings
            </button>
          </div>
        </div>
      </header>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}

export default Header;
