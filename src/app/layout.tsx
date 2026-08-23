import type { Metadata } from "next";
import "./globals.css";
import { RoleProvider } from "@/context/RoleContext";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";

export const metadata: Metadata = {
  title: "StockPilot AI - MSME Demand Forecasting & Inventory SaaS",
  description:
    "AI-Powered Inventory Demand Forecasting & Smart Reorder System for MSME Retailers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#f9f9f7] text-slate-900 antialiased min-h-screen">
        <RoleProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex flex-1 max-w-7xl w-full mx-auto">
              <Sidebar />
              <main className="flex-1 p-4 md:p-6 overflow-x-hidden">{children}</main>
            </div>
          </div>
        </RoleProvider>
      </body>
    </html>
  );
}
