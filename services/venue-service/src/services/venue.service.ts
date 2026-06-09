import { prisma } from '../prisma/prisma';

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
}
