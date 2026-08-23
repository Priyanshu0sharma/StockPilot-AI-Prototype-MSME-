import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const whereClause: any = {};
    if (category && category !== "All") {
      whereClause.category = category;
    }
    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { sku: { contains: search } },
        { supplierName: { contains: search } },
      ];
    }

    const products = await db.product.findMany({
      where: whereClause,
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ success: true, products });
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
    const {
      name,
      category,
      sku,
      purchasePrice,
      sellingPrice,
      currentStock,
      minStockLevel,
      supplierName,
      expiryDate,
    } = body;

    if (!name || !sku || !category) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (name, SKU, category)" },
        { status: 400 }
      );
    }

    const existingSKU = await db.product.findUnique({ where: { sku } });
    if (existingSKU) {
      return NextResponse.json(
        { success: false, error: "Product SKU already exists" },
        { status: 400 }
      );
    }

    const product = await db.product.create({
      data: {
        name,
        category,
        sku,
        purchasePrice: parseFloat(purchasePrice) || 0,
        sellingPrice: parseFloat(sellingPrice) || 0,
        currentStock: parseInt(currentStock) || 0,
        minStockLevel: parseInt(minStockLevel) || 10,
        supplierName: supplierName || "Direct Supplier",
        expiryDate: expiryDate ? new Date(expiryDate) : null,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      name,
      category,
      sku,
      purchasePrice,
      sellingPrice,
      currentStock,
      minStockLevel,
      supplierName,
      expiryDate,
    } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Product ID required for update" },
        { status: 400 }
      );
    }

    const product = await db.product.update({
      where: { id },
      data: {
        name,
        category,
        sku,
        purchasePrice: parseFloat(purchasePrice),
        sellingPrice: parseFloat(sellingPrice),
        currentStock: parseInt(currentStock),
        minStockLevel: parseInt(minStockLevel),
        supplierName,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Product ID required" },
        { status: 400 }
      );
    }

    await db.product.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
