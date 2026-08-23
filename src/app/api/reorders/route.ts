import { db } from "@/lib/db";
import { calculateProductForecast } from "@/lib/forecasting";
import { calculateSmartReorder } from "@/lib/reorder-engine";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await db.product.findMany({
      orderBy: { name: "asc" },
    });

    const recommendations = [];

    for (const prod of products) {
      const salesHistory = await db.sale.findMany({
        where: { productId: prod.id },
        orderBy: { saleDate: "asc" },
      });

      const forecast = calculateProductForecast(prod.id, prod.name, salesHistory);
      const reorderRes = calculateSmartReorder({
        id: prod.id,
        name: prod.name,
        category: prod.category,
        sku: prod.sku,
        currentStock: prod.currentStock,
        minStockLevel: prod.minStockLevel,
        purchasePrice: prod.purchasePrice,
        supplierName: prod.supplierName,
        forecast30Days: forecast.forecast30Days,
        avgDailyDemand: forecast.avgDailyDemand,
      });

      // Find existing DB record status if available
      const dbRec = await db.recommendation.findFirst({
        where: { productId: prod.id },
        orderBy: { createdAt: "desc" },
      });

      recommendations.push({
        ...reorderRes,
        dbId: dbRec?.id,
        status: dbRec ? dbRec.status : reorderRes.urgency === "High" ? "Pending" : "Approved",
      });
    }

    return NextResponse.json({ success: true, recommendations });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { productId, status, recommendedOrder } = body;

    if (!productId || !status) {
      return NextResponse.json(
        { success: false, error: "productId and status are required" },
        { status: 400 }
      );
    }

    const existing = await db.recommendation.findFirst({
      where: { productId },
    });

    let updated;
    if (existing) {
      updated = await db.recommendation.update({
        where: { id: existing.id },
        data: { status },
      });
    } else {
      updated = await db.recommendation.create({
        data: {
          productId,
          currentStock: 0,
          predictedDemand: 0,
          safetyStock: 0,
          recommendedOrder: recommendedOrder || 50,
          urgency: "Medium",
          status,
        },
      });
    }

    // If status is set to Fulfilled, automatically replenish product stock in DB!
    if (status === "Fulfilled") {
      const prod = await db.product.findUnique({ where: { id: productId } });
      if (prod) {
        await db.product.update({
          where: { id: productId },
          data: {
            currentStock: prod.currentStock + (recommendedOrder || 50),
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      recommendation: updated,
      message: `Reorder status updated to ${status}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
