const API_CONFIG={
    apiKey:import.meta.env.VITE_WEATHER_API_KEY,
    baseUrl:import.meta.env.VITE_WEATHER_API_BASE_URL,
}
if(!API_CONFIG.apiKey){
    console.error("API KEY is missing")
}

export default API_CONFIG;
