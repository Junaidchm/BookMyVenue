import {
  Car,
  ChefHat,
  Speaker,
  Wifi,
  type LucideIcon,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import type { VenueAmenity } from "@/lib/venues/data";

const ICONS: Record<VenueAmenity["icon"], LucideIcon> = {
  wifi: Wifi,
  kitchen: ChefHat,
  parking: Car,
  speaker: Speaker,
};

type VenueAmenitiesProps = {
  amenities: VenueAmenity[];
};

export function VenueAmenities({ amenities }: VenueAmenitiesProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {amenities.map((amenity) => {
        const Icon = ICONS[amenity.icon];
        return (
          <Card
            key={amenity.label}
            className="gap-0 rounded-xl border border-stone-100 bg-surface py-0 shadow-sm"
          >
            <CardContent className="flex flex-col items-center justify-center p-4">
              <Icon className="mb-2 size-8 text-brand-muted" />
              <span className="text-center text-label-md text-on-surface">
                {amenity.label}
              </span>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
