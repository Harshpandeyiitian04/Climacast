import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  searchForCities,
  setSearchQuery,
  clearSearchResults,
  addToSearchHistory,
} from "../../../redux/slices/searchslice";
import {
  fetchCurrentWeather,
  fetchForecast,
} from "../../../redux/slices/weatherslice";
import ErrorDisplay from "../common/errordisplay";
import "./searchbar.css";

function SearchBar() {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const { results, loading, error, searchHistory } = useSelector(
    (state) => state.search
  );

  useEffect(() => {
    if (inputValue.length >= 2) {
      const timer = setTimeout(async () => {
        try {
          setSearchError(null);
          await dispatch(searchForCities(inputValue)).unwrap();
          setShowResults(true);
        } catch (err) {
          setSearchError({
            message: "Search failed",
            details: err.message || "Please try again",
            retryable: true,
          });
        }
      }, 300);

      return () => clearTimeout(timer);
    } else {
      dispatch(clearSearchResults());
      setShowResults(false);
      setSearchError(null);
    }
  }, [inputValue, dispatch]);

  const handleSelectCity = async (city) => {
    try {
      setSearchError(null);
      const cityName = `${city.lat},${city.lon}`;

      await dispatch(fetchCurrentWeather(cityName)).unwrap();
      await dispatch(fetchForecast({ city: cityName, days: 7 })).unwrap();

      dispatch(addToSearchHistory(city));

      setInputValue("");
      setShowResults(false);
      dispatch(clearSearchResults());
    } catch (err) {
      setSearchError({
        message: "Failed to load weather data",
        details: err.message || "Please try selecting another city",
        retryable: false,
      });
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    dispatch(setSearchQuery(e.target.value));
    setSearchError(null);
  };

  const handleRetrySearch = () => {
    setSearchError(null);
    if (inputValue.length >= 2) {
      dispatch(searchForCities(inputValue));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="search-container">
      {searchError && (
        <ErrorDisplay
          error={searchError}
          onRetry={searchError.retryable ? handleRetrySearch : null}
          onDismiss={() => setSearchError(null)}
        />
      )}

      <form className="search-wrapper" onSubmit={handleSubmit}>
        <input
          id="city-search-input"
          name="citySearch"
          type="text"
          className="search-input"
          placeholder="Search for a city... (e.g., London, New York)"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => inputValue.length >= 2 && setShowResults(true)}
          autoComplete="off"
          aria-label="Search for a city"
          aria-autocomplete="list"
          aria-controls="search-results"
          aria-expanded={showResults}
        />
        <span className="search-icon" aria-hidden="true">
          {loading ? "⏳" : "🔍"}
        </span>

        {showResults && (
          <div
            id="search-results"
            className="search-results"
            role="listbox"
            aria-label="City search results"
          >
            {loading && (
              <div className="search-loading" role="status">
                <div className="loading-dots" aria-hidden="true">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <p>Searching...</p>
              </div>
            )}

            {!loading && error && (
              <div className="search-error" role="alert">
                <span className="error-icon" aria-hidden="true">
                  ⚠️
                </span>
                <p>{error}</p>
              </div>
            )}

            {!loading &&
              !error &&
              results.length === 0 &&
              inputValue.length >= 2 && (
                <div className="search-empty" role="status">
                  <span className="empty-icon" aria-hidden="true">
                    🔍
                  </span>
                  <p>No cities found</p>
                  <small>Try a different search term</small>
                </div>
              )}

            {!loading && !error && results.length > 0 && (
              <div className="results-list">
                {results.map((city, index) => (
                  <div
                    key={`${city.name}-${city.lat}-${city.lon}-${index}`}
                    className="result-item"
                    onClick={() => handleSelectCity(city)}
                    role="option"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleSelectCity(city);
                      }
                    }}
                    aria-label={`${city.name}, ${city.region}, ${city.country}`}
                  >
                    <div className="result-main">
                      <span className="result-name">
                        <strong>{city.name}</strong>
                        {city.region && `, ${city.region}`}
                      </span>
                      <span className="result-country">{city.country}</span>
                    </div>
                    <div className="result-meta">
                      <small>
                        📍 {city.lat.toFixed(2)}, {city.lon.toFixed(2)}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </form>

      {searchHistory.length > 0 && inputValue === "" && !searchError && (
        <div className="search-history">
          <h4>Recent Searches:</h4>
          <div className="history-chips" role="list">
            {searchHistory.slice(0, 5).map((city, index) => (
              <button
                key={`history-${city.name}-${index}`}
                className="history-chip"
                onClick={() => handleSelectCity(city)}
                type="button"
                aria-label={`Search for ${city.name} again`}
              >
                📍 {city.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
