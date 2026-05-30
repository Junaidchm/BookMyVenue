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

type VenueBookingCardProps = {
  venue: Venue;
};

const GUEST_OPTIONS = ["1 guest", "2 guests", "50+ guests"];

export function VenueBookingCard({ venue }: VenueBookingCardProps) {
  return (
    <Card className="sticky top-32 gap-0 rounded-xl border border-stone-100 bg-surface py-0 shadow-elevation-floating">
      <CardContent className="flex flex-col gap-6 p-6">
        <div className="flex items-end justify-between">
          <div className="text-headline-md text-on-surface">
            ${venue.pricePerDay.toLocaleString()}{" "}
            <span className="text-body-md font-normal text-text-muted">
              / day
            </span>
          </div>
          <div className="flex items-center gap-1 text-label-md text-on-surface">
            <Star className="size-4 fill-secondary-container text-secondary-container" />
            {venue.rating} ({venue.reviewCount} reviews)
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-stone-200">
          <div className="flex border-b border-stone-200">
            <div className="flex-1 border-r border-stone-200 p-3 transition-colors focus-within:bg-surface-container-low">
              <Label className="mb-1 block text-label-sm tracking-wider text-text-muted uppercase">
                Check-in
              </Label>
              <Input
                type="text"
                placeholder="Add date"
                className="h-auto border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
              />
            </div>
            <div className="flex-1 p-3 transition-colors focus-within:bg-surface-container-low">
              <Label className="mb-1 block text-label-sm tracking-wider text-text-muted uppercase">
                Check-out
              </Label>
              <Input
                type="text"
                placeholder="Add date"
                className="h-auto border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
              />
            </div>
          </div>
          <div className="p-3 transition-colors focus-within:bg-surface-container-low">
            <Label className="mb-1 block text-label-sm tracking-wider text-text-muted uppercase">
              Guests
            </Label>
            <Select defaultValue="1 guest">
              <SelectTrigger className="h-auto w-full border-0 bg-transparent p-0 shadow-none focus-visible:ring-0">
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

        <Button
          size="lg"
          className="w-full rounded-full bg-primary-container py-6 text-label-md text-on-primary shadow-md shadow-primary-container/20 hover:-translate-y-0.5 hover:bg-secondary-container"
        >
          Reserve Now
        </Button>

        <p className="text-center text-label-sm text-text-muted">
          You won&apos;t be charged yet
        </p>

        <Separator className="bg-stone-100" />

        <div className="flex justify-between text-body-md text-on-surface-variant">
          <span className="underline">Total before taxes</span>
          <span className="font-semibold text-on-surface">
            ${venue.pricePerDay.toLocaleString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
