"use client";

import React, { useEffect, useState } from "react";
import { Product } from "@/types";
import { X, ShoppingBag, CheckCircle, AlertCircle } from "lucide-react";

interface RecordSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RecordSaleModal: React.FC<RecordSaleModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        if (data.products.length > 0) {
          setSelectedProductId(data.products[0].id);
        }
      }
    } catch (err) {
      console.error("Error loading products for sale modal:", err);
    }
  };

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const totalAmount = selectedProduct ? (selectedProduct.sellingPrice * quantity).toFixed(2) : "0.00";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || quantity <= 0) {
      setError("Please select a product and valid quantity");
      return;
    }

    if (selectedProduct && selectedProduct.currentStock < quantity) {
      setError(`Cannot sell ${quantity} units! Only ${selectedProduct.currentStock} in stock.`);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProductId,
          quantity,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Sale logged! ${selectedProduct?.name} stock updated to ${data.updatedProduct.currentStock}`);
        onSuccess();
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setError(data.error || "Failed to record sale");
      }
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-[#4a5d2e]">
            <ShoppingBag className="w-5 h-5" />
            <h2 className="text-base font-bold text-slate-900">Record New Sale (POS)</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-lg flex items-center gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mt-4 p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-2 border border-emerald-200">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Product</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4a5d2e]"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Stock: {p.currentStock} units | ₹{p.sellingPrice.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Quantity Sold</label>
              <input
                type="number"
                min="1"
                max={selectedProduct ? selectedProduct.currentStock : 9999}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4a5d2e]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Selling Price / Unit</label>
              <input
                type="text"
                disabled
                value={`₹${selectedProduct ? selectedProduct.sellingPrice.toFixed(2) : "0.00"}`}
                className="w-full text-xs bg-slate-100 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-600"
              />
            </div>
          </div>

          <div className="p-3 bg-[#f7f7f3] rounded-xl border border-slate-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Total Transaction Value</span>
            <span className="text-base font-extrabold text-[#4a5d2e]">₹{totalAmount}</span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-slate-600 px-4 py-2 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (selectedProduct ? selectedProduct.currentStock < quantity : false)}
              className="bg-[#4a5d2e] hover:bg-[#3f4d22] disabled:opacity-50 text-white text-xs font-bold px-5 py-2 rounded-lg shadow-xs transition-all cursor-pointer"
            >
              {loading ? "Processing..." : "Confirm & Update Stock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
