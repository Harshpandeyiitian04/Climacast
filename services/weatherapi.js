import axios from "axios";
import API_CONFIG from "../config/api_config";
import {
  getCachedData,
  setCachedData,
  getCacheTimeRemaining,
} from "../utils/cache";

const weatherApi = axios.create({
  baseURL: API_CONFIG.baseUrl,
  timeout: 10000,
});

weatherApi.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

weatherApi.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`API Error ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      console.error("No response from API:", error.message);
    } else {
      console.error("API Request Setup Error:", error.message);
    }
    return Promise.reject(error);
  }
);

function handleApiError(error, operation) {
  const errorResponse = {
    success: false,
    operation,
    message: "An unexpected error occurred",
    details: null,
    retryable: false,
  };

  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 400:
        errorResponse.message = data.error?.message || "Invalid request";
        errorResponse.details = "Please check your search query";
        break;
      case 401:
        errorResponse.message = "API key is invalid";
        errorResponse.details = "Please check your API configuration";
        break;
      case 403:
        errorResponse.message = "Access forbidden";
        errorResponse.details =
          "Your API key may not have required permissions";
        break;
      case 404:
        errorResponse.message = "Location not found";
        errorResponse.details = "Please try a different city name";
        break;
      case 429:
        errorResponse.message = "Rate limit exceeded";
        errorResponse.details = "Too many requests. Please wait a moment";
        errorResponse.retryable = true;
        break;
      case 500:
      case 502:
      case 503:
        errorResponse.message = "Weather service unavailable";
        errorResponse.details = "Please try again later";
        errorResponse.retryable = true;
        break;
      default:
        errorResponse.message = data.error?.message || "Request failed";
        errorResponse.details = `Status code: ${status}`;
    }
  } else if (error.request) {
    errorResponse.message = "No response from weather service";
    errorResponse.details = "Please check your internet connection";
    errorResponse.retryable = true;
  } else if (error.code === "ECONNABORTED") {
    errorResponse.message = "Request timeout";
    errorResponse.details = "The server took too long to respond";
    errorResponse.retryable = true;
  } else {
    errorResponse.message = error.message || "Unknown error occurred";
    errorResponse.details = "Please try again";
  }

  console.error(`${operation} Error:`, errorResponse);
  return errorResponse;
}

export async function getCurrentWeather(city) {
  const cacheKey = `weather-${city}`;

  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    const timeRemaining = getCacheTimeRemaining(cacheKey);
    console.log(
      `Using cached weather data for ${city} (expires in ${timeRemaining}s)`
    );
    return {
      ...cachedData,
      fromCache: true,
      cacheTimeRemaining: timeRemaining,
    };
  }

  try {
    const response = await weatherApi.get("/current.json", {
      params: {
        key: API_CONFIG.apiKey,
        q: city,
        aqi: "yes",
      },
    });

    setCachedData(cacheKey, response.data);

    return {
      ...response.data,
      fromCache: false,
      cacheTimeRemaining: 60,
    };
  } catch (error) {
    throw handleApiError(error, "Get Current Weather");
  }
}

export async function getForecast(city, days = 7) {
  const cacheKey = `forecast-${city}-${days}`;

  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    const timeRemaining = getCacheTimeRemaining(cacheKey);
    console.log(
      `Using cached forecast data for ${city} (expires in ${timeRemaining}s)`
    );
    return {
      ...cachedData,
      fromCache: true,
      cacheTimeRemaining: timeRemaining,
    };
  }

  try {
    const validDays = Math.min(Math.max(1, days), 10);
    if (validDays !== days) {
      console.warn(
        `Days parameter adjusted from ${days} to ${validDays} (valid range: 1-10)`
      );
    }

    const response = await weatherApi.get("/forecast.json", {
      params: {
        key: API_CONFIG.apiKey,
        q: city,
        days: validDays,
        aqi: "yes",
        alerts: "yes",
      },
    });

    setCachedData(cacheKey, response.data);

    return {
      ...response.data,
      fromCache: false,
      cacheTimeRemaining: 60,
    };
  } catch (error) {
    throw handleApiError(error, "Get Forecast");
  }
}

export async function searchCities(query) {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const cacheKey = `search-${query.toLowerCase().trim()}`;

  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    console.log(`Using cached search results for "${query}"`);
    return cachedData;
  }

  try {
    const response = await weatherApi.get("/search.json", {
      params: {
        key: API_CONFIG.apiKey,
        q: query.trim(),
      },
    });

    setCachedData(cacheKey, response.data);

    return response.data;
  } catch (error) {
    throw handleApiError(error, "Search Cities");
  }
}

export async function getHourlyForecast(city, hours = 24) {
  const days = Math.ceil(hours / 24);
  const forecast = await getForecast(city, days);

  const allHours = forecast.forecast.forecastday.flatMap((day) => day.hour);

  const currentHour = new Date().getHours();
  const hourlyData = allHours.slice(currentHour, currentHour + hours);

  return {
    location: forecast.location,
    hourly: hourlyData,
    fromCache: forecast.fromCache,
    cacheTimeRemaining: forecast.cacheTimeRemaining,
  };
}

export async function getMultipleCitiesWeather(cities) {
  try {
    const promises = cities.map((city) =>
      getCurrentWeather(city).catch((error) => ({
        city,
        error: error.message,
        success: false,
      }))
    );

    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    throw handleApiError(error, "Get Multiple Cities Weather");
  }
}

export async function validateApiKey() {
  try {
    await weatherApi.get("/current.json", {
      params: {
        key: API_CONFIG.apiKey,
        q: "London",
      },
    });
    return true;
  } catch (error) {
    console.error("API Key Validation Failed:", error.response?.status);
    return false;
  }
}

export default weatherApi;
