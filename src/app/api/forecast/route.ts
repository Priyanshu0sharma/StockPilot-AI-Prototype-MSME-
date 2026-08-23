import { db } from "@/lib/db";
import { ensureAutoSeeded } from "@/lib/auto-seed";
import { INITIAL_PRODUCTS, INITIAL_SALES } from "@/lib/demo-data";
import { calculateProductForecast } from "@/lib/forecasting";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await ensureAutoSeeded();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    let products = await db.product.findMany({
      where: productId ? { id: productId } : undefined,
      orderBy: { name: "asc" },
    }).catch(() => []);

    if (!products || products.length === 0) {
      products = INITIAL_PRODUCTS as any;
      if (productId) {
        products = products.filter((p) => p.id === productId);
      }
    }

    const forecasts = [];

    for (const prod of products) {
      let salesHistory = await db.sale.findMany({
        where: { productId: prod.id },
        orderBy: { saleDate: "asc" },
      }).catch(() => []);

      if (!salesHistory || salesHistory.length === 0) {
        salesHistory = INITIAL_SALES.filter((s) => s.productId === prod.id) as any;
      }

      const forecast = calculateProductForecast(prod.id, prod.name, salesHistory);
      forecasts.push(forecast);
    }

    return NextResponse.json({ success: true, forecasts });
  } catch (error: any) {
    return NextResponse.json({ success: true, forecasts: [] });
  }
}
