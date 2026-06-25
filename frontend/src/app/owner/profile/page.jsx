import React from "react";
import { OwnerProfile } from "@/components/owner/owner-profile";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata = {
  title: "Venue Owner Profile | BookMyVenue",
  description: "Manage your host details, monitor your venues dashboard stats, and edit your portal profile.",
};

export default function OwnerProfilePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background pt-4">
      <main className="flex-1">
        <OwnerProfile />
      </main>
      <SiteFooter />
    </div>
  );
}
