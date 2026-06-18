import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, History, Search } from "lucide-react";
import { redirect } from "next/navigation";

import { PastBookingItem } from "@/components/user/past-booking-item";
import { UpcomingBookingCard } from "@/components/user/upcoming-booking-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  PAST_BOOKINGS,
  UPCOMING_BOOKINGS,
} from "@/lib/user/data";

export const metadata: Metadata = {
  title: "My Bookings | BookMyVenue",
  description: "Review and manage your premium event reservations",
};

export default function MyBookingsPage() {
  return (
    <main className="min-h-full p-margin-mobile md:p-margin-desktop">
      <div className="mx-auto max-w-[1000px]">
        <header className="mb-stack-lg flex flex-col justify-between gap-4 border-b border-[color:var(--outline-variant)]/30 pb-6 md:flex-row md:items-end">
          <div>
            <h1 className="mb-2 font-display text-display-lg-mobile text-brand-muted md:text-display-lg">
              My Bookings
            </h1>
            <p className="text-body-lg text-on-surface-variant">
              Review and manage your upcoming and past premium event
              reservations.
            </p>
          </div>
          <Button
            className="w-fit gap-2 rounded-full bg-primary-container px-6 py-3 text-label-md text-on-primary-container hover:-translate-y-0.5 hover:bg-secondary-container hover:shadow-md"
            asChild
          >
            <Link href="/venues">
              <Search className="size-4" />
              Find New Venues
            </Link>
          </Button>
        </header>

        <section className="mb-stack-lg">
          <h2 className="mb-stack-md flex items-center gap-2 text-headline-sm text-on-surface">
            <Calendar className="size-6 text-tertiary" />
            Upcoming Events
          </h2>
          <div className="grid grid-cols-1 gap-gutter md:grid-cols-2">
            {UPCOMING_BOOKINGS.map((booking) => (
              <UpcomingBookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </section>

        <Separator className="mb-stack-lg bg-[color:var(--outline-variant)]/30" />

        <section>
          <h2 className="mb-stack-md flex items-center gap-2 text-headline-sm text-on-surface">
            <History className="size-6 text-on-surface-variant" />
            Past Reservations
          </h2>
          <div className="flex flex-col gap-4">
            {PAST_BOOKINGS.map((booking) => (
              <PastBookingItem key={booking.id} booking={booking} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
