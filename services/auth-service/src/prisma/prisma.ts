import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { env } from '../config/env';

let prisma: PrismaClient;
let pool: Pool | undefined;

const databaseUrl = env.DATABASE_URL;

if (
  databaseUrl.startsWith('postgresql://') ||
  databaseUrl.startsWith('postgres://')
) {
  pool = new Pool({ connectionString: databaseUrl });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter });
} else {
  prisma = new PrismaClient({
    accelerateUrl: databaseUrl,
  });
}

export { prisma };

export async function connectDb() {
  await prisma.$connect();
  console.log('Database connected successfully.');
}

export async function disconnectDb() {
  await prisma.$disconnect();
  if (pool) {
    await pool.end();
  }
  console.log('Database disconnected.');
}
