import React, { Suspense, useEffect, useState } from "react";
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
import LoadingSpinner from "../common/loadingspinner";
import ErrorDisplay from "../common/errordisplay";
import "./detailedview.css";

const TemperatureChart = React.lazy(() => import("../charts/temperature"));
const PrecipitationChart = React.lazy(() =>
  import("../charts/precipitationchart")
);
const WindChart = React.lazy(() => import("../charts/windchart"));
const HumidityPressureChart = React.lazy(() =>
  import("../charts/humiditypressurechart")
);

function DetailedView() {
  const { cityName } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [retryCount, setRetryCount] = useState(0);

  const weatherData = useSelector(
    (state) => state.weather.currentWeather[cityName]
  );
  const forecastData = useSelector(
    (state) => state.weather.forecasts[cityName]
  );
  const temperatureUnit = useSelector(selectTemperatureUnit);
  const isFavorite = useSelector(selectIsFavorite(cityName));

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!weatherData?.data) {
          await dispatch(fetchCurrentWeather(cityName)).unwrap();
        }
        if (!forecastData?.data) {
          await dispatch(fetchForecast({ city: cityName, days: 7 })).unwrap();
        }
      } catch (error) {
        console.error("Failed to load weather data:", error);
      }
    };

    loadData();
  }, [cityName, dispatch, retryCount]); // ← Fixed: removed weatherData?.data and forecastData?.data

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

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
      if (weatherData?.data) {
        const { location } = weatherData.data;
        dispatch(
          addFavorite({ name: location.name, country: location.country })
        );
      }
    }
  };

  if (weatherData?.loading || forecastData?.loading) {
    return (
      <>
        <Header />
        <LoadingSpinner
          message={`Loading detailed weather for ${cityName}...`}
          size="large"
        />
      </>
    );
  }

  if (weatherData?.error) {
    return (
      <>
        <Header />
        <div className="detailed-view">
          <div className="detailed-header">
            <button className="back-btn" onClick={() => navigate("/")}>
              ← Back to Dashboard
            </button>
          </div>
          <ErrorDisplay
            error={{
              message: "Failed to load weather data",
              details: weatherData.error,
              retryable: true,
            }}
            onRetry={handleRetry}
            onDismiss={() => navigate("/")}
          />
        </div>
      </>
    );
  }

  if (!weatherData?.data || !forecastData?.data) {
    return (
      <>
        <Header />
        <LoadingSpinner message="Preparing weather data for 24hr..." size="large" />
      </>
    );
  }
  const { location, current } = weatherData.data;
  const { forecast } = forecastData.data;

  // FIX: सिर्फ़ यही 6 लाइनें बदलो
  const todayHours = forecast.forecastday[0].hour;
  const tomorrowHours = forecast.forecastday[1]?.hour || [];
  const currentHour = new Date().getHours();

  const todayRemaining = todayHours.slice(currentHour);
  const neededFromTomorrow = 24 - todayRemaining.length;
  const next24Hours = [
    ...todayRemaining,
    ...tomorrowHours.slice(0, neededFromTomorrow),
  ];

  // पुराना हटाओ:
  // const allHours = forecast.forecastday.flatMap((day) => day.hour);
  // const next24Hours = allHours.slice(currentHour, currentHour + 24);

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

        <Suspense
          fallback={<LoadingSpinner message="Loading chart..." size="small" />}
        >
          <TemperatureChart hourlyData={next24Hours} type="hourly" />
        </Suspense>
        <Suspense
          fallback={<LoadingSpinner message="Loading chart..." size="small" />}
        >
          <TemperatureChart dailyData={forecast.forecastday} type="daily" />
        </Suspense>

        <Suspense
          fallback={<LoadingSpinner message="Loading chart..." size="small" />}
        >
          <PrecipitationChart dailyData={forecast.forecastday} />
        </Suspense>
        <Suspense
          fallback={<LoadingSpinner message="Loading chart..." size="small" />}
        >
          <WindChart hourlyData={next24Hours} type="hourly" />
        </Suspense>
        <Suspense
          fallback={<LoadingSpinner message="Loading chart..." size="small" />}
        >
          <WindChart dailyData={forecast.forecastday} type="daily" />
        </Suspense>
        <Suspense
          fallback={<LoadingSpinner message="Loading chart..." size="small" />}
        >
          <HumidityPressureChart hourlyData={next24Hours} />
        </Suspense>

        <HourlyForecast hourlyData={next24Hours} />
        <DailyForecast dailyData={forecast.forecastday} />
      </div>
    </>
  );
}

export default DetailedView;
