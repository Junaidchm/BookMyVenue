import { SiteNavbar } from "@/components/layout/site-navbar";
import { VenuesListing } from "@/components/venues/venues-listing";
import { getAllVenues } from "@/lib/venues/data";

export default function VenuesPage() {
  const venues = getAllVenues();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNavbar />
      <main className="mx-auto w-full max-w-[var(--container-max)] flex-1 px-gutter py-8">
        <VenuesListing venues={venues} />
      </main>
    </div>
  );
}
