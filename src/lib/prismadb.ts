// lib/prismadb.ts
import { PrismaClient } from "../../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
  // Use DATABASE_URL from your .env
  const connectionString = process.env.DATABASE_URL;
  
  // Create the pg pool and Prisma adapter
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  // You MUST pass the adapter here in Prisma 7
  return new PrismaClient({ adapter });
};

const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;