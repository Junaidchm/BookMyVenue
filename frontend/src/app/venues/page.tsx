import Link from "next/link";

import { SiteNavbar } from "@/components/layout/site-navbar";
import { Button } from "@/components/ui/button";
import { VENUES } from "@/lib/venues/data";

export default function VenuesPage() {
  const venues = Object.values(VENUES);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNavbar />
      <main className="mx-auto w-full max-w-[var(--container-max)] flex-1 px-gutter pt-32 pb-16">
        <h1 className="mb-2 text-headline-md text-on-surface">Explore Venues</h1>
        <p className="mb-8 text-body-md text-text-muted">
          Discover premium spaces for your next event.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => (
            <Link
              key={venue.id}
              href={`/venues/${venue.id}`}
              className="rounded-xl border border-stone-100 bg-surface p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <h2 className="text-headline-sm text-on-surface">{venue.name}</h2>
              <p className="mt-1 text-body-md text-text-muted">{venue.location}</p>
              <p className="mt-4 font-semibold text-on-surface">
                ${venue.pricePerDay.toLocaleString()}{" "}
                <span className="font-normal text-text-muted">/ day</span>
              </p>
            </Link>
          ))}
        </div>
        {venues.length === 0 && (
          <Button asChild>
            <Link href="/">Back home</Link>
          </Button>
        )}
      </main>
    </div>
  );
}
