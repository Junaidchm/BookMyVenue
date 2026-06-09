"use client";

import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { Venue } from "@/lib/venues/data";
import { formatVenuePrice } from "@/lib/venues/listing";

type VenueBookingCardProps = {
  venue: Venue;
};

const GUEST_OPTIONS = ["1 guest", "2 guests", "50+ guests"];

export function VenueBookingCard({ venue }: VenueBookingCardProps) {
  return (
    <Card className="sticky top-32 gap-0 rounded-2xl border border-border-subtle bg-surface py-0 shadow-elevation-floating">
      <CardContent className="flex flex-col gap-6 p-6">
        {/* Price & rating header */}
        <div className="flex items-end justify-between">
          <div className="font-display text-headline-md text-on-surface">
            {formatVenuePrice(venue.pricePerDay)}{" "}
            <span className="font-sans text-body-md font-normal text-text-muted">
              / day
            </span>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-surface-container-low px-3 py-1.5 text-label-sm font-semibold text-on-surface">
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            {venue.rating} ({venue.reviewCount})
          </div>
        </div>

        {/* Date & guests input card */}
        <div className="overflow-hidden rounded-xl border border-border-subtle">
          <div className="flex border-b border-border-subtle">
            <div className="flex-1 border-r border-border-subtle p-3.5 transition-colors focus-within:bg-surface-container-low">
              <Label className="mb-1 block text-label-sm tracking-wider text-text-muted uppercase">
                Check-in
              </Label>
              <Input
                type="text"
                placeholder="Add date"
                className="h-auto border-0 bg-transparent p-0 text-sm font-medium text-on-surface shadow-none focus-visible:ring-0"
              />
            </div>
            <div className="flex-1 p-3.5 transition-colors focus-within:bg-surface-container-low">
              <Label className="mb-1 block text-label-sm tracking-wider text-text-muted uppercase">
                Check-out
              </Label>
              <Input
                type="text"
                placeholder="Add date"
                className="h-auto border-0 bg-transparent p-0 text-sm font-medium text-on-surface shadow-none focus-visible:ring-0"
              />
            </div>
          </div>
          <div className="p-3.5 transition-colors focus-within:bg-surface-container-low">
            <Label className="mb-1 block text-label-sm tracking-wider text-text-muted uppercase">
              Guests
            </Label>
            <Select defaultValue="1 guest">
              <SelectTrigger className="h-auto w-full border-0 bg-transparent p-0 text-sm font-medium text-on-surface shadow-none focus-visible:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GUEST_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* CTA */}
        <Button
          size="lg"
          className="w-full rounded-full bg-primary-container py-6 text-label-md text-white shadow-lg shadow-primary-container/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-secondary-container active:scale-[0.98]"
        >
          Reserve Now
        </Button>

        <p className="text-center text-label-sm text-text-muted">
          You won&apos;t be charged yet
        </p>

        <Separator className="bg-border-subtle" />

        {/* Total */}
        <div className="flex justify-between text-body-md text-on-surface-variant">
          <span className="underline decoration-dotted underline-offset-4">
            Total before taxes
          </span>
          <span className="font-display font-bold text-on-surface">
            {formatVenuePrice(venue.pricePerDay)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
