import { db } from "@/lib/db";
import { calculateProductForecast } from "@/lib/forecasting";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    const products = await db.product.findMany({
      where: productId ? { id: productId } : undefined,
      orderBy: { name: "asc" },
    });

    const forecasts = [];

    for (const prod of products) {
      const salesHistory = await db.sale.findMany({
        where: { productId: prod.id },
        orderBy: { saleDate: "asc" },
      });

      const forecast = calculateProductForecast(prod.id, prod.name, salesHistory);
      forecasts.push(forecast);
    }

    return NextResponse.json({ success: true, forecasts });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
