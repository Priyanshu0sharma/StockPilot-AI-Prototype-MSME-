# StockPilot AI 🚀
### AI-Powered Inventory Demand Forecasting & Smart Reorder SaaS Platform for MSME Retailers

> **StockPilot AI** is an intelligent, full-stack SaaS platform designed specifically for Micro, Small, and Medium Enterprises (MSME) retailers. It empowers kirana stores, grocery shops, and retail outlets to eliminate stockouts, prevent working capital blockage from overstocking, and automate purchase reorders using data-driven demand forecasting.

---

## 💡 यह क्या है और क्या काम आएगा? (What is StockPilot AI & How Does it Help?)

### ❌ The Problem in MSME Retail (समस्या):
Small retailers in India and emerging markets face severe inventory management challenges:
1. **Stockout Losses (माल खत्म होना)**: Popular fast-moving products like *Parle-G*, *Maggi*, or *Tata Salt* run out unexpectedly, leading to lost customer sales and revenue.
2. **Capital Blockage (ज्यादा सामान भरना)**: Slow-moving inventory locks up crucial working capital and leads to product expiry losses.
3. **Manual Ledgers (मैनुअल काम)**: Retailers rely on manual register entries or guesswork to place fresh supplier orders.

### ✅ The StockPilot AI Solution (समाधान):
StockPilot AI converts raw daily sales transactions into predictive operational intelligence:
- **Instant Stock Auto-Deduction**: Every POS sale recorded automatically decrements store stock in real-time.
- **Statistical AI Demand Forecasting**: Predicts exact 7-day and 30-day customer demand using Weighted Moving Averages (WMA) and Exponential Smoothing algorithms.
- **Smart Safety Buffer Reorder Engine**: Automatically calculates exact quantities to reorder before stock runs out:
  $$\text{Recommended Order Qty} = \text{Future 30-Day Demand} + \text{Safety Stock Buffer} - \text{Current Stock}$$
- **Manager Approval Workflow**: Allows store managers to review, approve, and receive supplier shipments with 1-click inventory replenishment.
- **Automated AI Insights**: Live alerts for demand spikes, stock depletion risks, and slow-moving items.
- **CSV & PDF Exportable Reports**: 1-click export of sales ledgers and inventory valuation reports for audit and accounting.

---

## 🌟 Core Modules & Architecture

```
                                USER / RETAILER
                                       │
                                       ▼
                             NEXT.JS 15 DASHBOARD
                           (App Router + Tailwind)
                                       │
                                       ▼
                              BACKEND API ROUTES
                           (Business Logic Layer)
                                       │
                                       ▼
                             DATABASE LAYER (ORM)
                           (Prisma + PostgreSQL/SQLite)
                                       │
                    ┌──────────────────┴──────────────────┐
                    ▼                                     ▼
          AI STATISTICAL ENGINE                 SMART REORDER ENGINE
      (Sales Prediction & Trends)            (Safety Buffer & Approvals)
```

### Module Breakdown:
1. **Authentication & Multi-Role Access**:
   - **Retailer Role**: Inventory management, POS sale recording, viewing demand predictions, receiving order alerts.
   - **Manager Role**: Store monitoring, sales ledger auditing, purchase reorder approval, receiving shipments.
   - **Admin Role**: System analytics, user role administration, 1-click MSME demo dataset re-seeding.
   - *Includes a persistent demo role switcher pill for seamless presentation evaluation.*

2. **Product Inventory Management (CRUD)**:
   - Tracks SKU ID, Name, Category, Purchase Price, Selling Price, Current Stock, Safety Stock Level, Supplier Name, and Expiry Date.
   - Live search, category tab filters, and dynamic stock health badges (`Healthy`, `Low Stock Alert`, `Out of Stock`).

3. **POS Sales Entry & Auto-Deduction**:
   - Rapid sale checkout modal.
   - Automatic real-time transaction stock deduction (`Current Stock = Current Stock - Qty`).
   - Tracks Daily, Weekly, and Monthly sales metrics.

4. **Executive Dashboard & Interactive Recharts**:
   - **KPI Cards**: Total Products, Current Stock Valuation (₹), Low Stock Alerts, Monthly Sales Revenue.
   - **Sales Trend Graph**: Area chart tracking daily revenue trends.
   - **Top Selling Bar Chart**: Highlights highest volume units sold.
   - **Inventory Status Chart**: Grouped bar chart comparing Current Stock vs Minimum Safety Level threshold.

5. **AI Demand Forecasting Engine**:
   - Analyzes historical sales patterns to generate 7-day and 30-day demand predictions.
   - Visualizes **Past Sales (Actual)** into **Future AI Prediction (Dashed Curve)** with AI confidence scores.

6. **Smart Reorder Engine**:
   - Automated purchase reorder calculation with Urgency classification (`High`, `Medium`, `Low`).
   - Manager approval workflow; clicking "Receive Shipment" automatically adds ordered units back into live database stock!

7. **AI Operational Insights Panel**:
   - Automated notifications for demand spikes (*"Parle-G demand up 22% this week"*), depletion risks (*"Maggi stock running out in 5 days"*), and slow-moving items.

8. **Reports & Exports**:
   - Export Sales Ledger and Inventory Valuation to **CSV**.
   - Download official print-formatted **PDF** reports.

---

## 🛠️ Technology Stack

- **Frontend Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Styling & UI**: Tailwind CSS, Lucide React Icons
- **Database & ORM**: Prisma ORM, SQLite (out-of-the-box local dev) / PostgreSQL (cloud production)
- **Charts & Data Visualization**: Recharts
- **PDF & File Export**: jsPDF, jsPDF-AutoTable
- **State & Role Management**: React Context API

---

## ⚙️ Quick Start & Local Setup

### Prerequisites
- Node.js v18+ or v20+
- npm / pnpm / yarn

### Step 1: Clone Repository
```bash
git clone https://github.com/Priyanshu0sharma/StockPilot-AI-Prototype-MSME-.git
cd StockPilot-AI-Prototype-MSME-
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Setup Database & Seed Sample MSME Data
```bash
# Push Prisma schema to local database
npx prisma db push

# Seed 8 realistic MSME products & 30 days of sales history
npx tsx prisma/seed.ts
```

### Step 4: Run Development Server
```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser to test the prototype!

---

## 🧪 Demo Presentation Flow for Evaluators

1. **Log in / Select Role**: Open the dashboard at `http://localhost:3000`. Use the top navbar role switcher pill to toggle between **Retailer**, **Manager**, and **Admin**.
2. **View Dashboard**: Inspect live KPIs, Sales Trend chart, Top Products chart, and Inventory Status vs Min Stock thresholds.
3. **Record POS Sale**: Click **"+ Record Sale"** in the top navbar. Select *Parle-G Gold Biscuit*, enter quantity `10`, and submit. Notice the current stock instantly drops from `85` to `75`!
4. **AI Demand Forecast**: Navigate to **AI Demand Forecast** in the sidebar to review the 7-day and 30-day sales prediction curves.
5. **Smart Reorders & Fulfillment**: Open **Smart Reorders**. Switch role to **Manager** using the top pill, click **"Approve Order"** and then **"Receive Shipment"**. Notice the database stock automatically replenishes back to healthy levels!
6. **Download Reports**: Navigate to **Reports** and click **Export CSV** or **Download PDF Report**.

---

## 📄 License
Licensed under the [MIT License](LICENSE).
