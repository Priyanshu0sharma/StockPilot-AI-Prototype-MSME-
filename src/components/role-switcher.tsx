"use client";

import React from "react";
import { useRole } from "@/context/RoleContext";
import { UserRole } from "@/types";
import { ShieldCheck, Store, UserCheck } from "lucide-react";

export const RoleSwitcher: React.FC = () => {
  const { role, setRole } = useRole();

  const roles: { id: UserRole; label: string; icon: any }[] = [
    { id: "Retailer", label: "Retailer", icon: Store },
    { id: "Manager", label: "Manager", icon: UserCheck },
    { id: "Admin", label: "Admin", icon: ShieldCheck },
  ];

  return (
    <div className="flex items-center gap-1 bg-[#eeeee9] p-1 rounded-lg border border-slate-200">
      <span className="text-xs font-medium text-slate-500 px-2 hidden md:inline">Demo Role:</span>
      {roles.map((r) => {
        const Icon = r.icon;
        const isActive = role === r.id;
        return (
          <button
            key={r.id}
            onClick={() => setRole(r.id)}
            className={`flex items-center gap-1.5 px-3 py-1.2 rounded-md text-xs font-semibold transition-all ${
              isActive
                ? "bg-[#4a5d2e] text-white shadow-xs"
                : "text-slate-700 hover:bg-slate-200/70"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {r.label}
          </button>
        );
      })}
    </div>
  );
};
