import { db } from "@/lib/db";
import { calculateProductForecast } from "@/lib/forecasting";
import { generateAIInsights } from "@/lib/insights-engine";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await db.product.findMany({});
    const sales = await db.sale.findMany({});

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
