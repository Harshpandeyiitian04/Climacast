import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./chart.css";

const WindChart = React.memo(({ hourlyData, dailyData, type = "hourly" }) => {
  const [hiddenLines, setHiddenLines] = useState({});

  const hourlyChartData = useMemo(
    () =>
      hourlyData?.map((hour) => ({
        time: new Date(hour.time).toLocaleTimeString("en-US", {
          hour: "numeric",
          hour12: true,
        }),
        windSpeed: hour.wind_kph || 0,
        windGust: hour.gust_kph || 0,
        windDir: hour.wind_dir || "N/A",
        fullTime: new Date(hour.time).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
        }),
      })),
    [hourlyData]
  );

  const dailyChartData = useMemo(
    () =>
      dailyData?.map((day) => ({
        date: new Date(day.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        maxWind: day.day.maxwind_kph || 0,
        fullDate: new Date(day.date).toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        }),
      })),
    [dailyData]
  );

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">
            {payload[0].payload.fullTime || payload[0].payload.fullDate}
          </p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value} km/h
            </p>
          ))}
          {payload[0].payload.windDir && (
            <p style={{ color: "#999" }}>
              Direction: {payload[0].payload.windDir}
            </p>
          )}
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
          <h3>💨 Wind Speed & Gusts</h3>
          <p className="chart-subtitle">No hourly data available</p>
        </div>
      </div>
    );
  }

  if (type === "daily" && (!dailyData || dailyData.length === 0)) {
    return (
      <div className="chart-container">
        <div className="chart-header">
          <h3>💨 Maximum Wind Speed</h3>
          <p className="chart-subtitle">No daily data available</p>
        </div>
      </div>
    );
  }

  if (type === "hourly") {
    return (
      <div className="chart-container">
        <div className="chart-header">
          <h3>💨 Wind Speed & Gusts</h3>
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
              label={{ value: "km/h", angle: -90, position: "insideLeft" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              onClick={handleLegendClick}
              wrapperStyle={{ cursor: "pointer" }}
            />
            {!hiddenLines.windSpeed && (
              <Line
                type="monotone"
                dataKey="windSpeed"
                name="Wind Speed"
                stroke="#26c6da"
                strokeWidth={3}
                dot={{ fill: "#26c6da", r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
            {!hiddenLines.windGust && (
              <Line
                type="monotone"
                dataKey="windGust"
                name="Wind Gust"
                stroke="#ff7043"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "#ff7043", r: 3 }}
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
        <h3>💨 Maximum Wind Speed</h3>
        <p className="chart-subtitle">7-Day Forecast</p>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={dailyChartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="date"
            stroke="#666"
            style={{ fontSize: "0.875rem" }}
          />
          <YAxis
            stroke="#666"
            style={{ fontSize: "0.875rem" }}
            label={{ value: "km/h", angle: -90, position: "insideLeft" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="maxWind"
            name="Max Wind"
            stroke="#26c6da"
            strokeWidth={3}
            dot={{ fill: "#26c6da", r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

export default WindChart;
