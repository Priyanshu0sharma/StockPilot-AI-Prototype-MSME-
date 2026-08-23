"use client";

import React, { useEffect, useState } from "react";
import { Product, Sale } from "@/types";
import { FileSpreadsheet, Download, Printer, FileText, CheckCircle2 } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ReportsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    setLoading(true);
    try {
      const [prodRes, salesRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/sales"),
      ]);

      const pData = await prodRes.json();
      const sData = await salesRes.json();

      if (pData.success) setProducts(pData.products);
      if (sData.success) setSales(sData.sales);
    } catch (err) {
      console.error("Failed to load report data:", err);
    } finally {
      setLoading(false);
    }
  };

  // CSV Exporter Utility
  const exportToCSV = (filename: string, rows: (string | number)[][]) => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((row) => row.map((item) => `"${item}"`).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 1. Export Sales CSV
  const handleExportSalesCSV = () => {
    const headers = ["Sale ID", "Product Name", "SKU", "Quantity", "Unit Price (INR)", "Total Amount (INR)", "Sale Date"];
    const rows = sales.map((s) => [
      s.id,
      s.product?.name || "Product",
      s.product?.sku || "-",
      s.quantity,
      s.unitPrice,
      s.totalAmount,
      new Date(s.saleDate).toLocaleDateString("en-IN"),
    ]);
    exportToCSV(`StockPilot_Sales_Report_${Date.now()}.csv`, [headers, ...rows]);
  };

  // 2. Export Inventory CSV
  const handleExportInventoryCSV = () => {
    const headers = ["SKU", "Product Name", "Category", "Buy Price", "Sell Price", "Current Stock", "Min Safety Stock", "Supplier"];
    const rows = products.map((p) => [
      p.sku,
      p.name,
      p.category,
      p.purchasePrice,
      p.sellingPrice,
      p.currentStock,
      p.minStockLevel,
      p.supplierName,
    ]);
    exportToCSV(`StockPilot_Inventory_Valuation_${Date.now()}.csv`, [headers, ...rows]);
  };

  // PDF Generator using jsPDF + autoTable
  const handleDownloadPDFReport = (type: "sales" | "inventory") => {
    const doc = new jsPDF();
    const title = type === "sales" ? "StockPilot AI - Sales Transaction Report" : "StockPilot AI - Inventory Valuation Report";

    doc.setFontSize(16);
    doc.setTextColor(74, 93, 46); // Olive Green
    doc.text(title, 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleString("en-IN")}`, 14, 27);

    if (type === "sales") {
      const tableHeaders = [["Product Name", "SKU", "Qty", "Unit Price", "Total (INR)", "Date"]];
      const tableData = sales.map((s) => [
        s.product?.name || "Product",
        s.product?.sku || "-",
        s.quantity,
        `₹${s.unitPrice.toFixed(2)}`,
        `₹${s.totalAmount.toFixed(2)}`,
        new Date(s.saleDate).toLocaleDateString("en-IN"),
      ]);

      autoTable(doc, {
        startY: 32,
        head: tableHeaders,
        body: tableData,
        headStyles: { fillColor: [74, 93, 46] },
      });
    } else {
      const tableHeaders = [["SKU", "Product Name", "Category", "Stock", "Min Stock", "Sell Price", "Valuation (INR)"]];
      const tableData = products.map((p) => [
        p.sku,
        p.name,
        p.category,
        p.currentStock,
        p.minStockLevel,
        `₹${p.sellingPrice.toFixed(2)}`,
        `₹${(p.currentStock * p.sellingPrice).toFixed(2)}`,
      ]);

      autoTable(doc, {
        startY: 32,
        head: tableHeaders,
        body: tableData,
        headStyles: { fillColor: [74, 93, 46] },
      });
    }

    doc.save(`StockPilot_${type}_report.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">MSME Retail Reports & Exports</h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate and export official audit reports, sales ledgers, and inventory valuation docs in CSV or PDF.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs font-semibold text-slate-500">
          Loading report datasets...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Sales Report */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl w-fit">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Sales Ledger Report</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Complete log of customer transactions, sales revenue, quantities sold, and unit prices.
              </p>
              <div className="text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                Total Transactions: <strong>{sales.length}</strong>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <button
                onClick={handleExportSalesCSV}
                className="w-full bg-[#4a5d2e] hover:bg-[#3f4d22] text-white text-xs font-bold py-2 rounded-lg shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Export Sales CSV
              </button>
              <button
                onClick={() => handleDownloadPDFReport("sales")}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" /> Download PDF Report
              </button>
            </div>
          </div>

          {/* Card 2: Inventory Valuation Report */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="p-2.5 bg-blue-50 text-blue-800 rounded-xl w-fit">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Inventory Valuation Report</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Complete breakdown of store catalog items, stock levels, safety stock thresholds, and asset valuation.
              </p>
              <div className="text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                Total Catalog Items: <strong>{products.length}</strong>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <button
                onClick={handleExportInventoryCSV}
                className="w-full bg-[#4a5d2e] hover:bg-[#3f4d22] text-white text-xs font-bold py-2 rounded-lg shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Export Inventory CSV
              </button>
              <button
                onClick={() => handleDownloadPDFReport("inventory")}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" /> Download PDF Report
              </button>
            </div>
          </div>

          {/* Card 3: Demand Forecast Report */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="p-2.5 bg-[#f0f4e8] text-[#4a5d2e] rounded-xl w-fit">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Demand Forecast Summary</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Export 7-day and 30-day AI predicted sales requirements per product category.
              </p>
              <div className="text-xs font-semibold text-[#4a5d2e] bg-[#f0f4e8] p-2.5 rounded-lg border border-[#4a5d2e]/20">
                Model: Statistical Time-Series AI
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <button
                onClick={handleExportInventoryCSV}
                className="w-full bg-[#4a5d2e] hover:bg-[#3f4d22] text-white text-xs font-bold py-2 rounded-lg shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Export Forecast CSV
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
