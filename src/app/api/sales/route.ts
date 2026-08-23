import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sales = await db.sale.findMany({
      include: { product: true },
      orderBy: { saleDate: "desc" },
      take: 100,
    });

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date(now);
    monthStart.setDate(monthStart.getDate() - 30);

    let dailyRevenue = 0;
    let weeklyRevenue = 0;
    let monthlyRevenue = 0;

    let dailyUnits = 0;
    let weeklyUnits = 0;
    let monthlyUnits = 0;

    sales.forEach((s) => {
      const sDate = new Date(s.saleDate);
      if (sDate >= todayStart) {
        dailyRevenue += s.totalAmount;
        dailyUnits += s.quantity;
      }
      if (sDate >= weekStart) {
        weeklyRevenue += s.totalAmount;
        weeklyUnits += s.quantity;
      }
      if (sDate >= monthStart) {
        monthlyRevenue += s.totalAmount;
        monthlyUnits += s.quantity;
      }
    });

    return NextResponse.json({
      success: true,
      sales,
      metrics: {
        dailyRevenue: Math.round(dailyRevenue * 100) / 100,
        weeklyRevenue: Math.round(weeklyRevenue * 100) / 100,
        monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
        dailyUnits,
        weeklyUnits,
        monthlyUnits,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, quantity, saleDate } = body;

    if (!productId || !quantity || quantity <= 0) {
      return NextResponse.json(
        { success: false, error: "Valid productId and positive quantity are required" },
        { status: 400 }
      );
    }

    // Fetch product to verify stock
    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    if (product.currentStock < quantity) {
      return NextResponse.json(
        {
          success: false,
          error: `Insufficient stock! Only ${product.currentStock} units available, but attempted to sell ${quantity} units.`,
        },
        { status: 400 }
      );
    }

    const qty = parseInt(quantity);
    const unitPrice = product.sellingPrice;
    const totalAmount = Math.round(qty * unitPrice * 100) / 100;
    const dateToUse = saleDate ? new Date(saleDate) : new Date();

    // Perform transaction: Create Sale AND Decrement Stock Instantly
    const [sale, updatedProduct] = await db.$transaction([
      db.sale.create({
        data: {
          productId,
          quantity: qty,
          unitPrice,
          totalAmount,
          saleDate: dateToUse,
        },
      }),
      db.product.update({
        where: { id: productId },
        data: {
          currentStock: product.currentStock - qty,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      sale,
      updatedProduct,
      message: `Sale recorded successfully! Stock reduced from ${product.currentStock} to ${updatedProduct.currentStock}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
