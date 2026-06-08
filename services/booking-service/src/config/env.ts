import { z } from 'zod';
import 'dotenv/config';
import fs from 'fs';

const isDocker = fs.existsSync('/.dockerenv');

if (isDocker && process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.replace('@localhost:', '@bmv_db:');
}

const envSchema = z.object({
  PORT: z.coerce.number().default(5002),
  DATABASE_URL: z.string().url(),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('❌ Invalid Environment Variables for booking-service:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
