"use client";

import React, { useEffect, useState } from "react";
import { User } from "@/types";
import { useRole } from "@/context/RoleContext";
import {
  ShieldCheck,
  Users,
  Database,
  BarChart3,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Lock,
} from "lucide-react";

export default function AdminPage() {
  const { role } = useRole();
  const [users, setUsers] = useState<User[]>([
    { id: "usr-1", clerkId: "clerk-1", name: "Ramesh Sharma", email: "retailer@stockpilot.ai", role: "Retailer", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "usr-2", clerkId: "clerk-2", name: "Anita Gupta", email: "manager@stockpilot.ai", role: "Manager", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "usr-3", clerkId: "clerk-3", name: "Suresh Kumar", email: "admin@stockpilot.ai", role: "Admin", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ]);
  const [analytics, setAnalytics] = useState({
    totalUsers: 3,
    totalProducts: 8,
    totalSalesCount: 240,
    totalRevenue: 185450,
    activeRecommendations: 4,
  });
  const [loading, setLoading] = useState(false);
  const [reseedLoading, setReseedLoading] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin");
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
        setAnalytics(data.analytics);
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReseedDatabase = async () => {
    if (!confirm("Re-seed sample MSME retail database with 30-day historical sales data?")) return;
    setReseedLoading(true);
    try {
      const res = await fetch("/api/admin", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        alert("Database re-seeded successfully!");
        fetchAdminData();
      } else {
        alert(data.error || "Reseed failed");
      }
    } catch (err: any) {
      alert(err.message || "Network error");
    } finally {
      setReseedLoading(false);
    }
  };

  if (role === "Retailer") {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3 max-w-md mx-auto my-12">
        <Lock className="w-10 h-10 text-amber-500 mx-auto" />
        <h2 className="text-base font-bold text-slate-900">Access Restricted to Admin & Manager</h2>
        <p className="text-xs text-slate-500">
          You are currently in Retailer mode. Switch your demo role to <strong>Admin</strong> or <strong>Manager</strong> using the top role switcher bar.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Admin & System Control Center</h1>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              Admin Access
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage platform user accounts, monitor system-wide metrics, and control sample data.
          </p>
        </div>

        <button
          onClick={handleReseedDatabase}
          disabled={reseedLoading}
          className="bg-[#4a5d2e] hover:bg-[#3f4d22] disabled:opacity-50 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${reseedLoading ? "animate-spin" : ""}`} />
          {reseedLoading ? "Seeding DB..." : "Re-seed MSME Demo Dataset"}
        </button>
      </div>

      {/* System Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Registered Users</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{analytics.totalUsers}</p>
          <p className="text-[11px] text-slate-500">Retailer, Manager & Admin</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Catalog Products</span>
            <Database className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{analytics.totalProducts}</p>
          <p className="text-[11px] text-slate-500">Active product SKUs</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Total Sales Volume</span>
            <BarChart3 className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{analytics.totalSalesCount}</p>
          <p className="text-[11px] text-slate-500">Transactions processed</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Gross Sales Revenue</span>
            <ShieldCheck className="w-4 h-4 text-[#4a5d2e]" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            ₹{analytics.totalRevenue.toLocaleString("en-IN")}
          </p>
          <p className="text-[11px] text-[#4a5d2e] font-semibold">Total platform turnover</p>
        </div>
      </div>

      {/* Prototype Demo Info & Credentials Reference */}
      <div className="bg-gradient-to-r from-slate-900 to-[#2c3919] text-white p-5 rounded-2xl border border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold tracking-tight">Prototype Demo Credentials & Control Hub</h3>
          </div>
          <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
            MSME SaaS Evaluation
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The database comes pre-seeded with 30-day realistic sales transactions for 8 high-velocity Indian Kirana SKUs (Parle-G, Maggi, Tata Salt, Fortune Oil, Amul Butter, Dettol, Cadbury, Surf Excel). Use the top Navbar role pill to instantly switch persona.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 text-xs">
            <span className="text-amber-300 font-bold block">🛒 Retailer Role</span>
            <span className="text-slate-200 font-mono text-[11px]">Ramesh Sharma</span>
            <p className="text-[10px] text-slate-400 mt-1">POS Sales, Stock View & Alerts</p>
          </div>
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 text-xs">
            <span className="text-amber-300 font-bold block">📋 Manager Role</span>
            <span className="text-slate-200 font-mono text-[11px]">Anita Gupta</span>
            <p className="text-[10px] text-slate-400 mt-1">PO Approvals & Shipment Receipts</p>
          </div>
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 text-xs">
            <span className="text-amber-300 font-bold block">⚡ Admin Role</span>
            <span className="text-slate-200 font-mono text-[11px]">Suresh Kumar</span>
            <p className="text-[10px] text-slate-400 mt-1">System Diagnostics & DB Seeding</p>
          </div>
        </div>
      </div>

      {/* User Accounts Management Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 bg-[#f8f8f5] border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">User Access & Role Management</h3>
          <span className="text-xs text-slate-500">{users.length} Active System Accounts</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs font-semibold text-slate-500">
            Loading user list...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">User Name</th>
                  <th className="p-3.5">Email Address</th>
                  <th className="p-3.5">Assigned Role</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">{u.name}</td>
                    <td className="p-3.5 text-slate-600 font-mono text-[11px]">{u.email}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                          u.role === "Admin"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : u.role === "Manager"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-[#f0f4e8] text-[#4a5d2e] border border-[#4a5d2e]/20"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1 w-fit">
                        <CheckCircle className="w-3 h-3" /> Active
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
