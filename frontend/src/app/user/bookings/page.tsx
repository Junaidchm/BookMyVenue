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
    <div className="flex flex-col gap-6 pb-8">
      <div className="mx-auto w-full max-w-[1000px]">
        <header className="mb-8 flex flex-col justify-between gap-4 border-b border-border-subtle pb-6 md:flex-row md:items-end">
          <div>
            <h1 className="mb-2 text-headline-md text-on-surface">
              My Bookings
            </h1>
            <p className="text-body-md text-text-muted">
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

        <section className="mb-8">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-on-surface">
            <Calendar className="size-6 text-primary-container" />
            Upcoming Events
          </h2>
          <div className="grid grid-cols-1 gap-gutter md:grid-cols-2">
            {UPCOMING_BOOKINGS.map((booking) => (
              <UpcomingBookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </section>

        <Separator className="mb-8 bg-border-subtle" />

        <section>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-on-surface">
            <History className="size-6 text-text-muted" />
            Past Reservations
          </h2>
          <div className="flex flex-col gap-4">
            {PAST_BOOKINGS.map((booking) => (
              <PastBookingItem key={booking.id} booking={booking} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
