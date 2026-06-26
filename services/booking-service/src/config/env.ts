import { z } from 'zod';
import 'dotenv/config';
import fs from 'fs';

const isDocker = fs.existsSync('/.dockerenv');

if (isDocker) {
  if (process.env.DATABASE_URL) {
    process.env.DATABASE_URL = process.env.DATABASE_URL.replace('@localhost:', '@bmv_db:');
  }
  if (process.env.AUTH_SERVICE_URL) {
    process.env.AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL.replace('//localhost:', '//auth-service:');
  } else {
    process.env.AUTH_SERVICE_URL = 'http://auth-service:5003';
  }
  if (process.env.VENUE_SERVICE_URL) {
    process.env.VENUE_SERVICE_URL = process.env.VENUE_SERVICE_URL.replace('//localhost:', '//venue-service:');
  } else {
    process.env.VENUE_SERVICE_URL = 'http://venue-service:5001';
  }
}

const envSchema = z.object({
  PORT: z.coerce.number().default(5002),
  DATABASE_URL: z.string().url(),
  AUTH_SERVICE_URL: z.string().url().default('http://localhost:5003'),
  VENUE_SERVICE_URL: z.string().url().default('http://localhost:5001'),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error(
    '❌ Invalid Environment Variables for booking-service:',
    parsed.error.format(),
  );
  process.exit(1);
}

export const env = parsed.data;
