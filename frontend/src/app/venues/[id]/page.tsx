import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, Users } from "lucide-react";

import { SiteNavbar } from "@/components/layout/site-navbar";
import { Separator } from "@/components/ui/separator";
import { VenueAmenities } from "@/components/venues/venue-amenities";
import { VenueBookingCard } from "@/components/venues/venue-booking-card";
import { VenueGallery } from "@/components/venues/venue-gallery";
import { VenueReviews } from "@/components/venues/venue-reviews";
import { getAllVenueIds, getVenue } from "@/lib/venues/data";

type VenuePageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return getAllVenueIds().map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: VenuePageProps): Promise<Metadata> {
  const { id } = await params;
  const venue = getVenue(id);
  if (!venue) return { title: "Venue Not Found | BookMyVenue" };
  return {
    title: `${venue.name} | BookMyVenue`,
    description: venue.description.slice(0, 160),
  };
}

export default async function VenueDetailPage({ params }: VenuePageProps) {
  const { id } = await params;
  const venue = getVenue(id);

  if (!venue) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-background antialiased">
      <SiteNavbar />

      <main className="mx-auto w-full max-w-[var(--container-max)] flex-1 px-gutter pt-32 pb-16">
        <VenueGallery venue={venue} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="flex flex-col gap-stack-lg lg:col-span-8">
            <div>
              <h1 className="mb-2 text-headline-md text-on-surface">
                {venue.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-body-md text-text-muted">
                <span className="flex items-center gap-1">
                  <MapPin className="size-5" />
                  {venue.location}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="size-5" />
                  Up to {venue.capacity} guests
                </span>
              </div>
            </div>

            <Separator className="bg-border-subtle" />

            <section>
              <h2 className="mb-4 text-headline-sm text-on-surface">
                About this space
              </h2>
              <p className="text-body-md leading-relaxed text-on-surface-variant">
                {venue.description}
              </p>
            </section>

            <Separator className="bg-border-subtle" />

            <section>
              <h2 className="mb-4 text-headline-sm text-on-surface">
                Amenities
              </h2>
              <VenueAmenities amenities={venue.amenities} />
            </section>

            <Separator className="bg-border-subtle" />

            <section>
              <h2 className="mb-4 text-headline-sm text-on-surface">
                Guest Reviews
              </h2>
              <VenueReviews reviews={venue.reviews} />
            </section>
          </div>

          <div className="relative lg:col-span-4">
            <VenueBookingCard venue={venue} />
          </div>
        </div>
      </main>
    </div>
  );
}
