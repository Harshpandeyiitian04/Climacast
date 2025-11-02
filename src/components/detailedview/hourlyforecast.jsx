import { useSelector } from "react-redux";
import { selectTemperatureUnit } from "../../../redux/slices/settingsslice";

function HourlyForecast({ hourlyData }) {
  const temperatureUnit = useSelector(selectTemperatureUnit);

  const convertTemp = (tempC) => {
    if (temperatureUnit === "fahrenheit") {
      return Math.round((tempC * 9) / 5 + 32);
    }
    return Math.round(tempC);
  };

  const unitSymbol = temperatureUnit === "celsius" ? "°C" : "°F";

  return (
    <div className="hourly-forecast">
      <h3>📅 Hourly Forecast (Next 24 Hours)</h3>
      <div className="hourly-scroll">
        {hourlyData.map((hour, index) => (
          <div key={index} className="hourly-item">
            <p className="hourly-time">
              {new Date(hour.time).toLocaleTimeString("en-US", {
                hour: "numeric",
                hour12: true,
              })}
            </p>
            <img src={hour.condition.icon} alt={hour.condition.text} />
            <p className="hourly-temp">
              {convertTemp(hour.temp_c)}
              {unitSymbol}
            </p>
            <p className="hourly-condition">{hour.condition.text}</p>
            <p className="hourly-detail">💧 {hour.humidity}%</p>
            <p className="hourly-detail">💨 {hour.wind_kph} km/h</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HourlyForecast;
