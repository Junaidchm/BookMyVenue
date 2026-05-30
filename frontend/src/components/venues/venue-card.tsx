"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Star, Users } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatVenuePrice } from "@/lib/venues/listing";
import type { Venue } from "@/lib/venues/data";

type VenueCardProps = {
  venue: Venue;
};

const BADGE_STYLES: Record<string, string> = {
  luxury: "bg-inverse-surface text-inverse-on-surface uppercase tracking-wider text-[10px] font-bold",
  featured: "bg-brand-muted text-on-brand uppercase tracking-wider text-[10px] font-bold",
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
      className="group flex flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-elevation-card transition-shadow hover:shadow-elevation-card-hover"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={venue.images.main}
          alt={venue.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {venue.badges && venue.badges.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {venue.badges.map((badge) => (
              <Badge
                key={badge}
                className={cn("rounded-md border-0 px-2 py-0.5", BADGE_STYLES[badge])}
              >
                {BADGE_LABELS[badge]}
              </Badge>
            ))}
          </div>
        )}

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          className="absolute top-3 right-3 size-9 rounded-full bg-surface/90 text-text-muted shadow-sm backdrop-blur-sm hover:bg-surface hover:text-brand-muted"
          onClick={(e) => {
            e.preventDefault();
            setFavorited((prev) => !prev);
          }}
        >
          <Heart
            className={cn("size-4", favorited && "fill-brand-muted text-brand-muted")}
          />
        </Button>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-lg font-semibold text-on-surface group-hover:text-brand-muted">
            {venue.name}
          </h2>
          <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-on-surface">
            <Star className="size-4 fill-amber-400 text-amber-400" />
            {venue.rating.toFixed(1)}
          </span>
        </div>

        <p className="flex items-center gap-1.5 text-sm text-text-muted">
          <MapPin className="size-4 shrink-0" />
          {venue.location}
        </p>

        <div className="mt-auto flex items-end justify-between pt-1">
          <span className="flex items-center gap-1.5 text-sm text-text-muted">
            <Users className="size-4" />
            {venue.capacity} Capacity
          </span>
          <div className="text-right">
            <p className="text-[10px] font-semibold tracking-wider text-text-muted uppercase">
              Starting from
            </p>
            <p className="text-lg font-bold text-on-surface">
              {formatVenuePrice(venue.pricePerDay)}
              <span className="text-sm font-normal text-text-muted"> /day</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
