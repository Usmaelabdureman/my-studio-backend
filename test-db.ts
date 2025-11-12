// test-db.ts
// Small script to verify Prisma can connect to MongoDB.
// Usage: npx ts-node test-db.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Attempt a simple query to ensure connection
  await prisma.$connect();
  console.log('✅ Connected to MongoDB successfully');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('❌ Failed to connect to MongoDB', e);
  process.exit(1);
});
