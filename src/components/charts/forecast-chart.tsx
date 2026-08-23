"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

interface ForecastChartProps {
  historicalData: { date: string; actual: number }[];
  projectedData: { date: string; projected: number }[];
}

export const ForecastChart: React.FC<ForecastChartProps> = ({
  historicalData,
  projectedData,
}) => {
  // Combine historical and projected data points for seamless line chart transition
  const combinedData: { date: string; ActualSales?: number; ForecastedDemand?: number }[] = [];

  // 1. Add historical points
  historicalData.slice(-14).forEach((pt) => {
    combinedData.push({
      date: pt.date.slice(5), // MM-DD
      ActualSales: pt.actual,
    });
  });

  // Bridge point (last historical point links to first projected point)
  const lastHist = historicalData[historicalData.length - 1];
  if (lastHist) {
    combinedData[combinedData.length - 1].ForecastedDemand = lastHist.actual;
  }

  // 2. Add projected points
  projectedData.forEach((pt) => {
    combinedData.push({
      date: pt.date.slice(5), // MM-DD
      ForecastedDemand: pt.projected,
    });
  });

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={combinedData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748b" }} />
          <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              fontSize: "12px",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
          <Line
            type="monotone"
            dataKey="ActualSales"
            name="Past Sales (Actual)"
            stroke="#4a5d2e"
            strokeWidth={3}
            dot={{ r: 3, fill: "#4a5d2e" }}
          />
          <Line
            type="monotone"
            dataKey="ForecastedDemand"
            name="Future AI Prediction"
            stroke="#d97706"
            strokeWidth={3}
            strokeDasharray="5 5"
            dot={{ r: 4, fill: "#d97706" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
