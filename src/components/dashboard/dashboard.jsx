import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCurrentWeather,
  fetchForecast,
} from "../../../redux/slices/weatherslice";
import CityCard from "./citycard";
import LoadingSpinner from "../common/loadingspinner";
import ErrorDisplay from "../common/errordisplay";
import "./dashboard.css";

function Dashboard() {
  const dispatch = useDispatch();
  const { currentWeather, forecasts } = useSelector((state) => state.weather);
  const favorites = useSelector((state) => state.favorites.cities);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (favorites.length > 0) {
      setLoadingFavorites(true);
      setError(null);

      const loadPromises = favorites.map(async (city) => {
        try {
          await dispatch(fetchCurrentWeather(city.name)).unwrap();
          await dispatch(fetchForecast({ city: city.name, days: 7 })).unwrap();
        } catch (err) {
          console.error(`Failed to load weather for ${city.name}:`, err);
        }
      });

      Promise.all(loadPromises)
        .then(() => {
          setLoadingFavorites(false);
        })
        .catch((err) => {
          setError({
            message: "Failed to load some weather data",
            details: "Some cities may not be displayed correctly",
            retryable: true,
          });
          setLoadingFavorites(false);
        });
    }
  }, [favorites.length]); 

  useEffect(() => {
    const interval = setInterval(() => {
      Object.keys(currentWeather).forEach((cityName) => {
        const lastUpdated = currentWeather[cityName]?.lastUpdated;
        if (lastUpdated && Date.now() - lastUpdated >= 60000) {
          console.log(`Auto-refreshing data for ${cityName}`);
          dispatch(fetchCurrentWeather(cityName));
          dispatch(fetchForecast({ city: cityName, days: 7 }));
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [currentWeather, dispatch]);

  const handleRetry = () => {
    setError(null);
    setLoadingFavorites(true);

    favorites.forEach((city) => {
      dispatch(fetchCurrentWeather(city.name));
      dispatch(fetchForecast({ city: city.name, days: 7 }));
    });

    setTimeout(() => setLoadingFavorites(false), 2000);
  };

  const cityNames = Object.keys(currentWeather);
  const favoriteCities = cityNames.filter((city) =>
    favorites.some((fav) => fav.name.toLowerCase() === city.toLowerCase())
  );
  const otherCities = cityNames.filter(
    (city) =>
      !favorites.some((fav) => fav.name.toLowerCase() === city.toLowerCase())
  );

  if (loadingFavorites && cityNames.length === 0) {
    return <LoadingSpinner message="Loading your favorite cities..." size="large" />;
  }

  return (
    <div className="dashboard">
      {error && (
        <ErrorDisplay
          error={error}
          onRetry={handleRetry}
          onDismiss={() => setError(null)}
        />
      )}

      {favoriteCities.length > 0 && (
        <div className="dashboard-section">
          <h2 className="section-title">⭐ Favorite Cities</h2>
          <div className="city-grid">
            {favoriteCities.map((cityName) => (
              <CityCard
                key={cityName}
                cityName={cityName}
                weatherData={currentWeather[cityName]}
                forecastData={forecasts[cityName]}
              />
            ))}
          </div>
        </div>
      )}

      {otherCities.length > 0 && (
        <div className="dashboard-section">
          <h2 className="section-title">🌍 Other Cities</h2>
          <div className="city-grid">
            {otherCities.map((cityName) => (
              <CityCard
                key={cityName}
                cityName={cityName}
                weatherData={currentWeather[cityName]}
                forecastData={forecasts[cityName]}
              />
            ))}
          </div>
        </div>
      )}

      {cityNames.length === 0 && !loadingFavorites && (
        <div className="empty-state">
          <div className="empty-icon">🌤️</div>
          <h2>Welcome to Climacast</h2>
          <p>Search for a city above to get started!</p>
          <div className="empty-tips">
            <h3>Quick Tips:</h3>
            <ul>
              <li>🔍 Use the search bar to find any city worldwide</li>
              <li>⭐ Add cities to favorites for quick access</li>
              <li>📊 Click any city card for detailed analytics</li>
              <li>⚙️ Customize settings in the top right</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
