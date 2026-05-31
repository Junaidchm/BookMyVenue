import type { Metadata } from "next";

import { CategorySection } from "@/components/landing/category-section";
import { CtaSection } from "@/components/landing/cta-section";
import { FeaturedVenuesSection } from "@/components/landing/featured-venues-section";
import { HeroSection } from "@/components/landing/hero-section";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNavbar } from "@/components/layout/site-navbar";

export const metadata: Metadata = {
  title: "BookMyVenue — Find the Perfect Event Space",
  description:
    "Discover and book premium venues for weddings, corporate events, parties, and more.",
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNavbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturedVenuesSection />
        <CategorySection />
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
