import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCurrentWeather,
  fetchForecast,
} from "../../../redux/slices/weatherslice";
import { selectTemperatureUnit } from "../../../redux/slices/settingsslice";
import {
  addFavorite,
  removeFavorite,
  selectIsFavorite,
} from "../../../redux/slices/favoritesslice";
import Header from "../layout/header";
import HourlyForecast from "./hourlyforecast";
import DailyForecast from "./dailyforecast";
import TemperatureChart from "../charts/temperature";
import PrecipitationChart from "../charts/precipitationchart";
import WindChart from "../charts/\windchart";
import HumidityPressureChart from "../charts/humiditypressurechart";
import "./detailedview.css";

function DetailedView() {
  const { cityName } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const weatherData = useSelector(
    (state) => state.weather.currentWeather[cityName]
  );
  const forecastData = useSelector(
    (state) => state.weather.forecasts[cityName]
  );
  const temperatureUnit = useSelector(selectTemperatureUnit);
  const isFavorite = useSelector(selectIsFavorite(cityName));

  useEffect(() => {
    if (!weatherData?.data) {
      dispatch(fetchCurrentWeather(cityName));
    }
    if (!forecastData?.data) {
      dispatch(fetchForecast({ city: cityName, days: 7 })); 
    }
  }, [cityName, dispatch, weatherData?.data, forecastData?.data]);

  if (weatherData?.loading || forecastData?.loading) {
    return <div className="loading">Loading detailed weather data...</div>;
  }

  if (weatherData?.error) {
    return (
      <div className="error-view">
        <h2>Error loading weather data</h2>
        <p>{weatherData.error}</p>
        <button onClick={() => navigate("/")}>Back to Dashboard</button>
      </div>
    );
  }

  if (!weatherData?.data || !forecastData?.data) {
    return <div className="loading">Loading...</div>;
  }

  const { location, current } = weatherData.data;
  const { forecast } = forecastData.data;

  const convertTemp = (tempC) => {
    if (temperatureUnit === "fahrenheit") {
      return Math.round((tempC * 9) / 5 + 32);
    }
    return Math.round(tempC);
  };

  const unitSymbol = temperatureUnit === "celsius" ? "°C" : "°F";

  const handleToggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite(cityName));
    } else {
      dispatch(addFavorite({ name: location.name, country: location.country }));
    }
  };

  const allHours = forecast.forecastday.flatMap((day) => day.hour);
  const currentHour = new Date().getHours();
  const next24Hours = allHours.slice(currentHour, currentHour + 24);

  return (
    <>
      <Header />
      <div className="detailed-view">
        <div className="detailed-header">
          <button className="back-btn" onClick={() => navigate("/")}>
            ← Back
          </button>
          <button
            className={`favorite-btn-detailed ${isFavorite ? "favorited" : ""}`}
            onClick={handleToggleFavorite}
          >
            {isFavorite ? "★ Favorited" : "☆ Add to Favorites"}
          </button>
        </div>

        <div className="current-weather-detailed">
          <div className="location-info">
            <h1>
              {location.name}, {location.country}
            </h1>
            <p>{location.region}</p>
            <p className="local-time">
              Local Time:{" "}
              {new Date(location.localtime).toLocaleString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
            </p>
          </div>

          <div className="current-main">
            <img
              src={current.condition.icon}
              alt={current.condition.text}
              className="main-icon"
            />
            <div className="main-temp">
              {convertTemp(current.temp_c)}
              {unitSymbol}
            </div>
            <p className="main-condition">{current.condition.text}</p>
            <p className="feels-like">
              Feels like {convertTemp(current.feelslike_c)}
              {unitSymbol}
            </p>
          </div>

          <div className="detailed-metrics">
            <div className="metric-card">
              <div className="metric-icon">💧</div>
              <div className="metric-content">
                <p className="metric-label">Humidity</p>
                <p className="metric-value">{current.humidity}%</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">💨</div>
              <div className="metric-content">
                <p className="metric-label">Wind Speed</p>
                <p className="metric-value">{current.wind_kph} km/h</p>
                <p className="metric-sub">{current.wind_dir}</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">🌡️</div>
              <div className="metric-content">
                <p className="metric-label">Pressure</p>
                <p className="metric-value">{current.pressure_mb} mb</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">☀️</div>
              <div className="metric-content">
                <p className="metric-label">UV Index</p>
                <p className="metric-value">{current.uv}</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">👁️</div>
              <div className="metric-content">
                <p className="metric-label">Visibility</p>
                <p className="metric-value">{current.vis_km} km</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">☁️</div>
              <div className="metric-content">
                <p className="metric-label">Cloud Cover</p>
                <p className="metric-value">{current.cloud}%</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">🌡️</div>
              <div className="metric-content">
                <p className="metric-label">Dew Point</p>
                <p className="metric-value">
                  {convertTemp(current.dewpoint_c)}
                  {unitSymbol}
                </p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">🌙</div>
              <div className="metric-content">
                <p className="metric-label">Precipitation</p>
                <p className="metric-value">{current.precip_mm} mm</p>
              </div>
            </div>
          </div>
        </div>

        <TemperatureChart hourlyData={next24Hours} type="hourly" />
        <TemperatureChart dailyData={forecast.forecastday} type="daily" />

        <PrecipitationChart dailyData={forecast.forecastday} />
        <WindChart hourlyData={next24Hours} type="hourly" />
        <WindChart dailyData={forecast.forecastday} type="daily" />
        <HumidityPressureChart hourlyData={next24Hours} />

        <HourlyForecast hourlyData={next24Hours} />
        <DailyForecast dailyData={forecast.forecastday} />
      </div>
    </>
  );
}

export default DetailedView;