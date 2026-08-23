"use client";

import React, { useEffect, useState } from "react";
import { useRole } from "@/context/RoleContext";
import {
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  PackageCheck,
  TrendingUp,
  ShieldCheck,
  Building2,
} from "lucide-react";

interface ReorderItem {
  productId: string;
  productName: string;
  category: string;
  sku: string;
  currentStock: number;
  minStockLevel: number;
  predictedDemand30Days: number;
  safetyStock: number;
  requiredStockTotal: number;
  recommendedOrderQuantity: number;
  estimatedCost: number;
  daysUntilStockout: number;
  urgency: "High" | "Medium" | "Low";
  reason: string;
  supplierName: string;
  dbId?: string;
  status: "Pending" | "Approved" | "Rejected" | "Fulfilled";
}

export default function ReordersPage() {
  const { role } = useRole();
  const [recommendations, setRecommendations] = useState<ReorderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchReorderSuggestions();
  }, []);

  const fetchReorderSuggestions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reorders");
      const data = await res.json();
      if (data.success) {
        setRecommendations(data.recommendations);
      }
    } catch (err) {
      console.error("Failed to load reorder suggestions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (item: ReorderItem, newStatus: string) => {
    setActionLoading(item.productId);
    try {
      const res = await fetch("/api/reorders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: item.productId,
          status: newStatus,
          recommendedOrder: item.recommendedOrderQuantity,
        }),
      });

      const data = await res.json();
      if (data.success) {
        fetchReorderSuggestions();
      } else {
        alert(data.error || "Failed to update status");
      }
    } catch (err: any) {
      alert(err.message || "Network error");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Smart Reorder Engine</h1>
          <p className="text-xs text-slate-500 mt-1">
            Automated replenishment calculations comparing current inventory against predicted demand and safety stock.
          </p>
        </div>
      </div>

      {/* Formula Callout Banner */}
      <div className="bg-[#f0f4e8] p-4 rounded-2xl border border-[#4a5d2e]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#4a5d2e] text-white rounded-xl">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#4a5d2e] uppercase tracking-wider">
              Reorder Formula
            </p>
            <p className="text-sm font-extrabold text-slate-900 mt-0.5">
              Required Stock = 30-Day Predicted Demand + Safety Stock Buffer
            </p>
            <p className="text-xs text-slate-600">
              Recommended Order = Max( 0, Required Stock - Current Stock )
            </p>
          </div>
        </div>

        <div className="text-right text-xs bg-white/80 p-3 rounded-xl border border-[#4a5d2e]/20">
          <p className="font-semibold text-slate-600">Approval Permission:</p>
          <p className="font-bold text-[#4a5d2e]">
            {role === "Manager" || role === "Admin"
              ? "✅ You can approve & fulfill orders"
              : "ℹ️ Retailer Mode (Manager approval required)"}
          </p>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 bg-[#f8f8f5] border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Inventory Reorder Suggestions</h3>
          <span className="text-xs text-slate-500 font-semibold">
            {recommendations.filter((r) => r.recommendedOrderQuantity > 0).length} Items Needing Action
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs font-semibold text-slate-500">
            Calculating stock requirements & safety buffers...
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recommendations.map((item) => {
              const isNeedingOrder = item.recommendedOrderQuantity > 0;
              return (
                <div
                  key={item.productId}
                  className={`p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                    item.urgency === "High" ? "bg-red-50/30" : "hover:bg-slate-50/70"
                  }`}
                >
                  {/* Left Product Details */}
                  <div className="space-y-1 max-w-md">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{item.productName}</span>
                      <span className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                        {item.category}
                      </span>
                      {item.urgency === "High" && (
                        <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-red-200">
                          <AlertTriangle className="w-3 h-3" /> High Urgency
                        </span>
                      )}
                      {item.urgency === "Medium" && (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                          Medium Priority
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{item.reason}</p>

                    <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                      <span>Supplier: <strong className="text-slate-700">{item.supplierName}</strong></span>
                      <span>Stockout in: <strong className="text-slate-700">{item.daysUntilStockout} days</strong></span>
                    </div>
                  </div>

                  {/* Middle Comparison Grid */}
                  <div className="grid grid-cols-4 gap-3 bg-[#f9f9f7] p-3 rounded-xl border border-slate-200 text-center text-xs">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase block">Current</span>
                      <span className="font-extrabold text-slate-900 text-sm">{item.currentStock}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase block">30D Forecast</span>
                      <span className="font-bold text-slate-700 text-sm">{item.predictedDemand30Days}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase block">Safety Stock</span>
                      <span className="font-bold text-slate-700 text-sm">{item.safetyStock}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase block">Order Qty</span>
                      <span className="font-extrabold text-[#4a5d2e] text-sm">
                        +{item.recommendedOrderQuantity}
                      </span>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-semibold text-slate-500">Est. Purchase Cost: </span>
                      <span className="text-sm font-extrabold text-slate-900">
                        ₹{item.estimatedCost.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.status === "Fulfilled" ? (
                        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Stock Restocked
                        </span>
                      ) : item.status === "Approved" ? (
                        <div className="flex items-center gap-1.5">
                          <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-blue-200">
                            Order Approved
                          </span>
                          {(role === "Manager" || role === "Admin" || role === "Retailer") && (
                            <button
                              onClick={() => handleUpdateStatus(item, "Fulfilled")}
                              disabled={actionLoading === item.productId}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs transition-all cursor-pointer"
                            >
                              Receive Shipment
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {(role === "Manager" || role === "Admin") ? (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(item, "Approved")}
                                disabled={actionLoading === item.productId || !isNeedingOrder}
                                className="bg-[#4a5d2e] hover:bg-[#3f4d22] disabled:opacity-50 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shadow-xs transition-all cursor-pointer flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" /> Approve Order
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(item, "Rejected")}
                                disabled={actionLoading === item.productId}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer"
                              >
                                Dismiss
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => alert("Reorder suggestion logged! Switch role to Manager to approve.")}
                              className="bg-[#f0f4e8] text-[#4a5d2e] text-xs font-bold px-3 py-1.5 rounded-lg border border-[#4a5d2e]/30 cursor-pointer"
                            >
                              Request Manager Approval
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
