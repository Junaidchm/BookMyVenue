import { z } from 'zod';
import 'dotenv/config';

const envSchema = z.object({
  PORT: z.coerce.number().default(5003),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(6),
  JWT_EXPIRES_IN: z.string().default('24h'),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('❌ Invalid Environment Variables for auth-service:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
