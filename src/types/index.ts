export type UserRole = "Retailer" | "Manager" | "Admin";

export interface User {
  id: string;
  clerkId?: string | null;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  purchasePrice: number;
  sellingPrice: number;
  currentStock: number;
  minStockLevel: number;
  supplierName: string;
  expiryDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Sale {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  saleDate: string;
  createdAt?: string;
}

export interface ForecastData {
  id?: string;
  productId: string;
  productName: string;
  avgDailyDemand: number;
  growthTrendPct: number;
  forecast7Days: number;
  forecast30Days: number;
  confidenceScore: number;
  historicalPoints: { date: string; actual: number }[];
  projectedPoints: { date: string; projected: number }[];
}

export interface ReorderRecommendation {
  id: string;
  productId: string;
  product?: Product;
  currentStock: number;
  predictedDemand: number;
  safetyStock: number;
  recommendedOrder: number;
  urgency: "High" | "Medium" | "Low";
  status: "Pending" | "Approved" | "Rejected" | "Fulfilled";
  createdAt: string;
}
