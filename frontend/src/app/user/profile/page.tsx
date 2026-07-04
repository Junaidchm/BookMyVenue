import type { Metadata } from "next";
import React from "react";
import { UserProfile } from "@/components/user/user-profile";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = {
  title: "My Profile | BookMyVenue",
  description: "View your bookings, saved venues, and edit your contact details.",
};

export default function UserProfilePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background pt-4">
      <main className="flex-1">
        <UserProfile />
      </main>
      <SiteFooter />
    </div>
  );
}