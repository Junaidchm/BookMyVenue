import Image from "next/image";
import Link from "next/link";
import { Calendar, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { UpcomingBooking } from "@/lib/user/data";
import { STATUS_LABELS } from "@/lib/user/data";
import { cn } from "@/lib/utils";

type DashboardBookingCardProps = {
  booking: UpcomingBooking;
};

export function DashboardBookingCard({ booking }: DashboardBookingCardProps) {
  const isConfirmed = booking.status === "confirmed";

  return (
    <Card className="flex flex-col gap-0 overflow-hidden rounded-2xl border border-[color:var(--outline-variant)]/30 bg-surface-container-lowest p-0 shadow-sm sm:flex-row">
      <div className="relative h-48 w-full shrink-0 overflow-hidden sm:h-auto sm:w-[240px]">
        <Image
          src={booking.image}
          alt={booking.venue}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 240px"
        />
      </div>

      <CardContent className="flex flex-1 flex-col p-6">
        <div className="mb-1 flex items-start justify-between gap-4">
          <h3 className="font-display text-headline-sm text-brand-muted">
            {booking.venue}
          </h3>
          <Badge
            variant="outline"
            className={cn(
              "shrink-0 rounded-full border px-2.5 py-0.5 text-label-sm font-medium",
              isConfirmed
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-amber-200 bg-amber-50 text-amber-700"
            )}
          >
            {STATUS_LABELS[booking.status]}
          </Badge>
        </div>

        <p className="mb-4 text-body-md text-on-surface-variant">
          {booking.location}
        </p>

        <div className="mb-6 flex flex-wrap gap-x-6 gap-y-2">
          <div className="flex items-center gap-2 text-label-md text-on-surface-variant">
            <Calendar className="size-4 shrink-0" />
            {booking.dateTime.split("•")[0].trim()}
          </div>
          <div className="flex items-center gap-2 text-label-md text-on-surface-variant">
            <Users className="size-4 shrink-0" />
            {booking.guests} Guests
          </div>
        </div>

        <div className="mt-auto flex flex-wrap gap-3">
          <Button
            variant="outline"
            className="rounded-full px-6"
            asChild
          >
            <Link href={booking.href}>View Details</Link>
          </Button>
          {isConfirmed && (
            <Button
              variant="outline"
              className="rounded-full px-6"
            >
              Contact Host
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
