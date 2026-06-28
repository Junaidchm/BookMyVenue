"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, ChevronLeft } from "lucide-react";
import { getAllVenues, Venue } from "@/lib/venues/data";
import { VenueCard } from "@/components/user/user-profile-venue-card";
import "@/components/ProfileDashboard/ProfileDashboard.css";

export default function UserSavedVenuesPage() {
  const [savedVenueIds, setSavedVenueIds] = useState<string[]>([]);
  const featured = getAllVenues();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("bmv_wishlist");
      if (!stored) {
        const initialWishlist = ["2", "3"];
        localStorage.setItem("bmv_wishlist", JSON.stringify(initialWishlist));
        setSavedVenueIds(initialWishlist);
      } else {
        try {
          setSavedVenueIds(JSON.parse(stored));
        } catch (e) {
          console.error("Error parsing bmv_wishlist:", e);
        }
      }
    }
  }, []);

  const savedVenues = featured.filter((v: Venue) => savedVenueIds.includes(v.id));

  return (
    <div className="flex flex-col gap-6 pb-8">
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link
                href="/user"
                className="flex items-center gap-1 text-sm font-medium text-text-muted hover:text-on-surface transition-colors"
              >
                <ChevronLeft className="size-4" /> Back to Dashboard
              </Link>
            </div>
            <h1 className="text-headline-md text-on-surface">
              ❤️ Saved Venues
            </h1>
            <p className="text-text-muted text-body-md mt-1">
              Here are all the venues you've saved.
            </p>
          </div>
        </header>

        {/* Saved Venues grid */}
        <div className="dash-card">
          <div className="dash-card__body">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {savedVenues.map((venue: Venue) => (
                <VenueCard
                  key={venue.id}
                  venue={venue}
                  isSaved={true}
                  onToggleSave={(venue, isSaved) => {
                    if (!isSaved) {
                      setSavedVenueIds((prev) => prev.filter((vId) => vId !== venue.id));
                    }
                  }}
                />
              ))}
            </div>
            {savedVenues.length === 0 && (
              <div style={{ width: "100%", padding: "4rem 2rem", textAlign: "center", color: "var(--clr-text-muted)" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>❤️</div>
                <h3 className="font-bold text-lg mb-1" style={{ color: "var(--clr-text)" }}>No saved venues yet</h3>
                <p style={{ fontSize: "0.9rem" }}>Explore our amazing venues and click the heart icon to save them!</p>
                <Link
                  href="/"
                  className="btn btn--primary"
                  style={{ display: "inline-block", marginTop: "1.5rem", padding: "10px 20px", textDecoration: "none" }}
                >
                  Explore Venues
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
