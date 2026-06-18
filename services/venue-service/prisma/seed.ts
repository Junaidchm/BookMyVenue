import { PrismaClient, PricingType, VenueStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const AMENITIES = [
  { name: 'WiFi', iconKey: 'wifi' },
  { name: 'Parking', iconKey: 'parking' },
  { name: 'Catering', iconKey: 'catering' },
  { name: 'AV Equipment', iconKey: 'av' },
  { name: 'Outdoor Space', iconKey: 'outdoor' },
  { name: 'Air Conditioning', iconKey: 'ac' },
] as const;

const VENUES = [
  {
    title: 'The Glass Pavilion',
    description:
      'A stunning glass-walled event space in the heart of San Francisco, perfect for corporate gatherings and product launches.',
    category: 'corporate',
    location: 'San Francisco, CA',
    basePrice: 300,
    pricingType: PricingType.PER_HOUR,
    imageUrls: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD0cmtFtqQDxCCb8cbolHEKsH-g0aC7KDk6A5mEbBqspfIdywH408161WwZfApMRXr1cvH_bD__hbY7IDRZbCsBaIJKS0UjHt2WlVhfSP3O5WVAQMopYHwvlIA0kKVKPRz-Z2WcCL-dbmb21d9whOM5d4jtpv4dUPNm60wC9FhjRLsCDf0iFGsyi2-HFz8vgQoVFSekqOLVKVOX-carvQz-nTvIr65N14u98FUm343L3KTP1tqF4uJ_flGGWFlSFvJVaMvti0HFhgq_',
    ],
    amenityNames: ['WiFi', 'Parking', 'AV Equipment', 'Air Conditioning'],
    capacities: [
      { type: 'SEATING', maxPeople: 200 },
      { type: 'DINING', maxPeople: 150 },
    ],
    sessions: [
      { name: 'Morning', startTime: '08:00', endTime: '13:00', sessionPrice: 1200 },
      { name: 'Evening', startTime: '17:00', endTime: '23:00', sessionPrice: 1800 },
    ],
  },
  {
    title: 'Sunset Terrace Estate',
    description:
      'An elegant Napa Valley estate with panoramic vineyard views, ideal for weddings and milestone celebrations.',
    category: 'wedding_hall',
    location: 'Napa Valley, CA',
    basePrice: 475,
    pricingType: PricingType.PER_HOUR,
    imageUrls: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCtpOecp2RqmATdEgb5T0YSkFsiNuMXfE24BGpuSyO1KiErj6D2KCWMfRRURc7LaPQfS4U7KBcALvRxIvgauopLFL5ZC1WnrUruzuCy5OzSkLLjGROeH1U1H_HCnYasH4ImkGD0Cl6vLNKVWHL2oR7SO5pKgSenyB8Uy284LSUFpmQIFOzRtvhAjtx1DBtMsdjD9qeSvoei1nF3BY5rJMyKTZ5OY0iqJdA_BpAungPgIFniZdNdaDXJB-PWUf57XV77e468awusxa1O',
    ],
    amenityNames: ['WiFi', 'Parking', 'Catering', 'Outdoor Space'],
    capacities: [
      { type: 'SEATING', maxPeople: 300 },
      { type: 'DINING', maxPeople: 250 },
      { type: 'FLOATING', maxPeople: 400, isSeparate: true },
    ],
    sessions: [
      { name: 'Ceremony', startTime: '10:00', endTime: '14:00', sessionPrice: 2500 },
      { name: 'Reception', startTime: '17:00', endTime: '23:00', sessionPrice: 3800 },
    ],
  },
  {
    title: 'Urban Loft Studio',
    description:
      'A versatile Brooklyn loft with exposed brick and natural light, suited for photo shoots and intimate events.',
    category: 'studio',
    location: 'Brooklyn, NY',
    basePrice: 150,
    pricingType: PricingType.PER_HOUR,
    imageUrls: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBibvpo-lF8BCRfgGCk6QbyBK1H9VujIS7MJM6FzIGe2v9neX8ko3K0eDG2X2fqLZfemRdhGoJ3iCbnd7e6SfwkerPRUD6LWM7zrkSVz5YlXd_fvnKriXmcZPunqiBQUiNJlf2wr85dyBVSg5sJD6HCJuirg4XQqBtx8BTv-qg-q41Ga7xYrWrLMk2m5iy7arkADM_teNqza84cqckpWvqtFhrS__7zSz0Vuzbc_Lo4yAz7aZ8rHSFH05ffeQbWrlCx0XON9THwiqGk',
    ],
    amenityNames: ['WiFi', 'AV Equipment'],
    capacities: [{ type: 'FLOATING', maxPeople: 50 }],
    sessions: [
      { name: 'Half Day', startTime: '09:00', endTime: '13:00', sessionPrice: 500 },
      { name: 'Full Day', startTime: '09:00', endTime: '18:00', sessionPrice: 1200 },
    ],
  },
  {
    title: 'Garden House Retreat',
    description:
      'A charming Austin venue surrounded by lush gardens, perfect for birthdays, showers, and small gatherings.',
    category: 'event_space',
    location: 'Austin, TX',
    basePrice: 231,
    pricingType: PricingType.PER_HOUR,
    imageUrls: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA4TkKZJ7pfQDJsGMbm0aGTWPiNP3C_TkcmpZf2jYq_pavW-wZfjvuljoiWuBmA8qnjJghwxJoX1ejk_MN7DCjphewVo7kVa2i-S4FE5KQKvY4VibY2DTZFLE8AAU9q1lI7hCWdGUX4BT4m9ci6JX65QKdU9LCH6eELKJDYf2mKRfEE4Q7yZnBV-oxr5Fo3cQJExCDHufuNlfytXhpYFXqRuqZkZ_wTn1iyWqqmmi3H38vcNkxSs9QoJ5-0ydQ1FB-ietUC7yxwsf9a',
    ],
    amenityNames: ['WiFi', 'Parking', 'Outdoor Space', 'Catering'],
    capacities: [
      { type: 'SEATING', maxPeople: 80 },
      { type: 'DINING', maxPeople: 60 },
    ],
    sessions: [
      { name: 'Afternoon', startTime: '12:00', endTime: '17:00', sessionPrice: 900 },
      { name: 'Evening', startTime: '18:00', endTime: '22:00', sessionPrice: 1100 },
    ],
  },
  {
    title: 'Harbor View Ballroom',
    description:
      'A waterfront ballroom in Seattle with floor-to-ceiling windows and a private terrace overlooking the bay.',
    category: 'corporate',
    location: 'Seattle, WA',
    basePrice: 350,
    pricingType: PricingType.PER_HOUR,
    imageUrls: [
      'https://images.unsplash.com/photo-1519167758481-83f29da8c2f3?w=800',
    ],
    amenityNames: ['WiFi', 'Parking', 'Catering', 'AV Equipment', 'Air Conditioning'],
    capacities: [
      { type: 'SEATING', maxPeople: 250 },
      { type: 'DINING', maxPeople: 200 },
    ],
    sessions: [
      { name: 'Morning', startTime: '08:00', endTime: '12:00', sessionPrice: 1400 },
      { name: 'Evening', startTime: '18:00', endTime: '23:00', sessionPrice: 2100 },
    ],
  },
  {
    title: 'Desert Mirage Resort',
    description:
      'A luxury Scottsdale resort offering indoor and outdoor event spaces with desert-inspired architecture.',
    category: 'wedding_hall',
    location: 'Scottsdale, AZ',
    basePrice: 550,
    pricingType: PricingType.PER_HOUR,
    imageUrls: [
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800',
    ],
    amenityNames: ['WiFi', 'Parking', 'Catering', 'Outdoor Space', 'Air Conditioning'],
    capacities: [
      { type: 'SEATING', maxPeople: 350 },
      { type: 'DINING', maxPeople: 280 },
      { type: 'FLOATING', maxPeople: 500, isSeparate: true },
    ],
    sessions: [
      { name: 'Day Event', startTime: '10:00', endTime: '16:00', sessionPrice: 3200 },
      { name: 'Night Gala', startTime: '18:00', endTime: '01:00', sessionPrice: 4500 },
    ],
  },
] as const;

const DUMMY_OWNER_ID = 1;

async function main() {
  console.log('Seeding amenities...');
  const amenityRecords = await Promise.all(
    AMENITIES.map((amenity) =>
      prisma.amenity.upsert({
        where: { name: amenity.name },
        update: { iconKey: amenity.iconKey },
        create: amenity,
      }),
    ),
  );

  const amenityByName = Object.fromEntries(
    amenityRecords.map((record) => [record.name, record.id]),
  );

  console.log('Seeding venues...');
  for (const venue of VENUES) {
    const existing = await prisma.venue.findFirst({
      where: { title: venue.title },
    });

    if (existing) {
      console.log(`  Skipping "${venue.title}" (already exists)`);
      continue;
    }

    await prisma.venue.create({
      data: {
        ownerId: DUMMY_OWNER_ID,
        title: venue.title,
        description: `${venue.description} Located in ${venue.location}.`,
        category: venue.category,
        basePrice: venue.basePrice,
        pricingType: venue.pricingType,
        status: VenueStatus.APPROVED,
        imageUrls: [...venue.imageUrls],
        amenities: {
          create: venue.amenityNames.map((name) => ({
            amenityId: amenityByName[name],
          })),
        },
        capacities: {
          create: venue.capacities.map((capacity) => ({
            type: capacity.type,
            maxPeople: capacity.maxPeople,
            isSeparate: 'isSeparate' in capacity ? capacity.isSeparate : false,
          })),
        },
        sessions: {
          create: venue.sessions.map((session) => ({
            name: session.name,
            startTime: session.startTime,
            endTime: session.endTime,
            sessionPrice: session.sessionPrice,
          })),
        },
      },
    });

    console.log(`  Created "${venue.title}"`);
  }

  const count = await prisma.venue.count();
  console.log(`Done. ${count} venue(s) in database.`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
