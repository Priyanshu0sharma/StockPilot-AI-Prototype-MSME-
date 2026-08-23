"use client";

import React, { useEffect, useState } from "react";
import { AIInsight } from "@/lib/insights-engine";
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  PackageX,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function InsightsPage() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/insights");
      const data = await res.json();
      if (data.success) {
        setInsights(data.insights);
      }
    } catch (err) {
      console.error("Failed to fetch AI insights:", err);
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "growth":
        return <TrendingUp className="w-5 h-5 text-emerald-600" />;
      case "stockout_warning":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case "dead_stock":
        return <PackageX className="w-5 h-5 text-amber-600" />;
      default:
        return <Lightbulb className="w-5 h-5 text-[#4a5d2e]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">AI Insights & Retail Intelligence</h1>
            <span className="bg-[#f0f4e8] text-[#4a5d2e] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#4a5d2e]/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Live Pattern Detection
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated notifications identifying demand spikes, stockout risks, and slow-moving inventory.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs font-semibold text-slate-500">
          Analyzing store patterns and generating insights...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className={`p-5 rounded-2xl border bg-white shadow-xs flex flex-col justify-between space-y-4 transition-all hover:shadow-md ${
                insight.severity === "high"
                  ? "border-red-200"
                  : insight.severity === "medium"
                  ? "border-amber-200"
                  : "border-slate-200/80"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-2 rounded-xl ${
                        insight.severity === "high"
                          ? "bg-red-50"
                          : insight.severity === "medium"
                          ? "bg-amber-50"
                          : "bg-[#f0f4e8]"
                      }`}
                    >
                      {getInsightIcon(insight.type)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{insight.title}</h3>
                      <span className="text-[10px] text-slate-400 font-medium">{insight.timestamp}</span>
                    </div>
                  </div>

                  {insight.metric && (
                    <span
                      className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                        insight.severity === "high"
                          ? "bg-red-100 text-red-700"
                          : insight.severity === "medium"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-[#f0f4e8] text-[#4a5d2e]"
                      }`}
                    >
                      {insight.metric}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium pt-1">
                  {insight.message}
                </p>
              </div>

              {insight.actionableText && insight.actionLink && (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                    Recommended Action
                  </span>
                  <Link
                    href={insight.actionLink}
                    className="text-xs font-bold text-[#4a5d2e] hover:underline flex items-center gap-1"
                  >
                    {insight.actionableText} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
