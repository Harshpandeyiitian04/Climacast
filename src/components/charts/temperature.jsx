import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { selectTemperatureUnit } from "../../../redux/slices/settingsslice";
import "./chart.css";

const TemperatureChart = React.memo(
  ({ hourlyData, dailyData, type = "hourly" }) => {
    const temperatureUnit = useSelector(selectTemperatureUnit);
    const [hiddenLines, setHiddenLines] = useState({});

    const convertTemp = (tempC) => {
      if (temperatureUnit === "fahrenheit") {
        return Math.round((tempC * 9) / 5 + 32);
      }
      return Math.round(tempC);
    };

    const unitSymbol = temperatureUnit === "celsius" ? "°C" : "°F";

    const hourlyChartData = useMemo(
      () =>
        hourlyData?.map((hour) => ({
          time: new Date(hour.time).toLocaleTimeString("en-US", {
            hour: "numeric",
            hour12: true,
          }),
          temperature: convertTemp(hour.temp_c),
          feelsLike: convertTemp(hour.feelslike_c),
          humidity: hour.humidity,
          fullTime: new Date(hour.time).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          }),
        })),
      [hourlyData, temperatureUnit]
    );

    const dailyChartData = useMemo(
      () =>
        dailyData?.map((day) => ({
          date: new Date(day.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          maxTemp: convertTemp(day.day.maxtemp_c),
          minTemp: convertTemp(day.day.mintemp_c),
          avgTemp: convertTemp(day.day.avgtemp_c),
          fullDate: new Date(day.date).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          }),
        })),
      [dailyData, temperatureUnit]
    );

    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        return (
          <div className="custom-tooltip">
            <p className="tooltip-label">
              {payload[0].payload.fullTime || payload[0].payload.fullDate}
            </p>
            {payload.map((entry, index) => (
              <p key={index} style={{ color: entry.color }}>
                {entry.name}: {entry.value}
                {entry.name.includes("Temp") || entry.name.includes("Feels")
                  ? unitSymbol
                  : entry.name === "Humidity"
                  ? "%"
                  : ""}
              </p>
            ))}
          </div>
        );
      }
      return null;
    };

    const handleLegendClick = (e) => {
      if (e && e.dataKey) {
        setHiddenLines((prev) => ({
          ...prev,
          [e.dataKey]: !prev[e.dataKey],
        }));
      }
    };

    if (type === "hourly" && (!hourlyData || hourlyData.length === 0)) {
      return (
        <div className="chart-container">
          <div className="chart-header">
            <h3>📈 Hourly Temperature Trends</h3>
            <p className="chart-subtitle">No hourly data available</p>
          </div>
        </div>
      );
    }

    if (type === "daily" && (!dailyData || dailyData.length === 0)) {
      return (
        <div className="chart-container">
          <div className="chart-header">
            <h3>📊 Daily Temperature Forecast</h3>
            <p className="chart-subtitle">No daily data available</p>
          </div>
        </div>
      );
    }

    if (type === "hourly") {
      return (
        <div className="chart-container">
          <div className="chart-header">
            <h3>📈 Hourly Temperature Trends</h3>
            <p className="chart-subtitle">Next 24 Hours</p>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={hourlyChartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="time"
                stroke="#666"
                style={{ fontSize: "0.875rem" }}
              />
              <YAxis
                stroke="#666"
                style={{ fontSize: "0.875rem" }}
                label={{
                  value: unitSymbol,
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                onClick={handleLegendClick}
                wrapperStyle={{ cursor: "pointer" }}
              />
              {!hiddenLines.temperature && (
                <Line
                  type="monotone"
                  dataKey="temperature"
                  name="Temperature"
                  stroke="#667eea"
                  strokeWidth={3}
                  dot={{ fill: "#667eea", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              )}
              {!hiddenLines.feelsLike && (
                <Line
                  type="monotone"
                  dataKey="feelsLike"
                  name="Feels Like"
                  stroke="#f093fb"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: "#f093fb", r: 3 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
    }

    return (
      <div className="chart-container">
        <div className="chart-header">
          <h3>📊 Daily Temperature Forecast</h3>
          <p className="chart-subtitle">7-Day Outlook</p>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            data={dailyChartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ff6b6b" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ecdc4" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#4ecdc4" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="date"
              stroke="#666"
              style={{ fontSize: "0.875rem" }}
            />
            <YAxis
              stroke="#666"
              style={{ fontSize: "0.875rem" }}
              label={{ value: unitSymbol, angle: -90, position: "insideLeft" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              onClick={handleLegendClick}
              wrapperStyle={{ cursor: "pointer" }}
            />
            {!hiddenLines.maxTemp && (
              <Area
                type="monotone"
                dataKey="maxTemp"
                name="Max Temp"
                stroke="#ff6b6b"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorMax)"
              />
            )}
            {!hiddenLines.avgTemp && (
              <Area
                type="monotone"
                dataKey="avgTemp"
                name="Avg Temp"
                stroke="#667eea"
                strokeWidth={2}
                fillOpacity={0.3}
                fill="#667eea"
              />
            )}
            {!hiddenLines.minTemp && (
              <Area
                type="monotone"
                dataKey="minTemp"
                name="Min Temp"
                stroke="#4ecdc4"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorMin)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }
);

export default TemperatureChart;
