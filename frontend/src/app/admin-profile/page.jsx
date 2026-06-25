
import React from "react";
import { AdminProfile } from "@/components/admin/admin-profile";

export const metadata = {
  title: "Admin Profile | BookMyVenue",
  description: "Manage admin profile details, security preferences, and control console settings.",
};

export default function AdminProfilePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background pt-4">
      <main className="flex-1">
        <AdminProfile />
      </main>
    </div>
  );
}
