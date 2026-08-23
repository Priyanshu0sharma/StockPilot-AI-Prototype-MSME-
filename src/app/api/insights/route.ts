import { db } from "@/lib/db";
import { ensureAutoSeeded } from "@/lib/auto-seed";
import { INITIAL_PRODUCTS, INITIAL_SALES } from "@/lib/demo-data";
import { calculateProductForecast } from "@/lib/forecasting";
import { generateAIInsights } from "@/lib/insights-engine";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await ensureAutoSeeded();
    let products = await db.product.findMany({}).catch(() => []);
    let sales = await db.sale.findMany({}).catch(() => []);

    if (!products || products.length === 0) products = INITIAL_PRODUCTS as any;
    if (!sales || sales.length === 0) sales = INITIAL_SALES as any;

    const forecasts = [];
    for (const prod of products) {
      const prodSales = sales.filter((s) => s.productId === prod.id);
      const forecast = calculateProductForecast(prod.id, prod.name, prodSales);
      forecasts.push(forecast);
    }

    const insights = generateAIInsights(products, forecasts, sales);

    return NextResponse.json({ success: true, insights });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
