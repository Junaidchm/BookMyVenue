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
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased">
      <UserHeader />
      <div className="flex flex-1">
        <UserSidebar />
        <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 pt-24 md:pt-8 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
