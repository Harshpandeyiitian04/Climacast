import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addFavorite,
  removeFavorite,
  selectIsFavorite,
} from "../../../redux/slices/favoritesslice";
import { selectTemperatureUnit } from "../../../redux/slices/settingsslice";
import { setSelectedCity } from "../../../redux/slices/weatherslice";
import "./dashboard.css";

function CityCard({ cityName, weatherData, forecastData }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isFavorite = useSelector(selectIsFavorite(cityName));
  const temperatureUnit = useSelector(selectTemperatureUnit);

  if (!weatherData?.data) {
    return null;
  }

  const { location, current } = weatherData.data;

  const convertTemp = (tempC) => {
    if (temperatureUnit === "fahrenheit") {
      return Math.round((tempC * 9) / 5 + 32);
    }
    return Math.round(tempC);
  };

  const unitSymbol = temperatureUnit === "celsius" ? "°C" : "°F";

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    if (isFavorite) {
      dispatch(removeFavorite(cityName));
    } else {
      dispatch(
        addFavorite({
          name: location.name,
          country: location.country,
        })
      );
    }
  };

  const handleCardClick = () => {
    dispatch(setSelectedCity(cityName));
    navigate(`/city/${cityName}`);
  };

  const getLastUpdated = () => {
    if (weatherData.lastUpdated) {
      const seconds = Math.floor((Date.now() - weatherData.lastUpdated) / 1000);
      if (seconds < 60) return `Updated ${seconds}s ago`;
      return `Updated ${Math.floor(seconds / 60)}m ago`;
    }
    return "";
  };

  return (
    <div className="city-card" onClick={handleCardClick}>
      <button
        className={`favorite-btn ${isFavorite ? "favorited" : ""}`}
        onClick={handleToggleFavorite}
      >
        {isFavorite ? "★" : "☆"}
      </button>

      <div className="city-header">
        <h2>{location.name}</h2>
        <p className="country">{location.country}</p>
      </div>

      <div className="weather-main">
        <img
          src={current.condition.icon}
          alt={current.condition.text}
          className="weather-icon"
        />
        <div className="temperature">
          {convertTemp(current.temp_c)}
          {unitSymbol}
        </div>
      </div>

      <p className="condition">{current.condition.text}</p>

      <div className="weather-details">
        <div className="detail-item">
          <span className="detail-label">💧 Humidity</span>
          <span className="detail-value">{current.humidity}%</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">💨 Wind</span>
          <span className="detail-value">{current.wind_kph} km/h</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">🌡️ Feels like</span>
          <span className="detail-value">
            {convertTemp(current.feelslike_c)}
            {unitSymbol}
          </span>
        </div>
      </div>

      {forecastData?.data && (
        <div className="mini-forecast">
          {forecastData.data.forecast.forecastday.slice(1, 4).map((day) => (
            <div key={day.date} className="mini-forecast-item">
              <span className="mini-day">
                {new Date(day.date).toLocaleDateString("en-US", {
                  weekday: "short",
                })}
              </span>
              <img src={day.day.condition.icon} alt="" className="mini-icon" />
              <span className="mini-temp">
                {convertTemp(day.day.maxtemp_c)}°
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="last-updated">{getLastUpdated()}</div>
    </div>
  );
}

export default CityCard;
