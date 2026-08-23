"use client";

import React, { useState } from "react";
import { RoleSwitcher } from "./role-switcher";
import { useRole } from "@/context/RoleContext";
import { TrendingUp, PlusCircle, User, Bell } from "lucide-react";
import { RecordSaleModal } from "./modals/record-sale-modal";

export const Navbar: React.FC<{ onSaleSuccess?: () => void }> = ({ onSaleSuccess }) => {
  const { role, userName, userEmail } = useRole();
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200/80 px-4 md:px-6 py-3">
        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="bg-[#4a5d2e] text-white p-2 rounded-xl flex items-center justify-center shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-lg tracking-tight">StockPilot AI</span>
                <span className="bg-[#f0f4e8] text-[#4a5d2e] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#4a5d2e]/20 uppercase">
                  MSME SaaS
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">AI Demand Forecasting & Inventory Engine</p>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Quick POS Record Sale Button (Available for Retailer & Manager) */}
            {role !== "Admin" && (
              <button
                onClick={() => setIsSaleModalOpen(true)}
                className="bg-[#4a5d2e] hover:bg-[#3f4d22] text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Record Sale</span>
              </button>
            )}

            {/* Role Switcher */}
            <RoleSwitcher />

            {/* User Profile Badge */}
            <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-[#f0f4e8] text-[#4a5d2e] font-bold text-xs flex items-center justify-center border border-[#4a5d2e]/30">
                {userName.charAt(0)}
              </div>
              <div className="text-left text-xs">
                <p className="font-semibold text-slate-800 leading-tight">{userName}</p>
                <p className="text-[11px] text-slate-500 capitalize">{role} Account</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* POS Quick Record Sale Modal */}
      {isSaleModalOpen && (
        <RecordSaleModal
          isOpen={isSaleModalOpen}
          onClose={() => setIsSaleModalOpen(false)}
          onSuccess={() => {
            if (onSaleSuccess) onSaleSuccess();
          }}
        />
      )}
    </>
  );
};
