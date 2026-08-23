import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL || "";

  // 1. If PostgreSQL database URL is provided (Neon, Vercel Postgres, Supabase)
  if (
    dbUrl.startsWith("postgres://") ||
    dbUrl.startsWith("postgresql://") ||
    dbUrl.startsWith("prisma://")
  ) {
    return new PrismaClient();
  }

  // 2. SQLite for Local Dev & Vercel Preview
  try {
    const dbPath = path.join(process.cwd(), "prisma", "dev.db").replace(/\\/g, "/");
    const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
    return new PrismaClient({ adapter });
  } catch (e) {
    console.warn("Falling back to default PrismaClient instance:", e);
    return new PrismaClient();
  }
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
