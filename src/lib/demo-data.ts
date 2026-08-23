// Initial Pre-loaded MSME Kirana & Retail Dataset for StockPilot AI Prototype

export interface DemoProduct {
  id: string;
  name: string;
  category: string;
  sku: string;
  purchasePrice: number;
  sellingPrice: number;
  currentStock: number;
  minStockLevel: number;
  supplierName: string;
  expiryDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DemoSale {
  id: string;
  productId: string;
  product?: DemoProduct;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  saleDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const now = new Date();

export const INITIAL_PRODUCTS: DemoProduct[] = [
  {
    id: "prod-parle-100",
    name: "Parle-G Gold Biscuit 100g",
    category: "Packaged Food",
    sku: "SKU-PARLE-100",
    purchasePrice: 8.5,
    sellingPrice: 10.0,
    currentStock: 85,
    minStockLevel: 50,
    supplierName: "Parle Products Pvt Ltd",
    expiryDate: new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000),
    createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: now,
  },
  {
    id: "prod-maggi-70",
    name: "Maggi 2-Minute Noodles 70g",
    category: "Packaged Food",
    sku: "SKU-MAGGI-70",
    purchasePrice: 11.5,
    sellingPrice: 14.0,
    currentStock: 32,
    minStockLevel: 60,
    supplierName: "Nestle India Ltd",
    expiryDate: new Date(now.getTime() + 120 * 24 * 60 * 60 * 1000),
    createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: now,
  },
  {
    id: "prod-tata-salt",
    name: "Tata Salt Iodized 1kg",
    category: "Groceries",
    sku: "SKU-TATA-SALT",
    purchasePrice: 22.0,
    sellingPrice: 28.0,
    currentStock: 140,
    minStockLevel: 40,
    supplierName: "Tata Consumer Products",
    expiryDate: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000),
    createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: now,
  },
  {
    id: "prod-fortune-1l",
    name: "Fortune Sunlite Oil 1L",
    category: "Groceries",
    sku: "SKU-FORTUNE-1L",
    purchasePrice: 125.0,
    sellingPrice: 145.0,
    currentStock: 22,
    minStockLevel: 30,
    supplierName: "Adani Wilmar Ltd",
    expiryDate: new Date(now.getTime() + 240 * 24 * 60 * 60 * 1000),
    createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: now,
  },
  {
    id: "prod-amul-100g",
    name: "Amul Butter 100g",
    category: "Dairy",
    sku: "SKU-AMUL-100G",
    purchasePrice: 50.0,
    sellingPrice: 58.0,
    currentStock: 18,
    minStockLevel: 35,
    supplierName: "Gujarat Milk Federation",
    expiryDate: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000),
    createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: now,
  },
  {
    id: "prod-dettol-125",
    name: "Dettol Soap 125g",
    category: "Personal Care",
    sku: "SKU-DETTOL-125",
    purchasePrice: 32.0,
    sellingPrice: 42.0,
    currentStock: 65,
    minStockLevel: 25,
    supplierName: "Reckitt Benckiser",
    expiryDate: new Date(now.getTime() + 730 * 24 * 60 * 60 * 1000),
    createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: now,
  },
  {
    id: "prod-cadbury-60",
    name: "Cadbury Dairy Milk 60g",
    category: "Confectionery",
    sku: "SKU-CADBURY-60",
    purchasePrice: 65.0,
    sellingPrice: 85.0,
    currentStock: 50,
    minStockLevel: 20,
    supplierName: "Mondelez India Pvt Ltd",
    expiryDate: new Date(now.getTime() + 150 * 24 * 60 * 60 * 1000),
    createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: now,
  },
  {
    id: "prod-surf-1kg",
    name: "Surf Excel Washing Powder 1kg",
    category: "Household",
    sku: "SKU-SURF-1KG",
    purchasePrice: 115.0,
    sellingPrice: 142.0,
    currentStock: 15,
    minStockLevel: 30,
    supplierName: "Hindustan Unilever Ltd",
    expiryDate: new Date(now.getTime() + 500 * 24 * 60 * 60 * 1000),
    createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: now,
  },
];

// Generate 30 days of sales history
export const INITIAL_SALES: DemoSale[] = [];

let saleCounter = 1000;
INITIAL_PRODUCTS.forEach((prod) => {
  let baseDemand = 8;
  if (prod.sku.includes("PARLE") || prod.sku.includes("MAGGI")) baseDemand = 18;
  if (prod.sku.includes("SALT") || prod.sku.includes("DETTOL")) baseDemand = 12;
  if (prod.sku.includes("FORTUNE") || prod.sku.includes("SURF")) baseDemand = 5;

  for (let dayOffset = 30; dayOffset >= 1; dayOffset--) {
    const saleDate = new Date(now);
    saleDate.setDate(saleDate.getDate() - dayOffset);

    const dayOfWeek = saleDate.getDay();
    const weekendMultiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 1.35 : 1.0;
    const trendMultiplier = 1 + (30 - dayOffset) * 0.01;
    // Deterministic pseudo-random variation based on dayOffset and product SKU length
    const pseudoRandom = ((dayOffset * 17 + prod.sku.length * 31) % 40) / 100 - 0.2;

    const dailyQty = Math.max(
      1,
      Math.round(baseDemand * weekendMultiplier * trendMultiplier * (1 + pseudoRandom))
    );

    const totalAmount = Math.round(dailyQty * prod.sellingPrice * 100) / 100;

    saleCounter++;
    INITIAL_SALES.push({
      id: `sale-${saleCounter}`,
      productId: prod.id,
      product: prod,
      quantity: dailyQty,
      unitPrice: prod.sellingPrice,
      totalAmount,
      saleDate,
      createdAt: saleDate,
      updatedAt: saleDate,
    });
  }
});

// Sort sales descending by date
INITIAL_SALES.sort((a, b) => b.saleDate.getTime() - a.saleDate.getTime());
