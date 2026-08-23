"use client";

import React, { useEffect, useState } from "react";
import { Sale } from "@/types";
import { RecordSaleModal } from "@/components/modals/record-sale-modal";
import {
  ShoppingCart,
  PlusCircle,
  Calendar,
  TrendingUp,
  CreditCard,
  IndianRupee,
} from "lucide-react";

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [metrics, setMetrics] = useState({
    dailyRevenue: 0,
    weeklyRevenue: 0,
    monthlyRevenue: 0,
    dailyUnits: 0,
    weeklyUnits: 0,
    monthlyUnits: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sales");
      const data = await res.json();
      if (data.success) {
        setSales(data.sales);
        setMetrics(data.metrics);
      }
    } catch (err) {
      console.error("Error loading sales:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Sales Entry & Checkout Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Record retail customer sales transactions with automatic real-time stock deduction.
          </p>
        </div>
        <button
          onClick={() => setIsRecordModalOpen(true)}
          className="bg-[#4a5d2e] hover:bg-[#3f4d22] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          Record New Sale (POS)
        </button>
      </div>

      {/* Sales Metrics Cards: Daily, Weekly, Monthly Sales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Daily Sales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Today's Sales</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            ₹{metrics.dailyRevenue.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            {metrics.dailyUnits} units sold today
          </p>
        </div>

        {/* Weekly Sales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Weekly Sales (7 Days)</span>
            <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            ₹{metrics.weeklyRevenue.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            {metrics.weeklyUnits} units sold this week
          </p>
        </div>

        {/* Monthly Sales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Monthly Sales (30 Days)</span>
            <div className="p-2 bg-[#f0f4e8] text-[#4a5d2e] rounded-lg">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            ₹{metrics.monthlyRevenue.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            {metrics.monthlyUnits} units sold this month
          </p>
        </div>
      </div>

      {/* Sales Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 bg-[#f8f8f5] border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <ShoppingCart className="w-4 h-4 text-[#4a5d2e]" />
            <span>Sales Transaction History</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">Showing recent {sales.length} transactions</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs font-semibold text-slate-500">
            Loading transaction history...
          </div>
        ) : sales.length === 0 ? (
          <div className="p-12 text-center text-xs font-semibold text-slate-500">
            No sales recorded yet. Click "Record New Sale" to add transactions.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Transaction ID</th>
                  <th className="p-3.5">Product Name</th>
                  <th className="p-3.5">SKU ID</th>
                  <th className="p-3.5">Quantity Sold</th>
                  <th className="p-3.5">Unit Price</th>
                  <th className="p-3.5">Total Amount</th>
                  <th className="p-3.5">Transaction Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-mono text-slate-500 text-[11px]">
                      #{sale.id.slice(0, 8)}
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">
                      {sale.product?.name || "Product"}
                    </td>
                    <td className="p-3.5 font-mono text-slate-600 text-[11px]">
                      {sale.product?.sku || "-"}
                    </td>
                    <td className="p-3.5">
                      <span className="bg-slate-100 text-slate-800 font-extrabold px-2.5 py-1 rounded-md">
                        {sale.quantity} units
                      </span>
                    </td>
                    <td className="p-3.5 font-semibold text-slate-600">₹{sale.unitPrice.toFixed(2)}</td>
                    <td className="p-3.5 font-extrabold text-emerald-700">
                      ₹{sale.totalAmount.toFixed(2)}
                    </td>
                    <td className="p-3.5 text-slate-500">
                      {new Date(sale.saleDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Sale Modal */}
      {isRecordModalOpen && (
        <RecordSaleModal
          isOpen={isRecordModalOpen}
          onClose={() => setIsRecordModalOpen(false)}
          onSuccess={fetchSales}
        />
      )}
    </div>
  );
}
