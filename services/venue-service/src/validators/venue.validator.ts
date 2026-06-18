import { z } from 'zod';
import { PricingType } from '@prisma/client';

const capacitySchema = z.object({
  type: z.string().min(1, 'Capacity type is required'),
  maxPeople: z.number().int().positive('Max people must be a positive integer'),
  isSeparate: z.boolean().default(false),
});

const sessionSchema = z.object({
  name: z.string().min(1, 'Session name is required'),
  startTime: z
    .string()
    .regex(
      /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
      'Start time must be in HH:MM format',
    ),
  endTime: z
    .string()
    .regex(
      /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
      'End time must be in HH:MM format',
    ),
  sessionPrice: z.number().positive('Session price must be positive'),
});

export const createVenueSchema = z
  .object({
    body: z.object({
      title: z
        .string()
        .min(3, 'Title must be at least 3 characters long')
        .max(255, 'Title is too long'),
      description: z.string().optional(),
      category: z.string().min(1, 'Category is required'),
      basePrice: z.number().positive('Base price must be a positive number'),
      pricingType: z.nativeEnum(PricingType).default(PricingType.PER_HOUR),
      bufferTimeMinutes: z
        .number()
        .int()
        .nonnegative('Buffer time cannot be negative')
        .default(60),
      imageUrls: z
        .array(z.string().url('Invalid image URL format'))
        .default([]),
      amenities: z
        .array(
          z.number().int().positive('Amenity ID must be a positive integer'),
        )
        .default([]),
      capacities: z.array(capacitySchema).default([]),
      sessions: z.array(sessionSchema).default([]),
    }),
  })
  .superRefine((data, ctx) => {
    const { pricingType, sessions } = data.body;

    if (pricingType === PricingType.PER_SESSION) {
      if (!sessions || sessions.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'At least one session is required when pricing type is PER_SESSION',
          path: ['body', 'sessions'],
        });
      }
    }
  });
