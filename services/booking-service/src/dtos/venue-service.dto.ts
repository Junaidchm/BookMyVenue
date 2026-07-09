export interface VenueSession {
  id: string;
  venueId: string;
  name: string;
  startTime: string;
  endTime: string;
  sessionPrice: string;
}

export interface Venue {
  id: string;
  ownerId: string;
  title: string;
  description: string | null;
  category: string;
  basePrice: string;
  pricingType: 'PER_HOUR' | 'PER_SESSION';
  bufferTimeMinutes: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  imageUrls: string[];
  sessions: VenueSession[];
}

export interface VenueClosure {
  id: string;
  venueId: string;
  type: 'MAINTENANCE' | 'HOLIDAY' | 'PRIVATE_EVENT';
  startTime: string;
  endTime: string;
  description: string | null;
}
