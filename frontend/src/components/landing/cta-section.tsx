import Link from "next/link";
import { Sparkles } from "lucide-react";

export function CtaSection() {
  return (
    <section id="about" className="bg-surface-container-low py-16 md:py-24">
      <div className="mx-auto max-w-max px-margin-mobile md:px-margin-desktop">
        <div className="relative overflow-hidden rounded-3xl border border-border-subtle bg-surface px-8 py-12 shadow-elevation-card md:px-16 md:py-16">
          <div className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-primary-container/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full bg-secondary-container/10 blur-3xl" />

          <div className="relative flex flex-col items-start gap-6 md:max-w-xl">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary-container/10">
              <Sparkles className="size-6 text-primary-container" />
            </div>
            <h2 className="text-headline-md text-on-surface">
              Own a unique space? List it on BookMyVenue
            </h2>
            <p className="text-body-lg text-text-muted">
              Join thousands of hosts earning from their venues. Set your
              availability, manage bookings, and reach event planners worldwide.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/signup"
                className="rounded-full bg-primary-container px-6 py-3.5 text-label-md text-white shadow-lg shadow-primary-container/20 transition-all duration-200 hover:-translate-y-0.5"
              >
                Become a Host
              </Link>
              <Link
                href="/venues"
                className="rounded-full border border-border-subtle bg-surface px-6 py-3.5 text-label-md text-on-surface transition-colors hover:bg-surface-container-low"
              >
                Explore Venues
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
