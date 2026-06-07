"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Star, Users } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatVenuePrice } from "@/lib/venues/listing";
import type { Venue } from "@/lib/venues/data";

type VenueCardProps = {
  venue: Venue;
};

const BADGE_STYLES: Record<string, string> = {
  luxury:
    "bg-inverse-surface text-inverse-on-surface uppercase tracking-wider text-[10px] font-bold",
  featured:
    "bg-primary-container text-white uppercase tracking-wider text-[10px] font-bold",
};

const BADGE_LABELS: Record<string, string> = {
  luxury: "Luxury",
  featured: "Featured",
};

export function VenueCard({ venue }: VenueCardProps) {
  const [favorited, setFavorited] = useState(false);

  return (
    <Link
      href={`/venues/${venue.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-elevation-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elevation-card-hover"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={venue.images.main}
          alt={venue.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Subtle gradient overlay on hover */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Badges */}
        {venue.badges && venue.badges.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {venue.badges.map((badge) => (
              <Badge
                key={badge}
                className={cn(
                  "rounded-md border-0 px-2.5 py-1 shadow-sm",
                  BADGE_STYLES[badge]
                )}
              >
                {BADGE_LABELS[badge]}
              </Badge>
            ))}
          </div>
        )}

        {/* Favorite button */}
        <button
          type="button"
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-white/80 text-text-muted shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-white hover:text-primary-container hover:scale-110"
          onClick={(e) => {
            e.preventDefault();
            setFavorited((prev) => !prev);
          }}
        >
          <Heart
            className={cn(
              "size-4 transition-colors",
              favorited && "fill-primary-container text-primary-container"
            )}
          />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-display text-lg font-bold tracking-tight text-on-surface transition-colors duration-200 group-hover:text-primary-container">
            {venue.name}
          </h2>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-surface-container-low px-2.5 py-1 text-xs font-semibold text-on-surface">
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            {venue.rating.toFixed(1)}
          </span>
        </div>

        <p className="flex items-center gap-1.5 text-sm text-text-muted">
          <MapPin className="size-3.5 shrink-0" />
          {venue.location}
        </p>

        <div className="mt-auto flex items-end justify-between border-t border-border-subtle pt-3">
          <span className="flex items-center gap-1.5 text-sm text-text-muted">
            <Users className="size-3.5" />
            {venue.capacity} guests
          </span>
          <div className="text-right">
            <p className="text-[10px] font-semibold tracking-wider text-text-muted uppercase">
              Starting from
            </p>
            <p className="font-display text-lg font-bold text-on-surface">
              {formatVenuePrice(venue.pricePerDay)}
              <span className="ml-0.5 font-sans text-xs font-normal text-text-muted">
                /day
              </span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
