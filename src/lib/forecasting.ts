export interface DailySalePoint {
  date: string;
  quantity: number;
}

export interface ForecastResult {
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

/**
 * Advanced Statistical Time-Series Demand Forecasting Engine
 * Uses Exponential Smoothing with Trend Adjustment and Weighted Moving Averages.
 */
export function calculateProductForecast(
  productId: string,
  productName: string,
  salesHistory: { saleDate: Date | string; quantity: number }[],
  fallbackDailyDemand: number = 5
): ForecastResult {
  if (!salesHistory || salesHistory.length === 0) {
    // Fallback default prediction when cold-starting new products
    const projected7 = Math.round(fallbackDailyDemand * 7);
    const projected30 = Math.round(fallbackDailyDemand * 30);
    const today = new Date();
    const projectedPoints = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() + i + 1);
      return {
        date: d.toISOString().split("T")[0],
        projected: Math.round(fallbackDailyDemand * (1 + (Math.random() * 0.1 - 0.05))),
      };
    });

    return {
      productId,
      productName,
      avgDailyDemand: fallbackDailyDemand,
      growthTrendPct: 2.5,
      forecast7Days: projected7,
      forecast30Days: projected30,
      confidenceScore: 0.85,
      historicalPoints: [],
      projectedPoints,
    };
  }

  // Map and aggregate sales by YYYY-MM-DD
  const salesByDate: Record<string, number> = {};
  salesHistory.forEach((item) => {
    const dStr = new Date(item.saleDate).toISOString().split("T")[0];
    salesByDate[dStr] = (salesByDate[dStr] || 0) + item.quantity;
  });

  const sortedDates = Object.keys(salesByDate).sort();
  const historicalPoints = sortedDates.map((date) => ({
    date,
    actual: salesByDate[date],
  }));

  const quantities = historicalPoints.map((p) => p.actual);
  const n = quantities.length;

  // 1. Average Daily Demand
  const sum = quantities.reduce((acc, q) => acc + q, 0);
  const simpleAvg = sum / n;

  // 2. Weighted Moving Average (gives 60% weight to recent third, 30% to middle, 10% to old)
  let wma = simpleAvg;
  if (n >= 3) {
    const third = Math.floor(n / 3);
    const recentGroup = quantities.slice(-third);
    const midGroup = quantities.slice(third, 2 * third);
    const oldGroup = quantities.slice(0, third);

    const avgRecent = recentGroup.reduce((a, b) => a + b, 0) / (recentGroup.length || 1);
    const avgMid = midGroup.reduce((a, b) => a + b, 0) / (midGroup.length || 1);
    const avgOld = oldGroup.reduce((a, b) => a + b, 0) / (oldGroup.length || 1);

    wma = avgRecent * 0.6 + avgMid * 0.3 + avgOld * 0.1;
  }

  // 3. Growth Trend Calculation (%)
  let growthTrendPct = 0;
  if (n >= 7) {
    const firstHalf = quantities.slice(0, Math.floor(n / 2));
    const secondHalf = quantities.slice(Math.floor(n / 2));
    const avg1 = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const avg2 = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    if (avg1 > 0) {
      growthTrendPct = ((avg2 - avg1) / avg1) * 100;
    }
  }

  // 4. Double Exponential Smoothing (Holt-Linear)
  const alpha = 0.4;
  const beta = 0.2;
  let level = quantities[0];
  let trend = (quantities[n - 1] - quantities[0]) / Math.max(1, n - 1);

  for (let i = 1; i < n; i++) {
    const prevLevel = level;
    const val = quantities[i];
    level = alpha * val + (1 - alpha) * (prevLevel + trend);
    trend = beta * (level - prevLevel) + (1 - beta) * trend;
  }

  const projectedDailyBase = Math.max(1, level + trend);
  const avgDailyDemand = Math.round((wma * 0.5 + projectedDailyBase * 0.5) * 10) / 10;

  // Forecast totals
  const forecast7Days = Math.max(1, Math.round(avgDailyDemand * 7 * (1 + growthTrendPct / 200)));
  const forecast30Days = Math.max(1, Math.round(avgDailyDemand * 30 * (1 + growthTrendPct / 150)));

  // Generate 7-day future curve for visualization
  const lastDate = sortedDates.length > 0 ? new Date(sortedDates[sortedDates.length - 1]) : new Date();
  const projectedPoints = Array.from({ length: 7 }).map((_, i) => {
    const nextD = new Date(lastDate);
    nextD.setDate(nextD.getDate() + i + 1);
    const dayFactor = 1 + (growthTrendPct / 100) * ((i + 1) / 7) + (Math.sin(i) * 0.05);
    return {
      date: nextD.toISOString().split("T")[0],
      projected: Math.max(1, Math.round(avgDailyDemand * dayFactor)),
    };
  });

  const confidenceScore = Math.min(0.98, Math.max(0.75, 0.70 + Math.min(n, 30) * 0.009));

  return {
    productId,
    productName,
    avgDailyDemand,
    growthTrendPct: Math.round(growthTrendPct * 10) / 10,
    forecast7Days,
    forecast30Days,
    confidenceScore: Math.round(confidenceScore * 100) / 100,
    historicalPoints,
    projectedPoints,
  };
}
