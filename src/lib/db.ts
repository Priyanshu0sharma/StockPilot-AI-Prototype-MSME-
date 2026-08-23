import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL || "";

  // 1. If PostgreSQL connection string is provided (e.g. Neon, Supabase, Vercel Postgres)
  if (
    dbUrl.startsWith("postgres://") ||
    dbUrl.startsWith("postgresql://") ||
    dbUrl.startsWith("prisma://")
  ) {
    try {
      const pool = new Pool({ connectionString: dbUrl });
      const adapter = new PrismaPg(pool);
      return new PrismaClient({ adapter });
    } catch (e) {
      console.warn("Fallback PostgreSQL client:", e);
      return new PrismaClient();
    }
  }

  // 2. Pure JS LibSQL adapter for SQLite (Works on Vercel Serverless & Local Dev without C++ native compilation)
  try {
    const dbPath = path.join(process.cwd(), "prisma", "dev.db").replace(/\\/g, "/");
    const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
    return new PrismaClient({ adapter });
  } catch (e) {
    console.warn("Fallback SQLite client:", e);
    return new PrismaClient();
  }
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
