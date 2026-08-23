"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "@/context/RoleContext";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LineChart,
  RefreshCw,
  Sparkles,
  FileSpreadsheet,
  ShieldAlert,
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { role } = useRole();

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["Retailer", "Manager", "Admin"],
    },
    {
      label: "Products",
      href: "/dashboard/products",
      icon: Package,
      roles: ["Retailer", "Manager", "Admin"],
    },
    {
      label: "Sales Entry",
      href: "/dashboard/sales",
      icon: ShoppingCart,
      roles: ["Retailer", "Manager", "Admin"],
    },
    {
      label: "AI Demand Forecast",
      href: "/dashboard/forecast",
      icon: LineChart,
      roles: ["Retailer", "Manager", "Admin"],
    },
    {
      label: "Smart Reorders",
      href: "/dashboard/reorders",
      icon: RefreshCw,
      roles: ["Retailer", "Manager", "Admin"],
    },
    {
      label: "AI Insights",
      href: "/dashboard/insights",
      icon: Sparkles,
      roles: ["Retailer", "Manager", "Admin"],
    },
    {
      label: "Reports",
      href: "/dashboard/reports",
      icon: FileSpreadsheet,
      roles: ["Retailer", "Manager", "Admin"],
    },
    {
      label: "Admin Panel",
      href: "/dashboard/admin",
      icon: ShieldAlert,
      roles: ["Admin", "Manager"],
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 p-4 flex flex-col justify-between hidden md:flex shrink-0 min-h-[calc(100vh-61px)]">
      <div className="space-y-6">
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Main Menu
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              if (!item.roles.includes(role)) return null;
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#4a5d2e] text-white shadow-xs"
                      : "text-slate-600 hover:bg-[#f4f4f0] hover:text-slate-900"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Role Badge Indicator */}
      <div className="bg-[#f7f7f3] p-3 rounded-xl border border-slate-200 text-xs">
        <p className="text-[11px] font-medium text-slate-500">Active Role Mode</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-slate-800">{role}</span>
        </div>
        <p className="text-[10px] text-slate-500 mt-1">
          {role === "Retailer" && "Full access to inventory & sales logging"}
          {role === "Manager" && "Access to reports & reorder approvals"}
          {role === "Admin" && "Full administrative system control"}
        </p>
      </div>
    </aside>
  );
};
