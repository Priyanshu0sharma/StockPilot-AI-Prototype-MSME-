"use client";

import React, { useState } from "react";
import { useRole } from "@/context/RoleContext";
import { Sparkles, RefreshCw, Info, ChevronRight, X } from "lucide-react";

interface DemoBannerProps {
  onOpenGuide: () => void;
  onReseed?: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ onOpenGuide, onReseed }) => {
  const { role, userName } = useRole();
  const [dismissed, setDismissed] = useState(false);
  const [reseeding, setReseeding] = useState(false);

  if (dismissed) return null;

  const handleReseedClick = async () => {
    if (onReseed) {
      setReseeding(true);
      await onReseed();
      setReseeding(false);
    } else {
      try {
        setReseeding(true);
        const res = await fetch("/api/admin", { method: "POST" });
        const data = await res.json();
        if (data.success) {
          alert("Database re-seeded with fresh 30-day MSME sales history!");
          window.location.reload();
        }
      } catch (err) {
        console.error(err);
      } finally {
        setReseeding(false);
      }
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#2c3919] via-[#3a4a20] to-[#4a5d2e] text-white p-4 rounded-2xl shadow-xs border border-white/10 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Decorative background glow */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-start md:items-center gap-3 relative z-10">
        <div className="bg-white/15 p-2.5 rounded-xl border border-white/20 shrink-0">
          <Sparkles className="w-5 h-5 text-amber-300" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm tracking-tight">StockPilot AI Prototype Demo Mode</span>
            <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase">
              {role} Account ({userName})
            </span>
          </div>
          <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">
            Pre-loaded with 8 Indian retail SKUs and 30-day simulated sales. Switch roles or open the Demo Details guide.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 relative z-10 shrink-0 self-end md:self-auto">
        <button
          onClick={onOpenGuide}
          className="bg-white/15 hover:bg-white/25 text-white text-xs font-bold px-3.5 py-2 rounded-xl border border-white/25 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
        >
          <Info className="w-4 h-4 text-amber-300" />
          <span>Demo Details & Guide</span>
          <ChevronRight className="w-3.5 h-3.5 opacity-80" />
        </button>

        <button
          onClick={handleReseedClick}
          disabled={reseeding}
          className="bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${reseeding ? "animate-spin" : ""}`} />
          <span>Re-Seed Data</span>
        </button>

        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors ml-1 cursor-pointer"
          title="Dismiss Banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
