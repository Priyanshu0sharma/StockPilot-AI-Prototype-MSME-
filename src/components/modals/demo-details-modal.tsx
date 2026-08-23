"use client";

import React, { useState } from "react";
import { useRole } from "@/context/RoleContext";
import { UserRole } from "@/types";
import {
  X,
  Sparkles,
  UserCheck,
  Store,
  ShieldCheck,
  ShoppingBag,
  TrendingUp,
  RefreshCw,
  Package,
  Info,
  Database,
} from "lucide-react";

interface DemoDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSaleModal?: () => void;
  onReseedDatabase?: () => void;
}

export const DemoDetailsModal: React.FC<DemoDetailsModalProps> = ({
  isOpen,
  onClose,
  onOpenSaleModal,
  onReseedDatabase,
}) => {
  const { role, setRole, userName } = useRole();
  const [activeTab, setActiveTab] = useState<"tour" | "credentials" | "catalog" | "actions">("tour");
  const [isReseeding, setIsReseeding] = useState(false);

  if (!isOpen) return null;

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
  };

  const handleReseed = async () => {
    if (onReseedDatabase) {
      setIsReseeding(true);
      await onReseedDatabase();
      setIsReseeding(false);
    } else {
      try {
        setIsReseeding(true);
        const res = await fetch("/api/admin", { method: "POST" });
        const data = await res.json();
        if (data.success) {
          alert("Database re-seeded with fresh 30-day MSME sales history!");
          window.location.reload();
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsReseeding(false);
      }
    }
  };

  const sampleProducts = [
    { name: "Parle-G Gold 100g", category: "Packaged Food", sku: "SKU-PARLE-100", cost: "₹8.50", price: "₹10.00", stock: "85 pcs", minStock: "50 pcs", status: "Healthy" },
    { name: "Maggi 2-Min Noodles 70g", category: "Packaged Food", sku: "SKU-MAGGI-70", cost: "₹11.50", price: "₹14.00", stock: "32 pcs", minStock: "60 pcs", status: "Low Stock Alert" },
    { name: "Tata Salt Iodized 1kg", category: "Groceries", sku: "SKU-TATA-SALT", cost: "₹22.00", price: "₹28.00", stock: "140 pcs", minStock: "40 pcs", status: "Healthy" },
    { name: "Fortune Sunlite Oil 1L", category: "Groceries", sku: "SKU-FORTUNE-1L", cost: "₹125.00", price: "₹145.00", stock: "22 pcs", minStock: "30 pcs", status: "Low Stock Alert" },
    { name: "Amul Butter 100g", category: "Dairy", sku: "SKU-AMUL-100G", cost: "₹50.00", price: "₹58.00", stock: "18 pcs", minStock: "35 pcs", status: "Low Stock Alert" },
    { name: "Dettol Soap 125g", category: "Personal Care", sku: "SKU-DETTOL-125", cost: "₹32.00", price: "₹42.00", stock: "65 pcs", minStock: "25 pcs", status: "Healthy" },
    { name: "Cadbury Dairy Milk 60g", category: "Confectionery", sku: "SKU-CADBURY-60", cost: "₹65.00", price: "₹85.00", stock: "50 pcs", minStock: "20 pcs", status: "Healthy" },
    { name: "Surf Excel Washing Powder 1kg", category: "Household", sku: "SKU-SURF-1KG", cost: "₹115.00", price: "₹142.00", stock: "15 pcs", minStock: "30 pcs", status: "Low Stock Alert" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#2c3919] to-[#4a5d2e] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2.5 rounded-xl border border-white/20">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight">StockPilot AI Prototype Guide</h2>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Demo Mode
                </span>
              </div>
              <p className="text-xs text-slate-200 mt-0.5">
                Overview of MSME retail features, role workflows & sample datasets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 pt-3 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("tour")}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === "tour"
                ? "border-[#4a5d2e] text-[#4a5d2e]"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Guided Evaluation Tour
          </button>
          <button
            onClick={() => setActiveTab("credentials")}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === "credentials"
                ? "border-[#4a5d2e] text-[#4a5d2e]"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Demo Accounts & Roles
          </button>
          <button
            onClick={() => setActiveTab("catalog")}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === "catalog"
                ? "border-[#4a5d2e] text-[#4a5d2e]"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            Pre-loaded MSME Catalog
          </button>
          <button
            onClick={() => setActiveTab("actions")}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === "actions"
                ? "border-[#4a5d2e] text-[#4a5d2e]"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Quick Demo Actions
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700">
          {/* TAB 1: GUIDED TOUR */}
          {activeTab === "tour" && (
            <div className="space-y-5">
              <div className="bg-[#f0f4e8] border border-[#4a5d2e]/20 p-4 rounded-xl flex items-start gap-3">
                <Info className="w-5 h-5 text-[#4a5d2e] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#2c3919]">What is StockPilot AI?</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    StockPilot AI empowers Indian MSME Kirana store owners to prevent stockouts, reduce blocked working capital, and automate purchase reorders using data-driven statistical demand forecasting (Weighted Moving Average + Exponential Smoothing).
                  </p>
                </div>
              </div>

              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                🧪 4-Step Guided Evaluation Flow:
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Step 1 */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl hover:border-[#4a5d2e]/40 transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-[#4a5d2e] text-white font-bold text-xs flex items-center justify-center">
                      1
                    </span>
                    <h5 className="text-xs font-bold text-slate-900">Record a POS Sale</h5>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Click <strong>"Record Sale"</strong> in the top navbar. Select <em>Maggi</em> or <em>Parle-G</em>, enter quantity, and submit. Live store stock auto-decrements instantly!
                  </p>
                </div>

                {/* Step 2 */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl hover:border-[#4a5d2e]/40 transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-[#4a5d2e] text-white font-bold text-xs flex items-center justify-center">
                      2
                    </span>
                    <h5 className="text-xs font-bold text-slate-900">Check Demand Forecast</h5>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Navigate to <strong>AI Demand Forecasting</strong>. View historical 30-day sales curves mapped against 7-day & 30-day predicted future demand curves.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl hover:border-[#4a5d2e]/40 transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-[#4a5d2e] text-white font-bold text-xs flex items-center justify-center">
                      3
                    </span>
                    <h5 className="text-xs font-bold text-slate-900">Manager PO & Stock Receive</h5>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Switch role to <strong>Manager</strong>. Go to <strong>Smart Reorders</strong>, approve a purchase order, and click <strong>"Receive Shipment"</strong> to add stock back to inventory.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl hover:border-[#4a5d2e]/40 transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-[#4a5d2e] text-white font-bold text-xs flex items-center justify-center">
                      4
                    </span>
                    <h5 className="text-xs font-bold text-slate-900">Export PDF & CSV Ledgers</h5>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Go to <strong>Reports & Ledgers</strong>. Download audit-ready print-formatted PDF reports or export full CSV inventory and sales ledgers.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DEMO ACCOUNTS & ROLES */}
          {activeTab === "credentials" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                You can switch between demo roles at any time using the role selector pill in the header bar.
              </p>

              <div className="space-y-3">
                {/* Retailer Card */}
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    role === "Retailer"
                      ? "bg-[#f0f4e8] border-[#4a5d2e] shadow-xs"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold">
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">Retailer Role</h4>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                            Ramesh Sharma
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">email: retailer@stockpilot.ai</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRoleChange("Retailer")}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        role === "Retailer"
                          ? "bg-[#4a5d2e] text-white border-transparent"
                          : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                      }`}
                    >
                      {role === "Retailer" ? "Active Role" : "Switch to Retailer"}
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 mt-3 pt-2 border-t border-slate-200/60">
                    <strong>Capabilities:</strong> View live inventory items, record daily POS sales, view stock health badges, view basic AI demand alerts.
                  </p>
                </div>

                {/* Manager Card */}
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    role === "Manager"
                      ? "bg-[#f0f4e8] border-[#4a5d2e] shadow-xs"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-blue-100 text-blue-800 font-bold">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">Manager Role</h4>
                          <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                            Anita Gupta
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">email: manager@stockpilot.ai</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRoleChange("Manager")}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        role === "Manager"
                          ? "bg-[#4a5d2e] text-white border-transparent"
                          : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                      }`}
                    >
                      {role === "Manager" ? "Active Role" : "Switch to Manager"}
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 mt-3 pt-2 border-t border-slate-200/60">
                    <strong>Capabilities:</strong> Review AI calculated purchase reorders, approve/reject supplier POs, receive shipments (adds stock to DB), audit sales ledgers.
                  </p>
                </div>

                {/* Admin Card */}
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    role === "Admin"
                      ? "bg-[#f0f4e8] border-[#4a5d2e] shadow-xs"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-purple-100 text-purple-800 font-bold">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">Admin Role</h4>
                          <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                            Suresh Kumar
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">email: admin@stockpilot.ai</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRoleChange("Admin")}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        role === "Admin"
                          ? "bg-[#4a5d2e] text-white border-transparent"
                          : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                      }`}
                    >
                      {role === "Admin" ? "Active Role" : "Switch to Admin"}
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 mt-3 pt-2 border-t border-slate-200/60">
                    <strong>Capabilities:</strong> Full system diagnostics, system analytics, user role administration, 1-click MSME database re-seeding.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRE-LOADED CATALOG */}
          {activeTab === "catalog" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600">
                  Pre-loaded dataset simulating an active Kirana / Grocery retail outlet in India:
                </p>
                <span className="text-[11px] font-bold text-[#4a5d2e] bg-[#f0f4e8] px-2.5 py-1 rounded-full border border-[#4a5d2e]/20">
                  8 High-Velocity SKUs
                </span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 border-b border-slate-200 font-bold text-slate-700">
                    <tr>
                      <th className="p-3">Product Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Buying / Selling</th>
                      <th className="p-3">Stock / Min Buffer</th>
                      <th className="p-3">Health Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {sampleProducts.map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80">
                        <td className="p-3 font-semibold text-slate-900">
                          {p.name}
                          <span className="block text-[10px] text-slate-400 font-mono">{p.sku}</span>
                        </td>
                        <td className="p-3 text-slate-600">{p.category}</td>
                        <td className="p-3 font-mono text-slate-700">
                          {p.cost} / <strong className="text-slate-900">{p.price}</strong>
                        </td>
                        <td className="p-3 font-mono">
                          <span className="text-slate-900 font-bold">{p.stock}</span>
                          <span className="text-slate-400 text-[10px]"> (Min: {p.minStock})</span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              p.status === "Healthy"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: QUICK DEMO ACTIONS */}
          {activeTab === "actions" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Use these one-click triggers to quickly test features or reset the prototype state:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Action 1: POS Sale */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#4a5d2e]" />
                    <h4 className="text-xs font-bold text-slate-900">1-Click Record POS Sale</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Instantly open the quick POS sale modal to simulate customer purchasing and watch live inventory deduction.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      if (onOpenSaleModal) onOpenSaleModal();
                    }}
                    className="w-full bg-[#4a5d2e] hover:bg-[#3f4d22] text-white text-xs font-bold py-2 rounded-lg shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Open Sale Modal
                  </button>
                </div>

                {/* Action 2: Re-Seed Database */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-[#4a5d2e]" />
                    <h4 className="text-xs font-bold text-slate-900">Re-Seed Sample Database</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Reset all products, sales history, and reorder recommendations to the clean default 30-day baseline.
                  </p>
                  <button
                    onClick={handleReseed}
                    disabled={isReseeding}
                    className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold py-2 rounded-lg shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 ${isReseeding ? "animate-spin" : ""}`} />
                    {isReseeding ? "Reseeding Data..." : "Re-Seed Demo Data"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Active Role:</span>
            <span className="bg-[#4a5d2e] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {role} ({userName})
            </span>
          </div>
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
