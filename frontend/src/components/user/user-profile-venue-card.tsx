"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Star } from "lucide-react";

import type { Venue } from "@/lib/venues/data";

type VenueCardProps = {
  venue: Venue;
  isSaved?: boolean;
};

export function VenueCard({ venue, isSaved: initialIsSaved = false }: VenueCardProps) {
  const [isSaved, setIsSaved] = useState(initialIsSaved);

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSaved(!isSaved);
  };

  return (
    <Link
      href={`/venues/${venue.id}`}
      className="group overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-elevation-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevation-card-hover"
    >
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          src={venue.images.main}
          alt={venue.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <button
          type="button"
          aria-label={isSaved ? "Unsave venue" : "Save venue"}
          className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-md transition-colors hover:bg-white z-10"
          onClick={toggleSave}
        >
          <Heart
            className={`size-4 transition-colors ${
              isSaved ? "fill-red-500 text-red-500" : "text-on-surface"
            }`}
          />
        </button>
      </div>

      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-headline-sm leading-tight text-on-surface">
            {venue.name}
          </h3>
          <span className="flex shrink-0 items-center gap-1 text-label-md text-on-surface">
            <Star className="size-3.5 fill-secondary-container text-secondary-container" />
            {venue.rating.toFixed(2)}
          </span>
        </div>

        <p className="flex items-center gap-1 text-label-md text-text-muted">
          <MapPin className="size-3.5 shrink-0" />
          {venue.location}
        </p>

        <p className="text-body-md text-on-surface">
          <span className="font-semibold">${venue.pricePerDay.toLocaleString()}</span>
          <span className="text-text-muted"> /day</span>
        </p>
      </div>
    </Link>
  );
}
