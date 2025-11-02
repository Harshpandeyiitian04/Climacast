import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts";
import "./chart.css";

const PrecipitationChart = React.memo(({ dailyData }) => {
  const [hiddenBars, setHiddenBars] = useState({});

  if (!dailyData || dailyData.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-header">
          <h3>🌧️ Precipitation & Rain Probability</h3>
          <p className="chart-subtitle">No data available</p>
        </div>
      </div>
    );
  }

  const chartData = useMemo(
    () =>
      dailyData.map((day) => ({
        date: new Date(day.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        precipitation: day.day.totalprecip_mm || 0,
        rainChance: day.day.daily_chance_of_rain || 0,
        snowChance: day.day.daily_chance_of_snow || 0,
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
          <p className="tooltip-label">{payload[0].payload.fullDate}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.name.includes("Chance") ? "%" : " mm"}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleLegendClick = (e) => {
    if (e && e.dataKey) {
      setHiddenBars((prev) => ({
        ...prev,
        [e.dataKey]: !prev[e.dataKey],
      }));
    }
  };

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>🌧️ Precipitation & Rain Probability</h3>
        <p className="chart-subtitle">7-Day Forecast</p>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="date"
            stroke="#666"
            style={{ fontSize: "0.875rem" }}
          />
          <YAxis
            yAxisId="left"
            stroke="#666"
            style={{ fontSize: "0.875rem" }}
            label={{ value: "mm", angle: -90, position: "insideLeft" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#666"
            style={{ fontSize: "0.875rem" }}
            label={{ value: "%", angle: 90, position: "insideRight" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            onClick={handleLegendClick}
            wrapperStyle={{ cursor: "pointer" }}
          />
          {!hiddenBars.precipitation && (
            <Bar
              yAxisId="left"
              dataKey="precipitation"
              name="Precipitation"
              fill="#4fc3f7"
              radius={[8, 8, 0, 0]}
            />
          )}
          {!hiddenBars.rainChance && (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="rainChance"
              name="Rain Chance"
              stroke="#667eea"
              strokeWidth={3}
              dot={{ fill: "#667eea", r: 4 }}
            />
          )}
          {!hiddenBars.snowChance && (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="snowChance"
              name="Snow Chance"
              stroke="#b39ddb"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: "#b39ddb", r: 3 }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
});

export default PrecipitationChart;
