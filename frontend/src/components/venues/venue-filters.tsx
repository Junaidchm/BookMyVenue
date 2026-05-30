"use client";

import { MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  FILTER_AMENITIES,
  FILTER_EVENT_TYPES,
  type VenueFilters,
} from "@/lib/venues/listing";

type VenueFiltersProps = {
  filters: VenueFilters;
  onChange: (filters: VenueFilters) => void;
  onApply: () => void;
};

function FilterCheckbox({
  id,
  label,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-3 py-1.5 text-sm text-on-surface-variant"
    >
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded border transition-colors",
          checked
            ? "border-brand-muted bg-brand-muted text-on-brand"
            : "border-outline-variant bg-surface"
        )}
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheckedChange(e.target.checked)}
          className="sr-only"
        />
        {checked && (
          <svg viewBox="0 0 12 10" className="size-3" aria-hidden="true">
            <path
              d="M1 5.5L4 8.5L11 1.5"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      {label}
    </label>
  );
}

export function VenueFiltersSidebar({ filters, onChange, onApply }: VenueFiltersProps) {
  const toggleEventType = (type: string, checked: boolean) => {
    const eventTypes = checked
      ? [...filters.eventTypes, type]
      : filters.eventTypes.filter((t) => t !== type);
    onChange({ ...filters, eventTypes });
  };

  const toggleAmenity = (amenity: string, checked: boolean) => {
    const amenities = checked
      ? [...filters.amenities, amenity]
      : filters.amenities.filter((a) => a !== amenity);
    onChange({ ...filters, amenities });
  };

  return (
    <aside className="rounded-2xl bg-surface-container-low p-6 lg:sticky lg:top-28 lg:self-start">
      <div className="mb-6">
        <h2 className="text-headline-sm text-on-surface">Filters</h2>
        <p className="mt-1 text-sm text-text-muted">Refine your perfect space</p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label className="text-xs font-semibold tracking-wider text-text-muted uppercase">
            Location
          </Label>
          <div className="relative">
            <MapPin className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-muted" />
            <Input
              value={filters.location}
              onChange={(e) => onChange({ ...filters, location: e.target.value })}
              className="h-11 rounded-xl border-outline-variant bg-surface pl-10 text-sm"
              placeholder="London, UK"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Label className="text-xs font-semibold tracking-wider text-text-muted uppercase">
            Guest Capacity
          </Label>
          <input
            type="range"
            min={50}
            max={500}
            step={10}
            value={filters.capacity}
            onChange={(e) =>
              onChange({ ...filters, capacity: Number(e.target.value) })
            }
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-outline-variant accent-brand-muted"
          />
          <div className="flex justify-between text-xs text-text-muted">
            <span>50</span>
            <span className="font-medium text-on-surface">
              {filters.capacity >= 500 ? "500+" : filters.capacity}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-xs font-semibold tracking-wider text-text-muted uppercase">
            Price Range (Daily)
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              placeholder="Min"
              value={filters.priceMin}
              onChange={(e) => onChange({ ...filters, priceMin: e.target.value })}
              className="h-11 rounded-xl border-outline-variant bg-surface text-sm"
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.priceMax}
              onChange={(e) => onChange({ ...filters, priceMax: e.target.value })}
              className="h-11 rounded-xl border-outline-variant bg-surface text-sm"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Label className="mb-1 text-xs font-semibold tracking-wider text-text-muted uppercase">
            Event Type
          </Label>
          {FILTER_EVENT_TYPES.map((type) => (
            <FilterCheckbox
              key={type}
              id={`event-${type}`}
              label={type}
              checked={filters.eventTypes.includes(type)}
              onCheckedChange={(checked) => toggleEventType(type, checked)}
            />
          ))}
        </div>

        <div className="flex flex-col gap-1">
          <Label className="mb-1 text-xs font-semibold tracking-wider text-text-muted uppercase">
            Amenities
          </Label>
          {FILTER_AMENITIES.map((amenity) => (
            <FilterCheckbox
              key={amenity}
              id={`amenity-${amenity}`}
              label={amenity}
              checked={filters.amenities.includes(amenity)}
              onCheckedChange={(checked) => toggleAmenity(amenity, checked)}
            />
          ))}
        </div>

        <Button
          type="button"
          onClick={onApply}
          className="h-12 w-full rounded-xl bg-brand-muted text-sm font-semibold text-on-brand hover:bg-brand-muted/90"
        >
          Apply Filters
        </Button>
      </div>
    </aside>
  );
}
