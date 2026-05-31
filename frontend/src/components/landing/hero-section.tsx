import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, Search, Users } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[85vh] items-end overflow-hidden pt-24 pb-16 md:min-h-screen md:items-center md:pb-24">
      <div className="absolute inset-0 z-0">
        <Image
          src="/signup-hero.png"
          alt="Sun-drenched modern event space with floor-to-ceiling glass walls"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="hero-gradient absolute inset-0" />
        <div className="absolute inset-0 bg-on-surface/20" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-max px-margin-mobile md:px-margin-desktop">
        <div className="max-w-2xl space-y-6">
          <p className="inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-label-md text-white backdrop-blur-md">
            Premium venues for every occasion
          </p>
          <h1 className="text-display-lg-mobile text-white md:text-display-lg">
            Find the Perfect Space for Your Next Event
          </h1>
          <p className="max-w-lg text-body-lg text-white/90">
            Discover sunlit estates, urban lofts, and garden retreats — booked
            in minutes, trusted by 10k+ hosts worldwide.
          </p>
        </div>

        <form
          action="/venues"
          className="mt-10 flex max-w-3xl flex-col gap-3 rounded-2xl border border-white/40 bg-white/95 p-3 shadow-floating backdrop-blur-md md:flex-row md:items-center md:rounded-full md:p-2"
        >
          <label className="flex flex-1 items-center gap-3 border-border-subtle px-4 py-3 md:border-r md:py-2">
            <MapPin className="size-5 shrink-0 text-text-muted" />
            <span className="sr-only">Location</span>
            <input
              type="text"
              name="location"
              placeholder="Where?"
              className="w-full bg-transparent text-body-md text-on-surface outline-none placeholder:text-text-muted"
            />
          </label>

          <label className="flex flex-1 items-center gap-3 border-border-subtle px-4 py-3 md:border-r md:py-2">
            <CalendarDays className="size-5 shrink-0 text-text-muted" />
            <span className="sr-only">Date</span>
            <input
              type="date"
              name="date"
              className="w-full bg-transparent text-body-md text-on-surface outline-none"
            />
          </label>

          <label className="flex flex-1 items-center gap-3 px-4 py-3 md:py-2">
            <Users className="size-5 shrink-0 text-text-muted" />
            <span className="sr-only">Guests</span>
            <input
              type="number"
              name="guests"
              min={1}
              placeholder="Guests"
              className="w-full bg-transparent text-body-md text-on-surface outline-none placeholder:text-text-muted"
            />
          </label>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-full bg-primary-container px-6 py-3.5 text-label-md text-white shadow-lg shadow-primary-container/25 transition-all duration-200 hover:-translate-y-0.5 md:mr-1 md:size-12 md:shrink-0 md:p-0"
            aria-label="Search venues"
          >
            <Search className="size-5 md:size-5" />
            <span className="md:hidden">Search</span>
          </button>
        </form>

        <div className="mt-8 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2 text-label-md text-white/90">
            <span className="font-semibold text-white">10k+</span> hosts
          </div>
          <div className="h-4 w-px bg-white/30" />
          <div className="flex items-center gap-2 text-label-md text-white/90">
            <span className="font-semibold text-white">4.9</span> average rating
          </div>
          <div className="h-4 w-px bg-white/30" />
          <Link
            href="/venues"
            className="text-label-md text-white underline-offset-4 hover:underline"
          >
            Browse all venues
          </Link>
        </div>
      </div>
    </section>
  );
}
