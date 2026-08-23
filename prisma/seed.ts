import { db } from "../src/lib/db";
import { calculateProductForecast } from "../src/lib/forecasting";
import { calculateSmartReorder } from "../src/lib/reorder-engine";

async function main() {
  console.log("🌱 Starting StockPilot AI database seeding...");

  // 1. Clear existing data
  await db.recommendation.deleteMany({});
  await db.forecast.deleteMany({});
  await db.sale.deleteMany({});
  await db.product.deleteMany({});
  await db.user.deleteMany({});

  // 2. Create Users
  const retailer = await db.user.create({
    data: {
      clerkId: "user_retailer_demo",
      name: "Ramesh Sharma (Retailer)",
      email: "retailer@stockpilot.ai",
      role: "Retailer",
    },
  });

  const manager = await db.user.create({
    data: {
      clerkId: "user_manager_demo",
      name: "Anita Gupta (Manager)",
      email: "manager@stockpilot.ai",
      role: "Manager",
    },
  });

  const admin = await db.user.create({
    data: {
      clerkId: "user_admin_demo",
      name: "Suresh Kumar (Admin)",
      email: "admin@stockpilot.ai",
      role: "Admin",
    },
  });

  console.log("✅ Created users: Retailer, Manager, Admin");

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
      expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
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
      expiryDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
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
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
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
      expiryDate: new Date(Date.now() + 240 * 24 * 60 * 60 * 1000),
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
      expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
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
      expiryDate: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000),
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
      expiryDate: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000),
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
      expiryDate: new Date(Date.now() + 500 * 24 * 60 * 60 * 1000),
    },
  ];

  const createdProducts = [];
  for (const p of productsData) {
    const prod = await db.product.create({ data: p });
    createdProducts.push(prod);
  }
  console.log(`✅ Created ${createdProducts.length} MSME products`);

  // 4. Generate 30 days of realistic sales history
  const today = new Date();
  const salesToCreate = [];

  for (const prod of createdProducts) {
    // Base daily demand depending on product type
    let baseDemand = 8;
    if (prod.sku.includes("PARLE") || prod.sku.includes("MAGGI")) baseDemand = 18;
    if (prod.sku.includes("SALT") || prod.sku.includes("DETTOL")) baseDemand = 12;
    if (prod.sku.includes("FORTUNE") || prod.sku.includes("SURF")) baseDemand = 5;

    for (let dayOffset = 30; dayOffset >= 1; dayOffset--) {
      const saleDate = new Date(today);
      saleDate.setDate(saleDate.getDate() - dayOffset);

      // Add day-of-week variation (weekends sell ~30% more)
      const dayOfWeek = saleDate.getDay();
      const weekendMultiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 1.35 : 1.0;
      // Slight upward growth trend for recent days
      const trendMultiplier = 1 + (30 - dayOffset) * 0.01;
      const noise = (Math.random() * 0.4 - 0.2); // +/- 20% random variation

      const dailyQty = Math.max(
        1,
        Math.round(baseDemand * weekendMultiplier * trendMultiplier * (1 + noise))
      );

      salesToCreate.push({
        productId: prod.id,
        quantity: dailyQty,
        unitPrice: prod.sellingPrice,
        totalAmount: Math.round(dailyQty * prod.sellingPrice * 100) / 100,
        saleDate,
      });
    }
  }

  for (const s of salesToCreate) {
    await db.sale.create({ data: s });
  }
  console.log(`✅ Generated ${salesToCreate.length} sales transaction records over 30 days`);

  // 5. Generate Initial AI Forecasts & Smart Reorder Suggestions
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

  console.log("✅ Seeded AI Forecasts and Smart Reorder Suggestions");
  console.log("🎉 StockPilot AI database seeding complete!");
}

main()
  .then(async () => {
    process.exit(0);
  })
  .catch(async (e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  });
