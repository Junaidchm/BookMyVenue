import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { UpcomingBooking } from "@/lib/user/data";
import { STATUS_LABELS } from "@/lib/user/data";
import { cn } from "@/lib/utils";

const STATUS_DOT: Record<UpcomingBooking["status"], string> = {
  confirmed: "bg-emerald-500",
  "pending-payment": "bg-amber-500",
};

type UpcomingBookingCardProps = {
  booking: UpcomingBooking;
};

export function UpcomingBookingCard({ booking }: UpcomingBookingCardProps) {
  return (
    <Card className="group gap-0 overflow-hidden rounded-3xl border border-[color:var(--outline-variant)]/30 bg-surface-container-lowest py-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={booking.image}
          alt={booking.venue}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <Badge
          variant="outline"
          className="absolute top-4 right-4 gap-1.5 rounded-full border-transparent bg-surface-container-low/90 px-3 py-1.5 text-label-sm text-on-surface shadow-sm backdrop-blur-md"
        >
          <span
            className={cn("size-2 rounded-full", STATUS_DOT[booking.status])}
          />
          {STATUS_LABELS[booking.status]}
        </Badge>
      </div>

      <CardContent className="flex flex-1 flex-col p-stack-md">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 font-display text-headline-sm text-brand-muted">
            {booking.venue}
          </h3>
          <Badge
            variant="outline"
            className="shrink-0 rounded-md border-[color:var(--outline-variant)]/20 bg-surface text-label-md text-on-surface-variant"
          >
            {booking.reference}
          </Badge>
        </div>

        <p className="mb-4 flex items-center gap-2 text-body-md text-on-surface-variant">
          <MapPin className="size-4 shrink-0" />
          {booking.location}
        </p>

        <div className="mt-auto flex items-center justify-between rounded-xl bg-surface-container p-4">
          <div>
            <p className="mb-1 text-label-sm tracking-wider text-on-surface-variant uppercase">
              Date & Time
            </p>
            <p className="text-label-md text-on-surface">{booking.dateTime}</p>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="size-10 rounded-full border-[color:var(--outline-variant)] bg-surface-container-lowest text-brand-muted hover:bg-surface-variant"
            asChild
          >
            <Link href={booking.href} aria-label={`View ${booking.venue}`}>
              <ArrowRight className="size-5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
