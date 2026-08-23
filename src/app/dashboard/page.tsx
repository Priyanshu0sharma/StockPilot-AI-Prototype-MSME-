"use client";

import React, { useEffect, useState } from "react";
import { Product, Sale } from "@/types";
import { useRole } from "@/context/RoleContext";
import { INITIAL_PRODUCTS, INITIAL_SALES } from "@/lib/demo-data";
import { SalesTrendChart } from "@/components/charts/sales-trend-chart";
import { TopProductsChart } from "@/components/charts/top-products-chart";
import { InventoryStatusChart } from "@/components/charts/inventory-status-chart";
import {
  Package,
  IndianRupee,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  ShoppingBag,
  UserCheck,
  ShieldCheck,
  Store,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { role, userName } = useRole();
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS as any);
  const [sales, setSales] = useState<Sale[]>(INITIAL_SALES as any);
  const [metrics, setMetrics] = useState({
    dailyRevenue: 6240,
    weeklyRevenue: 43500,
    monthlyRevenue: 185450,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [prodRes, salesRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/sales"),
      ]);

      const prodData = await prodRes.json();
      const salesData = await salesRes.json();

      if (prodData.success && prodData.products?.length > 0) {
        setProducts(prodData.products);
      }
      if (salesData.success && salesData.sales?.length > 0) {
        setSales(salesData.sales);
        if (salesData.metrics) setMetrics(salesData.metrics);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    }
  };

  // Metric Calculations
  const totalProducts = products.length;
  const currentStockValue = products.reduce(
    (acc, p) => acc + p.currentStock * p.sellingPrice,
    0
  );
  const lowStockProducts = products.filter(
    (p) => p.currentStock <= p.minStockLevel
  );

  // Sales Trend Chart Data (Aggregate by Date)
  const salesByDateMap: Record<string, { revenue: number; units: number }> = {};
  sales.forEach((s) => {
    const dStr = new Date(s.saleDate).toISOString().split("T")[0].slice(5); // MM-DD
    if (!salesByDateMap[dStr]) {
      salesByDateMap[dStr] = { revenue: 0, units: 0 };
    }
    salesByDateMap[dStr].revenue += s.totalAmount;
    salesByDateMap[dStr].units += s.quantity;
  });

  const salesTrendData = Object.keys(salesByDateMap)
    .sort()
    .slice(-14)
    .map((date) => ({
      date,
      revenue: Math.round(salesByDateMap[date].revenue),
      units: salesByDateMap[date].units,
    }));

  // Top Selling Products Chart Data
  const productSalesMap: Record<string, { salesCount: number; revenue: number }> = {};
  sales.forEach((s) => {
    const pName = s.product?.name || "Product";
    if (!productSalesMap[pName]) {
      productSalesMap[pName] = { salesCount: 0, revenue: 0 };
    }
    productSalesMap[pName].salesCount += s.quantity;
    productSalesMap[pName].revenue += s.totalAmount;
  });

  const topProductsData = Object.keys(productSalesMap)
    .map((name) => ({
      name: name.length > 15 ? name.slice(0, 15) + "..." : name,
      salesCount: productSalesMap[name].salesCount,
      revenue: Math.round(productSalesMap[name].revenue),
    }))
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 5);

  // Inventory Status Chart Data
  const inventoryStatusData = products.slice(0, 6).map((p) => ({
    name: p.name.length > 12 ? p.name.slice(0, 12) + "..." : p.name,
    currentStock: p.currentStock,
    minStockLevel: p.minStockLevel,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-[#4a5d2e] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Loading MSME Retail Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Inventory & Demand Intelligence
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time stock monitoring, POS sales tracking, and AI reorder recommendations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/forecast"
            className="bg-[#f0f4e8] text-[#4a5d2e] hover:bg-[#e4ebd4] text-xs font-bold px-3.5 py-2 rounded-lg border border-[#4a5d2e]/20 flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Demand Forecast
          </Link>
          <Link
            href="/dashboard/reorders"
            className="bg-[#4a5d2e] hover:bg-[#3f4d22] text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-xs flex items-center gap-1.5 transition-all"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Smart Reorders
          </Link>
        </div>
      </div>

      {/* Role-tailored Operational Bar */}
      <div className="bg-slate-900 text-white p-4 rounded-xl shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/10 text-amber-400 font-bold">
            {role === "Retailer" && <Store className="w-5 h-5" />}
            {role === "Manager" && <UserCheck className="w-5 h-5" />}
            {role === "Admin" && <ShieldCheck className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-white">Active Operational Role: {role} Mode</span>
              <span className="bg-[#4a5d2e] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {userName}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {role === "Retailer" && "Logging daily POS sales, viewing stock depletion warnings, and 7-day demand spikes."}
              {role === "Manager" && "Reviewing AI purchase reorders (4 pending POs), approving supplier orders & receiving shipments."}
              {role === "Admin" && "Monitoring platform-wide sales volume (₹1.85L), catalog health, user accounts & system diagnostics."}
            </p>
          </div>
        </div>
        {role === "Manager" && (
          <Link
            href="/dashboard/reorders"
            className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold text-xs px-3.5 py-2 rounded-lg shrink-0 transition-all text-center"
          >
            Approve Purchase Orders →
          </Link>
        )}
        {role === "Admin" && (
          <Link
            href="/dashboard/admin"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-3.5 py-2 rounded-lg shrink-0 transition-all text-center"
          >
            Manage User Accounts →
          </Link>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Total Products</span>
            <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{totalProducts}</p>
          <p className="text-[11px] text-slate-500 mt-1">Active SKUs in store catalog</p>
        </div>

        {/* Total Stock Value */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Current Stock Value</span>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">
            ₹{currentStockValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </p>
          <p className="text-[11px] text-emerald-600 mt-1 font-medium">Inventory valuation at retail</p>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Low Stock Alerts</span>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-amber-600 mt-2">
            {lowStockProducts.length} <span className="text-xs text-slate-400 font-normal">items</span>
          </p>
          <p className="text-[11px] text-amber-700 mt-1 font-medium">
            Below safety stock threshold
          </p>
        </div>

        {/* Monthly Sales Revenue */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Monthly Revenue</span>
            <div className="p-2 bg-[#f0f4e8] rounded-lg text-[#4a5d2e]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">
            ₹{metrics.monthlyRevenue.toLocaleString("en-IN")}
          </p>
          <p className="text-[11px] text-[#4a5d2e] mt-1 font-medium">
            30-day recorded sales revenue
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* 1. Sales Trend Graph (2 cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Sales Trend Graph</h3>
              <p className="text-xs text-slate-500">Daily sales revenue over past 14 days</p>
            </div>
            <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
              +12.4% vs last week
            </span>
          </div>
          <SalesTrendChart data={salesTrendData} />
        </div>

        {/* 2. Top Products Chart (1 col) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Top Selling Products</h3>
              <p className="text-xs text-slate-500">Highest volume units sold</p>
            </div>
          </div>
          <TopProductsChart data={topProductsData} />
        </div>
      </div>

      {/* Bottom Grid: Inventory Status Chart & Recent Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 3. Inventory Status Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Inventory Status Chart</h3>
              <p className="text-xs text-slate-500">Current Stock vs Minimum Safety Level</p>
            </div>
            <Link
              href="/dashboard/products"
              className="text-xs font-semibold text-[#4a5d2e] hover:underline flex items-center gap-1"
            >
              View Inventory <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <InventoryStatusChart data={inventoryStatusData} />
        </div>

        {/* Recent Sales Table */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Sales Activity</h3>
                <p className="text-xs text-slate-500">Live POS checkout transactions</p>
              </div>
              <Link
                href="/dashboard/sales"
                className="text-xs font-semibold text-[#4a5d2e] hover:underline flex items-center gap-1"
              >
                All Sales <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-700">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Product</th>
                    <th className="p-2.5">Qty</th>
                    <th className="p-2.5">Total</th>
                    <th className="p-2.5">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sales.slice(0, 5).map((sale) => (
                    <tr key={sale.id} className="hover:bg-slate-50/70">
                      <td className="p-2.5 font-medium text-slate-900">
                        {sale.product?.name || "Product"}
                      </td>
                      <td className="p-2.5 font-semibold text-slate-700">{sale.quantity}</td>
                      <td className="p-2.5 font-bold text-emerald-700">
                        ₹{sale.totalAmount.toFixed(2)}
                      </td>
                      <td className="p-2.5 text-slate-500">
                        {new Date(sale.saleDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
