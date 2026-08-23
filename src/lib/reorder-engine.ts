export interface ProductReorderInput {
  id: string;
  name: string;
  category: string;
  sku: string;
  currentStock: number;
  minStockLevel: number;
  purchasePrice: number;
  supplierName: string;
  forecast30Days: number;
  avgDailyDemand: number;
}

export interface ReorderRecommendationResult {
  productId: string;
  productName: string;
  category: string;
  sku: string;
  currentStock: number;
  minStockLevel: number;
  predictedDemand30Days: number;
  safetyStock: number;
  requiredStockTotal: number;
  recommendedOrderQuantity: number;
  estimatedCost: number;
  daysUntilStockout: number;
  urgency: "High" | "Medium" | "Low";
  reason: string;
  supplierName: string;
}

/**
 * Smart Reorder Recommendation Engine
 * Calculates optimal purchase reorder requirements based on predicted demand + safety buffer.
 */
export function calculateSmartReorder(
  product: ProductReorderInput
): ReorderRecommendationResult {
  const safetyStock = product.minStockLevel;
  const predictedDemand = product.forecast30Days;
  const requiredStockTotal = predictedDemand + safetyStock;

  const rawRecommended = requiredStockTotal - product.currentStock;
  const recommendedOrderQuantity = Math.max(0, Math.ceil(rawRecommended));

  const dailyDemand = Math.max(0.1, product.avgDailyDemand);
  const daysUntilStockout = Math.max(0, Math.floor(product.currentStock / dailyDemand));

  let urgency: "High" | "Medium" | "Low" = "Low";
  let reason = "Stock level is stable.";

  if (product.currentStock <= product.minStockLevel || daysUntilStockout <= 5) {
    urgency = "High";
    reason = `Critical: Stock is at ${product.currentStock} units. Projected stockout in ${daysUntilStockout} days!`;
  } else if (product.currentStock <= product.minStockLevel * 1.5 || daysUntilStockout <= 12) {
    urgency = "Medium";
    reason = `Warning: Stock is approaching minimum threshold (${product.minStockLevel} units).`;
  } else if (recommendedOrderQuantity > 0) {
    urgency = "Low";
    reason = `Proactive order to meet upcoming 30-day forecast demand of ${predictedDemand} units.`;
  }

  const estimatedCost = recommendedOrderQuantity * product.purchasePrice;

  return {
    productId: product.id,
    productName: product.name,
    category: product.category,
    sku: product.sku,
    currentStock: product.currentStock,
    minStockLevel: product.minStockLevel,
    predictedDemand30Days: predictedDemand,
    safetyStock,
    requiredStockTotal,
    recommendedOrderQuantity,
    estimatedCost: Math.round(estimatedCost * 100) / 100,
    daysUntilStockout,
    urgency,
    reason,
    supplierName: product.supplierName,
  };
}
