import { z } from 'zod';
import 'dotenv/config';

const envSchema = z.object({
  PORT: z.coerce.number().default(5001),
  DATABASE_URL: z.string().url(),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('❌ Invalid Environment Variables for venue-service:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
