import type { Metadata } from "next";

import { UserHeader } from "@/components/user/user-header";
import { UserSidebar } from "@/components/user/user-sidebar";

export const metadata: Metadata = {
  title: "My Account | BookMyVenue",
  description: "Manage your bookings and saved venues",
};

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-on-background antialiased">
      <UserHeader />
      <div className="flex flex-1 pt-20">
        <UserSidebar />
        <div className="min-h-[calc(100vh-5rem)] flex-1 bg-surface md:ml-64">
          {children}
        </div>
      </div>
    </div>
  );
}
