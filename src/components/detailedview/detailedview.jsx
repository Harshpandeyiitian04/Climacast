import React, { Suspense, useEffect } from "react";
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
import "./detailedview.css";

const TemperatureChart = React.lazy(() => import("../charts/temperature"));
const PrecipitationChart = React.lazy(() =>
  import("../charts/precipitationchart")
);
const WindChart = React.lazy(() => import("../charts/windchart"));
const HumidityPressureChart = React.lazy(() =>
  import("../charts/humiditypressurechart")
);

export default function DetailedView() {
  const { cityName } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cityKey = decodeURIComponent(cityName).trim().toLowerCase();
  const forecastKey = `${cityKey}-7`;

  const weather = useSelector(
    (state) => state.weather.currentWeather[cityKey] || {}
  );
  const forecast = useSelector(
    (state) => state.weather.forecasts[forecastKey] || {}
  );

  const unit = useSelector(selectTemperatureUnit);
  const isFav = useSelector((state) => selectIsFavorite(cityKey)(state));

  useEffect(() => {
    if (!weather.data && !weather.loading) {
      dispatch(fetchCurrentWeather(cityKey));
    }
    if (!forecast.data && !forecast.loading) {
      dispatch(fetchForecast({ city: cityKey, days: 7 }));
    }
  }, [
    dispatch,
    cityKey,
    weather.data,
    weather.loading,
    forecast.data,
    forecast.loading,
  ]);

  const toTemp = (c) =>
    unit === "fahrenheit" ? Math.round((c * 9) / 5 + 32) : Math.round(c);
  const sym = unit === "celsius" ? "°C" : "°F";

  if (!weather.data || !forecast.data) {
    return (
      <>
        <Header />
        <LoadingSpinner message={`Loading ${cityKey}...`} size="large" />
      </>
    );
  }

  const { location, current } = weather.data;
  const { forecast: fc } = forecast.data;
  const next24 = fc.forecastday
    .flatMap((d) => d.hour)
    .slice(new Date().getHours(), new Date().getHours() + 24);

  return (
    <>
      <Header />
      <div className="detailed-view">
        <div className="detailed-header">
          <button className="back-btn" onClick={() => navigate("/")}>
            Back
          </button>
          <button
            className={`favorite-btn-detailed ${isFav ? "favorited" : ""}`}
            onClick={() => {
              isFav
                ? dispatch(removeFavorite(cityKey))
                : dispatch(
                    addFavorite({
                      name: location.name,
                      country: location.country,
                    })
                  );
            }}
          >
            {isFav ? "Favorited" : "Add to Favorites"}
          </button>
        </div>

        <section className="current-weather-detailed">
          <div className="location-info">
            <h1>
              {location.name}, {location.country}
            </h1>
            <p>{new Date(location.localtime).toLocaleString()}</p>
          </div>
          <div className="current-main">
            <img
              src={current.condition.icon}
              alt={current.condition.text}
              className="main-icon"
            />
            <div className="main-temp">
              {toTemp(current.temp_c)}
              {sym}
            </div>
            <p className="main-condition">{current.condition.text}</p>
            <p className="feels-like">
              Feels like {toTemp(current.feelslike_c)}
              {sym}
            </p>
          </div>

          <div className="detailed-metrics">
            {[
              { label: "Humidity", value: `${current.humidity}%` },
              {
                label: "Wind",
                value: `${current.wind_kph} km/h`,
                sub: current.wind_dir,
              },
              { label: "Pressure", value: `${current.pressure_mb} mb` },
              { label: "UV Index", value: current.uv },
              { label: "Visibility", value: `${current.vis_km} km` },
              { label: "Cloud", value: `${current.cloud}%` },
              {
                label: "Dew Point",
                value: `${toTemp(current.dewpoint_c)}${sym}`,
              },
              { label: "Precip", value: `${current.precip_mm} mm` },
            ].map((m, i) => (
              <div key={i} className="metric-card">
                <p className="metric-label">{m.label}</p>
                <p className="metric-value">{m.value}</p>
                {m.sub && <p className="metric-sub">{m.sub}</p>}
              </div>
            ))}
          </div>
        </section>

        <Suspense fallback={<LoadingSpinner size="small" />}>
          <TemperatureChart hourlyData={next24} type="hourly" />
          <TemperatureChart dailyData={fc.forecastday} type="daily" />
          <PrecipitationChart dailyData={fc.forecastday} />
          <WindChart hourlyData={next24} type="hourly" />
          <WindChart dailyData={fc.forecastday} type="daily" />
          <HumidityPressureChart hourlyData={next24} />
        </Suspense>

        <HourlyForecast hourlyData={next24} />
        <DailyForecast dailyData={fc.forecastday} />
      </div>
    </>
  );
}
