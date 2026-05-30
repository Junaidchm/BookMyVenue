import Image from "next/image";

import type { Venue } from "@/lib/venues/data";

type VenueGalleryProps = {
  venue: Venue;
};

export function VenueGallery({ venue }: VenueGalleryProps) {
  const [img2, img3, img4, img5] = venue.images.gallery;

  return (
    <section className="mb-stack-lg grid h-[400px] min-h-[400px] grid-cols-1 gap-4 md:h-[614px] md:grid-cols-2">
      <div className="group relative h-full overflow-hidden rounded-xl">
        <Image
          src={venue.images.main}
          alt={`${venue.name} exterior`}
          fill
          priority
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      <div className="hidden h-full grid-cols-2 grid-rows-2 gap-4 md:grid">
        {[img2, img3, img4, img5].map((src, i) => (
          <div
            key={src}
            className="group relative overflow-hidden rounded-xl"
          >
            <Image
              src={src}
              alt={`${venue.name} gallery ${i + 2}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="25vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
