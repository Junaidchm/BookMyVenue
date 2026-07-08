import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';
import fs from 'fs';

const isDocker = fs.existsSync('/.dockerenv');
let connectionString = process.env.DATABASE_URL;
if (isDocker && connectionString) {
  connectionString = connectionString.replace('@localhost:', '@bmv_db:');
}

const needsSsl = connectionString?.includes('sslmode=require');
const cleanUrl = connectionString?.replace(/[?&]sslmode=require/g, '');

const pool = new Pool({
  connectionString: cleanUrl,
  ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
});
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  // 1. Delete AV Equipment
  await prisma.amenity.deleteMany({
    where: { name: 'AV Equipment' }
  });

  // 2. Add Projector
  const projector = await prisma.amenity.findFirst({ where: { name: 'Projector' } });
  if (!projector) {
    await prisma.amenity.create({ data: { name: 'Projector', iconKey: 'projector' } });
  }

  // 3. Add Audio System
  const audio = await prisma.amenity.findFirst({ where: { name: 'Audio System' } });
  if (!audio) {
    await prisma.amenity.create({ data: { name: 'Audio System', iconKey: 'audio' } });
  }

  // 4. Update Catering iconKey
  await prisma.amenity.updateMany({
    where: { name: 'Catering' },
    data: { iconKey: 'utensils' }
  });

  // 5. Update Outdoor Space iconKey
  await prisma.amenity.updateMany({
    where: { name: 'Outdoor Space' },
    data: { iconKey: 'tree' }
  });

  console.log("Done updating amenities.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
