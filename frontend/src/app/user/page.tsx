import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Heart,
  MessageSquare,
  CheckCircle,
  Star,
  Activity,
} from "lucide-react";

import { DASHBOARD_STATS, UPCOMING_BOOKINGS, SAVED_VENUES, RECENT_ACTIVITY } from "@/lib/user/data";
import { DashboardBookingCard } from "@/components/user/dashboard-booking-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard | BookMyVenue",
  description: "Your personalized dashboard",
};

export default function UserDashboardPage() {
  return (
    <main className="min-h-full p-margin-mobile md:p-margin-desktop">
      <div className="mx-auto max-w-[1200px]">
        <header className="mb-8">
          <h1 className="font-display text-display-md text-brand-muted">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-body-lg text-on-surface-variant">
            You have {UPCOMING_BOOKINGS.length} upcoming bookings this month.
          </p>
        </header>

        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="rounded-2xl border-none bg-surface-container-lowest shadow-sm">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-label-sm text-on-surface-variant">Total Bookings</p>
                <p className="font-display text-headline-lg font-bold text-on-surface">{DASHBOARD_STATS.totalBookings}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-none bg-surface-container-lowest shadow-sm">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
                <Heart className="h-6 w-6" />
              </div>
              <div>
                <p className="text-label-sm text-on-surface-variant">Saved Venues</p>
                <p className="font-display text-headline-lg font-bold text-on-surface">{DASHBOARD_STATS.savedVenues}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-none bg-surface-container-lowest shadow-sm">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                <Star className="h-6 w-6" />
              </div>
              <div>
                <p className="text-label-sm text-on-surface-variant">Loyalty Points</p>
                <p className="font-display text-headline-lg font-bold text-on-surface">
                  {DASHBOARD_STATS.loyaltyPoints.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <section className="mb-10">
              <h2 className="mb-6 font-display text-headline-md text-brand-muted">
                Upcoming Bookings
              </h2>
              <div className="flex flex-col gap-4">
                {UPCOMING_BOOKINGS.map((booking) => (
                  <DashboardBookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            </section>

            <section>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-display text-headline-md text-brand-muted">
                  Saved Venues
                </h2>
                <Link
                  href="/user/saved"
                  className="text-label-md font-semibold text-primary hover:underline"
                >
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {SAVED_VENUES.map((venue) => (
                  <Card
                    key={venue.id}
                    className="group relative overflow-hidden rounded-2xl border-none"
                  >
                    <div className="relative aspect-[4/3] w-full">
                      <Image
                        src={venue.image}
                        alt={venue.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/90 text-red-500 hover:bg-white"
                      >
                        <Heart className="h-4 w-4 fill-current" />
                      </Button>
                      <div className="absolute right-4 bottom-4 left-4">
                        <p className="text-body-md font-medium text-white">
                          {venue.name}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <Card className="rounded-2xl border-none bg-surface-container-lowest shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="font-display text-headline-sm font-normal text-brand-muted">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-6">
                  {RECENT_ACTIVITY.map((activity, index) => {
                    const Icon = activity.icon === "check-circle" ? CheckCircle : activity.icon === "message-square" ? MessageSquare : Heart;
                    return (
                      <div key={activity.id} className="flex gap-4">
                        <div className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                          activity.type === "booking-confirmed" ? "bg-orange-50 text-orange-600" :
                          activity.type === "message" ? "bg-blue-50 text-blue-500" :
                          "bg-red-50 text-red-500"
                        )}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col justify-center">
                          <p className="text-body-md text-on-surface">
                            {activity.type === "booking-confirmed" ? (
                              <>
                                Booking confirmed for <span className="font-semibold">{activity.title.replace("Booking confirmed for ", "")}</span>
                              </>
                            ) : activity.type === "message" ? (
                              <>
                                New message from <span className="font-semibold">{activity.title.replace("New message from ", "")}</span>
                              </>
                            ) : (
                              <>
                                You saved <span className="font-semibold">{activity.title.replace("You saved ", "").replace(" to favorites.", "")}</span> to favorites.
                              </>
                            )}
                          </p>
                          <p className="text-label-sm text-on-surface-variant">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-8 text-center">
                  <Link
                    href="#"
                    className="text-label-md font-semibold text-primary hover:underline"
                  >
                    View All Activity
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
