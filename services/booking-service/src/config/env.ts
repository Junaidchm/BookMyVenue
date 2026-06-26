import { z } from 'zod';
import 'dotenv/config';
import fs from 'fs';

const isDocker = fs.existsSync('/.dockerenv');

if (isDocker) {
  if (process.env.DATABASE_URL) {
    process.env.DATABASE_URL = process.env.DATABASE_URL.replace(/@localhost(:\d+)?/, '@bmv_db:5432');
  }
  if (process.env.AUTH_SERVICE_URL) {
    process.env.AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL.replace('//localhost:', '//auth-service:');
  }
}

const envSchema = z.object({
  PORT: z.coerce.number().default(5002),
  DATABASE_URL: z.string().url(),
  AUTH_SERVICE_URL: z.string().url().default('http://localhost:5003'),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid Environment Variables for booking-service:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
