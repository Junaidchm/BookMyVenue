"use client";

import { Star } from "lucide-react";
import { useState } from "react";

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


export function VenueBookingCard({ venue }: VenueBookingCardProps) {
  const [date, setDate] = useState("");
  const [sessionIndex, setSessionIndex] = useState("0");
  const [hours, setHours] = useState("2");
  const [startTime, setStartTime] = useState("09:00");

  const basePrice = venue.basePrice ?? venue.pricePerDay;
  const isPerSession = venue.pricingType === "PER_SESSION";
  const hasSessions = venue.sessions && venue.sessions.length > 0;

  let total = basePrice;
  if (isPerSession && hasSessions) {
    const session = venue.sessions![parseInt(sessionIndex)] || venue.sessions![0];
    total = session.sessionPrice;
  } else if (venue.pricingType === "PER_HOUR") {
    total = basePrice * Math.max(2, parseInt(hours) || 2);
  }

  const handleReserve = () => {
    const params = new URLSearchParams();
    if (date) params.set("date", date);
    params.set("total", total.toString());
    
    if (isPerSession && hasSessions) {
      params.set("sessionIndex", sessionIndex);
    } else {
      params.set("hours", Math.max(2, parseInt(hours) || 2).toString());
      if (startTime) params.set("startTime", startTime);
    }

    alert(`Booking feature is disabled for now.
Date: ${date}
Total: ${total}`);
  };

  return (
    <Card className="sticky top-32 gap-0 rounded-2xl border border-border-subtle bg-surface py-0 shadow-elevation-floating">
      <CardContent className="flex flex-col gap-6 p-6">
        {/* Price & rating header */}
        <div className="flex items-end justify-between">
          <div className="font-display text-headline-md text-on-surface">
            {formatVenuePrice(basePrice)}{" "}
            <span className="font-sans text-body-md font-normal text-text-muted">
              {isPerSession ? "/ session" : "/ hour"}
            </span>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-surface-container-low px-3 py-1.5 text-label-sm font-semibold text-on-surface">
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            {venue.rating} ({venue.reviewCount})
          </div>
        </div>

        {/* Booking Inputs */}
        <div className="overflow-hidden rounded-xl border border-border-subtle">
          <div className="border-b border-border-subtle p-3.5 transition-colors focus-within:bg-surface-container-low">
            <Label className="mb-1 block text-label-sm tracking-wider text-text-muted uppercase">
              Date
            </Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-auto border-0 bg-transparent p-0 text-sm font-medium text-on-surface shadow-none focus-visible:ring-0"
            />
          </div>

          {isPerSession && hasSessions ? (
            <div className="border-b border-border-subtle p-3.5 transition-colors focus-within:bg-surface-container-low">
              <Label className="mb-1 block text-label-sm tracking-wider text-text-muted uppercase">
                Session
              </Label>
              <Select value={sessionIndex} onValueChange={setSessionIndex}>
                <SelectTrigger className="h-auto w-full border-0 bg-transparent p-0 text-sm font-medium text-on-surface shadow-none focus-visible:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {venue.sessions!.map((s, idx) => (
                    <SelectItem key={idx} value={idx.toString()}>
                      {s.name} ({s.startTime} - {s.endTime})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row border-b border-border-subtle transition-colors focus-within:bg-surface-container-low">
              <div className="flex-1 p-3.5 border-b sm:border-b-0 sm:border-r border-border-subtle">
                <Label className="mb-1 block text-label-sm tracking-wider text-text-muted uppercase">
                  Start Time
                </Label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="h-auto border-0 bg-transparent p-0 text-sm font-medium text-on-surface shadow-none focus-visible:ring-0"
                />
              </div>
              <div className="flex-1 p-3.5">
                <Label className="mb-1 block text-label-sm tracking-wider text-text-muted uppercase">
                  Duration (Hrs)
                </Label>
                <Input
                  type="number"
                  min={2}
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="h-auto border-0 bg-transparent p-0 text-sm font-medium text-on-surface shadow-none focus-visible:ring-0"
                />
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <Button
          size="lg"
          onClick={handleReserve}
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
            {formatVenuePrice(total)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
