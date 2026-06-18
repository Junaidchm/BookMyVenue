import { prisma } from '../prisma/prisma';
import { PricingType } from '@prisma/client';

export interface CreateVenueDto {
  title: string;
  description?: string;
  category: string;
  basePrice: number;
  pricingType: PricingType;
  bufferTimeMinutes: number;
  imageUrls: string[];
  amenities: number[];
  capacities: {
    type: string;
    maxPeople: number;
    isSeparate?: boolean;
  }[];
  sessions?: {
    name: string;
    startTime: string;
    endTime: string;
    sessionPrice: number;
  }[];
}

export class VenueService {
  /**
   * Retrieve all approved venues with their amenities and capacities.
   */
  async getAllVenues() {
    const venues = await prisma.venue.findMany({
      where: { status: 'APPROVED' },
      include: {
        amenities: {
          include: { amenity: true },
        },
        capacities: true,
        sessions: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return venues;
  }

  /**
   * Retrieve a single venue by its ID.
   */
  async getVenueById(id: number) {
    const venue = await prisma.venue.findUnique({
      where: { id },
      include: {
        amenities: {
          include: { amenity: true },
        },
        capacities: true,
        sessions: true,
      },
    });

    return venue;
  }

  /**
   * Creates a new venue and its related records (capacities, sessions, amenities)
   * in a single atomic transaction.
   */
  async createVenue(ownerId: number, data: CreateVenueDto) {
    const {
      title,
      description,
      category,
      basePrice,
      pricingType,
      bufferTimeMinutes,
      imageUrls,
      amenities,
      capacities,
      sessions,
    } = data;

    // Use Prisma nested write to insert everything atomically
    return await prisma.venue.create({
      data: {
        ownerId,
        title,
        description,
        category,
        basePrice,
        pricingType,
        bufferTimeMinutes,
        imageUrls,
        // Nested relation inserts
        capacities: {
          create: capacities.map((cap) => ({
            type: cap.type,
            maxPeople: cap.maxPeople,
            isSeparate: cap.isSeparate ?? false,
          })),
        },
        sessions: {
          create:
            pricingType === PricingType.PER_SESSION && sessions
              ? sessions.map((sess) => ({
                  name: sess.name,
                  startTime: sess.startTime,
                  endTime: sess.endTime,
                  sessionPrice: sess.sessionPrice,
                }))
              : [],
        },
        amenities: {
          create: amenities.map((amenityId) => ({
            amenityId,
          })),
        },
      },
      // Include all related models in the returned response
      include: {
        capacities: true,
        sessions: true,
        amenities: {
          include: {
            amenity: true,
          },
        },
      },
    });
  }
}
