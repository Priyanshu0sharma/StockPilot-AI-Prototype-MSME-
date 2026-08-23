import { db } from "@/lib/db";
import { ensureAutoSeeded } from "@/lib/auto-seed";
import { calculateProductForecast } from "@/lib/forecasting";
import { calculateSmartReorder } from "@/lib/reorder-engine";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await ensureAutoSeeded();
    const users = await db.user.findMany({ orderBy: { createdAt: "desc" } });
    const productCount = await db.product.count();
    const salesCount = await db.sale.count();
    const recommendationCount = await db.recommendation.count();

    const salesAggregate = await db.sale.aggregate({
      _sum: { totalAmount: true },
    });

    return NextResponse.json({
      success: true,
      users,
      analytics: {
        totalUsers: users.length,
        totalProducts: productCount,
        totalSalesCount: salesCount,
        totalRevenue: Math.round((salesAggregate._sum.totalAmount || 0) * 100) / 100,
        activeRecommendations: recommendationCount,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // 1. Clear existing data
    await db.recommendation.deleteMany({});
    await db.forecast.deleteMany({});
    await db.sale.deleteMany({});
    await db.product.deleteMany({});
    await db.user.deleteMany({});

    // 2. Create Users
    await db.user.create({
      data: {
        clerkId: "user_retailer_demo",
        name: "Ramesh Sharma (Retailer)",
        email: "retailer@stockpilot.ai",
        role: "Retailer",
      },
    });

    await db.user.create({
      data: {
        clerkId: "user_manager_demo",
        name: "Anita Gupta (Manager)",
        email: "manager@stockpilot.ai",
        role: "Manager",
      },
    });

    await db.user.create({
      data: {
        clerkId: "user_admin_demo",
        name: "Suresh Kumar (Admin)",
        email: "admin@stockpilot.ai",
        role: "Admin",
      },
    });

    // 3. Products
    const productsData = [
      {
        name: "Parle-G Gold Biscuit 100g",
        category: "Packaged Food",
        sku: "SKU-PARLE-100",
        purchasePrice: 8.5,
        sellingPrice: 10.0,
        currentStock: 85,
        minStockLevel: 50,
        supplierName: "Parle Products Pvt Ltd",
      },
      {
        name: "Maggi 2-Minute Noodles 70g",
        category: "Packaged Food",
        sku: "SKU-MAGGI-70",
        purchasePrice: 11.5,
        sellingPrice: 14.0,
        currentStock: 32,
        minStockLevel: 60,
        supplierName: "Nestle India Ltd",
      },
      {
        name: "Tata Salt Iodized 1kg",
        category: "Groceries",
        sku: "SKU-TATA-SALT",
        purchasePrice: 22.0,
        sellingPrice: 28.0,
        currentStock: 140,
        minStockLevel: 40,
        supplierName: "Tata Consumer Products",
      },
      {
        name: "Fortune Sunlite Oil 1L",
        category: "Groceries",
        sku: "SKU-FORTUNE-1L",
        purchasePrice: 125.0,
        sellingPrice: 145.0,
        currentStock: 22,
        minStockLevel: 30,
        supplierName: "Adani Wilmar Ltd",
      },
      {
        name: "Amul Butter 100g",
        category: "Dairy",
        sku: "SKU-AMUL-100G",
        purchasePrice: 50.0,
        sellingPrice: 58.0,
        currentStock: 18,
        minStockLevel: 35,
        supplierName: "Gujarat Milk Federation",
      },
      {
        name: "Dettol Soap 125g",
        category: "Personal Care",
        sku: "SKU-DETTOL-125",
        purchasePrice: 32.0,
        sellingPrice: 42.0,
        currentStock: 65,
        minStockLevel: 25,
        supplierName: "Reckitt Benckiser",
      },
      {
        name: "Cadbury Dairy Milk 60g",
        category: "Confectionery",
        sku: "SKU-CADBURY-60",
        purchasePrice: 65.0,
        sellingPrice: 85.0,
        currentStock: 50,
        minStockLevel: 20,
        supplierName: "Mondelez India Pvt Ltd",
      },
      {
        name: "Surf Excel Washing Powder 1kg",
        category: "Household",
        sku: "SKU-SURF-1KG",
        purchasePrice: 115.0,
        sellingPrice: 142.0,
        currentStock: 15,
        minStockLevel: 30,
        supplierName: "Hindustan Unilever Ltd",
      },
    ];

    const createdProducts = [];
    for (const p of productsData) {
      const prod = await db.product.create({ data: p });
      createdProducts.push(prod);
    }

    // 4. Generate 30 days of sales history
    const today = new Date();
    for (const prod of createdProducts) {
      let baseDemand = 8;
      if (prod.sku.includes("PARLE") || prod.sku.includes("MAGGI")) baseDemand = 18;
      if (prod.sku.includes("SALT") || prod.sku.includes("DETTOL")) baseDemand = 12;

      for (let dayOffset = 30; dayOffset >= 1; dayOffset--) {
        const saleDate = new Date(today);
        saleDate.setDate(saleDate.getDate() - dayOffset);
        const dayOfWeek = saleDate.getDay();
        const weekendMultiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 1.35 : 1.0;
        const noise = Math.random() * 0.4 - 0.2;

        const dailyQty = Math.max(
          1,
          Math.round(baseDemand * weekendMultiplier * (1 + noise))
        );

        await db.sale.create({
          data: {
            productId: prod.id,
            quantity: dailyQty,
            unitPrice: prod.sellingPrice,
            totalAmount: Math.round(dailyQty * prod.sellingPrice * 100) / 100,
            saleDate,
          },
        });
      }
    }

    // 5. Generate Forecasts & Recommendations
    for (const prod of createdProducts) {
      const history = await db.sale.findMany({
        where: { productId: prod.id },
        orderBy: { saleDate: "asc" },
      });

      const forecastRes = calculateProductForecast(prod.id, prod.name, history);

      await db.forecast.create({
        data: {
          productId: prod.id,
          forecastDate: new Date(),
          forecast7Days: forecastRes.forecast7Days,
          forecast30Days: forecastRes.forecast30Days,
          confidenceScore: forecastRes.confidenceScore,
        },
      });

      const reorderRes = calculateSmartReorder({
        id: prod.id,
        name: prod.name,
        category: prod.category,
        sku: prod.sku,
        currentStock: prod.currentStock,
        minStockLevel: prod.minStockLevel,
        purchasePrice: prod.purchasePrice,
        supplierName: prod.supplierName,
        forecast30Days: forecastRes.forecast30Days,
        avgDailyDemand: forecastRes.avgDailyDemand,
      });

      if (reorderRes.recommendedOrderQuantity > 0) {
        await db.recommendation.create({
          data: {
            productId: prod.id,
            currentStock: reorderRes.currentStock,
            predictedDemand: reorderRes.predictedDemand30Days,
            safetyStock: reorderRes.safetyStock,
            recommendedOrder: reorderRes.recommendedOrderQuantity,
            urgency: reorderRes.urgency,
            status: reorderRes.urgency === "High" ? "Pending" : "Approved",
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Database re-seeded with fresh MSME retail sample data",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
