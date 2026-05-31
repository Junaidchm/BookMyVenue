import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { VenueCard } from "@/components/venues/venue-card";
import { FEATURED_VENUES } from "@/lib/venues/data";

export function FeaturedVenuesSection() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-max px-margin-mobile md:px-margin-desktop">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-headline-md text-on-surface">Trending Venues</h2>
            <p className="mt-2 max-w-lg text-body-md text-text-muted">
              Handpicked spaces loved by event planners — from intimate
              gatherings to grand celebrations.
            </p>
          </div>
          <Link
            href="/venues"
            className="inline-flex items-center gap-2 text-label-md text-primary-container transition-colors hover:text-secondary-container"
          >
            View all
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_VENUES.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      </div>
    </section>
  );
}
