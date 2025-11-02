import React, { useState, useMemo } from "react";
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./chart.css";

const HumidityPressureChart = React.memo(({ hourlyData }) => {
  const [hiddenLines, setHiddenLines] = useState({});

  if (!hourlyData || hourlyData.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-header">
          <h3>💧 Humidity & Pressure Trends</h3>
          <p className="chart-subtitle">No data available</p>
        </div>
      </div>
    );
  }

  const chartData = useMemo(() => hourlyData.map((hour) => ({
    time: new Date(hour.time).toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
    }),
    humidity: hour.humidity || 0,
    pressure: hour.pressure_mb || 0,
    fullTime: new Date(hour.time).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
    }),
  })), [hourlyData]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{payload[0].payload.fullTime}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.name === "Humidity" ? "%" : " mb"}
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

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>💧 Humidity & Pressure Trends</h3>
        <p className="chart-subtitle">Next 24 Hours</p>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorHumidity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4fc3f7" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#4fc3f7" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="time"
            stroke="#666"
            style={{ fontSize: "0.875rem" }}
          />
          <YAxis
            yAxisId="left"
            stroke="#666"
            style={{ fontSize: "0.875rem" }}
            label={{ value: "%", angle: -90, position: "insideLeft" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#666"
            style={{ fontSize: "0.875rem" }}
            label={{ value: "mb", angle: 90, position: "insideRight" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            onClick={handleLegendClick}
            wrapperStyle={{ cursor: "pointer" }}
          />
          {!hiddenLines.humidity && (
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="humidity"
              name="Humidity"
              stroke="#4fc3f7"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorHumidity)"
            />
          )}
          {!hiddenLines.pressure && (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="pressure"
              name="Pressure"
              stroke="#9575cd"
              strokeWidth={3}
              dot={{ fill: "#9575cd", r: 4 }}
              activeDot={{ r: 6 }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
});

export default HumidityPressureChart;
