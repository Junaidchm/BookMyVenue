import Link from "next/link";
import { Briefcase, Cake, Camera, Heart } from "lucide-react";

import { VENUE_CATEGORIES, type VenueCategory } from "@/lib/venues/data";

const CATEGORY_ICONS: Record<VenueCategory["icon"], typeof Heart> = {
  heart: Heart,
  briefcase: Briefcase,
  cake: Cake,
  camera: Camera,
};

export function CategorySection() {
  return (
    <section className="border-y border-border-subtle bg-surface py-16 md:py-20">
      <div className="mx-auto max-w-[var(--container-max)] px-margin-mobile md:px-margin-desktop">
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-headline-md text-on-surface">Browse by Category</h2>
          <p className="mt-2 text-body-md text-text-muted">
            Find the right atmosphere for your event type.
          </p>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {VENUE_CATEGORIES.map((category) => {
            const Icon = CATEGORY_ICONS[category.icon];
            return (
              <Link
                key={category.id}
                href={`/venues?category=${category.id}`}
                className="group flex min-w-[140px] flex-col items-center gap-3 rounded-2xl border border-border-subtle bg-surface-container-lowest px-6 py-8 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-container/30 hover:shadow-elevation-card-hover"
              >
                <div className="flex size-14 items-center justify-center rounded-full border border-border-subtle bg-surface transition-colors group-hover:border-primary-container/30 group-hover:bg-surface-container-low">
                  <Icon className="size-6 text-primary-container" />
                </div>
                <span className="text-label-md text-on-surface">{category.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
