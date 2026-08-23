"use client";

import React, { useEffect, useState } from "react";
import { ForecastData, Product } from "@/types";
import { ForecastChart } from "@/components/charts/forecast-chart";
import {
  LineChart as LineChartIcon,
  Sparkles,
  TrendingUp,
  Calendar,
  Zap,
  CheckCircle,
} from "lucide-react";

export default function ForecastPage() {
  const [forecasts, setForecasts] = useState<ForecastData[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForecastData();
  }, []);

  const fetchForecastData = async () => {
    setLoading(true);
    try {
      const [fRes, pRes] = await Promise.all([
        fetch("/api/forecast"),
        fetch("/api/products"),
      ]);

      const fData = await fRes.json();
      const pData = await pRes.json();

      if (fData.success) {
        setForecasts(fData.forecasts);
        if (fData.forecasts.length > 0) {
          setSelectedProductId(fData.forecasts[0].productId);
        }
      }
      if (pData.success) {
        setProducts(pData.products);
      }
    } catch (err) {
      console.error("Failed to load forecast data:", err);
    } finally {
      setLoading(false);
    }
  };

  const selectedForecast = forecasts.find((f) => f.productId === selectedProductId);
  const selectedProduct = products.find((p) => p.id === selectedProductId);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">AI Demand Forecasting Engine</h1>
            <span className="bg-[#f0f4e8] text-[#4a5d2e] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#4a5d2e]/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Time-Series Statistical AI
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Predict future customer demand using historical sales trends, weighted moving averages, and exponential smoothing.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs font-semibold text-slate-500">
          Running statistical AI forecasting algorithms over sales history...
        </div>
      ) : (
        <>
          {/* Product Selector & Quick Metrics */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Product for Prediction Analysis
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-[#4a5d2e] w-full sm:w-80"
                >
                  {forecasts.map((f) => (
                    <option key={f.productId} value={f.productId}>
                      {f.productName}
                    </option>
                  ))}
                </select>
              </div>

              {selectedForecast && (
                <div className="flex items-center gap-3">
                  <div className="bg-[#f7f7f3] p-2.5 rounded-xl border border-slate-200 text-center px-4">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase">Growth Trend</p>
                    <p className={`text-sm font-extrabold ${selectedForecast.growthTrendPct >= 0 ? "text-emerald-700" : "text-red-600"}`}>
                      {selectedForecast.growthTrendPct >= 0 ? "+" : ""}{selectedForecast.growthTrendPct}%
                    </p>
                  </div>
                  <div className="bg-[#f7f7f3] p-2.5 rounded-xl border border-slate-200 text-center px-4">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase">AI Confidence</p>
                    <p className="text-sm font-extrabold text-[#4a5d2e]">
                      {Math.round(selectedForecast.confidenceScore * 100)}%
                    </p>
                  </div>
                </div>
              )}
            </div>

            {selectedForecast && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {/* Avg Daily Demand */}
                <div className="bg-[#fdfdfb] p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>Average Daily Demand</span>
                    <Zap className="w-4 h-4 text-amber-500" />
                  </div>
                  <p className="text-xl font-extrabold text-slate-900">
                    {selectedForecast.avgDailyDemand} <span className="text-xs font-normal text-slate-500">units/day</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">Weighted turnover velocity</p>
                </div>

                {/* Next 7 Days Demand */}
                <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200">
                  <div className="flex items-center justify-between text-xs text-emerald-800 mb-1 font-semibold">
                    <span>Next 7 Days Demand</span>
                    <Calendar className="w-4 h-4 text-emerald-700" />
                  </div>
                  <p className="text-2xl font-extrabold text-emerald-800">
                    {selectedForecast.forecast7Days} <span className="text-xs font-normal text-emerald-700">units</span>
                  </p>
                  <p className="text-[11px] text-emerald-700 mt-1">Short-term predicted requirement</p>
                </div>

                {/* Next 30 Days Demand */}
                <div className="bg-[#f0f4e8] p-4 rounded-xl border border-[#4a5d2e]/30">
                  <div className="flex items-center justify-between text-xs text-[#4a5d2e] mb-1 font-semibold">
                    <span>Next 30 Days Demand</span>
                    <TrendingUp className="w-4 h-4 text-[#4a5d2e]" />
                  </div>
                  <p className="text-2xl font-extrabold text-[#4a5d2e]">
                    {selectedForecast.forecast30Days} <span className="text-xs font-normal text-[#4a5d2e]">units</span>
                  </p>
                  <p className="text-[11px] text-[#4a5d2e] mt-1">Monthly forecasted requirement</p>
                </div>
              </div>
            )}
          </div>

          {/* Past Sales vs Future Prediction Graph */}
          {selectedForecast && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Past Sales vs Future AI Prediction Curve
                  </h3>
                  <p className="text-xs text-slate-500">
                    Solid line = Historical Sales | Dashed line = Projected Future Demand
                  </p>
                </div>
              </div>

              <ForecastChart
                historicalData={selectedForecast.historicalPoints}
                projectedData={selectedForecast.projectedPoints}
              />
            </div>
          )}

          {/* Forecast Summary Table across all products */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 bg-[#f8f8f5] border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Demand Forecast Summary (All Products)</h3>
              <span className="text-xs text-slate-500">Statistical Time-Series Model</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-700">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Product Name</th>
                    <th className="p-3.5">Avg Daily Sales</th>
                    <th className="p-3.5">Growth Trend</th>
                    <th className="p-3.5">Next 7-Day Forecast</th>
                    <th className="p-3.5">Next 30-Day Forecast</th>
                    <th className="p-3.5">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {forecasts.map((f) => (
                    <tr
                      key={f.productId}
                      onClick={() => setSelectedProductId(f.productId)}
                      className={`cursor-pointer transition-colors ${
                        f.productId === selectedProductId ? "bg-[#f0f4e8]/60 font-bold" : "hover:bg-slate-50"
                      }`}
                    >
                      <td className="p-3.5 text-slate-900 font-bold">{f.productName}</td>
                      <td className="p-3.5">{f.avgDailyDemand} units/day</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            f.growthTrendPct >= 0
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          {f.growthTrendPct >= 0 ? "+" : ""}{f.growthTrendPct}%
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-emerald-800">{f.forecast7Days} units</td>
                      <td className="p-3.5 font-extrabold text-[#4a5d2e]">{f.forecast30Days} units</td>
                      <td className="p-3.5 text-slate-600 font-mono">
                        {Math.round(f.confidenceScore * 100)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
