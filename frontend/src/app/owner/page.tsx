"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import bookingService from "@/services/booking.service";
import { formatVenuePrice } from "@/lib/venues/listing";
import { useAuth } from "@/components/auth/session-provider";
import {
  Search,
  Bell,
  Settings as GearIcon,
  Plus,
  Megaphone,
  TrendingUp,
  Calendar as CalendarIcon,
  Star,
  Mail,
  MoreHorizontal,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";



export default function OverviewPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsCount, setNotificationsCount] = useState(3);
  const [showPromoAlert, setShowPromoAlert] = useState(false);

  // ─── TanStack Query Integration ───
  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ["owner", "stats"],
    queryFn: () => bookingService.getOwnerStats(),
  });
  const stats = statsData?.data;

  const { data: bookingsData, isLoading: isLoadingBookings, isError: isErrorBookings } = useQuery({
    queryKey: ["owner", "bookings"],
    queryFn: () => bookingService.getOwnerBookings(),
  });
  const recentBookings = bookingsData?.data ?? [];

  // Filter bookings based on search query locally
  const filteredBookings = recentBookings
    .filter((b: any) => {
      if (!searchQuery.trim()) return true;
      return (
        b.venueName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.guestName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .slice(0, 5);

  // Filter and sort for confirmed upcoming events dynamically
  const now = new Date();
  const upcomingEvents = recentBookings
    .filter((b: any) => {
      return b.status === "CONFIRMED" && new Date(b.endTime) >= now;
    })
    .sort((a: any, b: any) => {
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    })
    .slice(0, 3)
    .map((b: any, index: number) => {
      const startDate = new Date(b.startTime);
      const startMonthStr = startDate.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
      const startDayStr = startDate.toLocaleDateString("en-US", { day: "numeric" });
      const timeStr = startDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

      return {
        id: b.id,
        title: b.guestName ? `${b.guestName}'s Event` : "Customer Booking",
        venue: b.venueName,
        time: timeStr,
        month: startMonthStr,
        day: startDayStr,
        isPrimary: index === 0,
      };
    });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="space-y-8">
      {/* ─── TOP HEADER CONTROLS ────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Bar Widget (mockup-style peach container) */}
        <div className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-text-muted">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            placeholder="Search bookings, venues..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full rounded-full border-none bg-surface-container-low py-3.5 pl-12 pr-4 text-body-md text-on-surface placeholder:text-text-muted/60 focus-ring-brand shadow-sm"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3.5 self-end sm:self-auto">
          {/* Notification Button */}
          <button
            onClick={() => setNotificationsCount(0)}
            className="relative rounded-full bg-white p-3 border border-border-subtle hover:bg-stone-50 transition-colors shadow-sm"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-on-surface" />
            {notificationsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                {notificationsCount}
              </span>
            )}
          </button>

          {/* Settings Icon */}
          <button
            className="rounded-full bg-white p-3 border border-border-subtle hover:bg-stone-50 transition-colors shadow-sm"
            aria-label="Dashboard settings"
          >
            <GearIcon className="h-5 w-5 text-on-surface" />
          </button>

          {/* + Add Venue Button */}
          <Link
            href="/owner/venues/new"
            className="flex items-center gap-2 rounded-full bg-[#582200] px-5 py-3 text-label-md font-bold text-white shadow-lg shadow-[#582200]/10 transition-all duration-200 hover:bg-[#3c2d26] hover:-translate-y-0.5 active:scale-95"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>Add Venue</span>
          </Link>
        </div>
      </div>

      {/* ─── WELCOME BANNER & ACTION ────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pt-2">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface md:text-5xl">
            Welcome back, {user?.fullName?.split(" ")[0] || "Owner"}
          </h1>
          <p className="mt-2 text-body-md text-text-muted">
            Here&apos;s what&apos;s happening with your venues today.
          </p>
        </div>
      </div>

      {/* ─── LIVE ALERT (PROMOTIONS FEEDBACK) ───────────────────────────────── */}
      {showPromoAlert && (
        <div className="rounded-2xl border border-primary-container/20 bg-primary-fixed p-4 shadow-elevation-floating animate-fade-in flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-primary-container" />
            <p className="text-body-md font-medium text-on-primary-fixed">
              Promotion widget opened! You can launch flash discounts and deals from here.
            </p>
          </div>
          <button
            onClick={() => setShowPromoAlert(false)}
            className="text-label-sm font-bold text-primary-container hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ─── HIGH-LEVEL STATS GRID (4 COLUMNS) ─────────────────────────────── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Total Revenue */}
        <div className="rounded-2xl bg-white border border-border-subtle p-6 shadow-elevation-card hover:shadow-elevation-card-hover transition-all duration-200 group hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-label-md text-text-muted">Total Revenue</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-low text-primary-container">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold tracking-tight text-on-surface">
              {isLoadingStats ? "..." : formatVenuePrice(stats?.totalRevenue ?? 0)}
            </span>
            <div className="mt-3.5 flex items-center gap-2">
              <span className="inline-flex items-center gap-0.5 rounded-full bg-[#fcf2ed] px-2.5 py-1 text-[11px] font-bold text-primary-container">
                +12.5%
              </span>
              <span className="text-label-sm text-text-muted">vs last month</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Active Bookings */}
        <div className="rounded-2xl bg-white border border-border-subtle p-6 shadow-elevation-card hover:shadow-elevation-card-hover transition-all duration-200 group hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-label-md text-text-muted">Active Bookings</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-low text-primary-container">
              <CalendarIcon className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold tracking-tight text-on-surface">
              {isLoadingStats ? "..." : (stats?.activeCount ?? 0)}
            </span>
            <div className="mt-3.5 flex items-center gap-2">
              <span className="inline-flex items-center gap-0.5 rounded-full bg-[#fcf2ed] px-2.5 py-1 text-[11px] font-bold text-primary-container">
                +3
              </span>
              <span className="text-label-sm text-text-muted">this week</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Average Rating */}
        <div className="rounded-2xl bg-white border border-border-subtle p-6 shadow-elevation-card hover:shadow-elevation-card-hover transition-all duration-200 group hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-label-md text-text-muted">Average Rating</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-low text-primary-container">
              <Star className="h-5 w-5 fill-current" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold tracking-tight text-on-surface">4.9</span>
            <div className="mt-3.5 flex items-center gap-1.5 text-label-sm text-text-muted">
              <div className="flex gap-0.5 text-primary-container">
                <Star className="h-3.5 w-3.5 fill-current" />
                <Star className="h-3.5 w-3.5 fill-current" />
                <Star className="h-3.5 w-3.5 fill-current" />
                <Star className="h-3.5 w-3.5 fill-current" />
                <Star className="h-3.5 w-3.5 fill-current" />
              </div>
              <span className="font-semibold text-on-surface ml-1">(128 reviews)</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Pending Inquiries */}
        <div className="rounded-2xl bg-white border border-border-subtle p-6 shadow-elevation-card hover:shadow-elevation-card-hover transition-all duration-200 group hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-label-md text-text-muted">Pending Inquiries</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-low text-primary-container">
              <Mail className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold tracking-tight text-on-surface">
              {isLoadingStats ? "..." : (stats?.pendingCount ?? 0)}
            </span>
            <div className="mt-3.5">
              <Link
                href="/owner/venues"
                className="inline-flex items-center gap-1 text-label-sm font-bold text-primary-container group-hover:underline"
              >
                <span>Review now</span>
                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ─── TWO-COLUMN CONTENT AREA (RECENT BOOKINGS & UPCOMING EVENTS) ─────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Recent Bookings Table (2/3 width on desktop) */}
        <div className="rounded-2xl bg-white border border-border-subtle p-6 shadow-elevation-card lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-on-surface">Recent Bookings</h2>
            <Link
              href="/owner/bookings"
              className="text-label-sm font-semibold text-primary-container hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-body-md">
              <thead>
                <tr className="border-b border-border-subtle/60 text-label-sm uppercase tracking-wider text-text-muted/80">
                  <th className="pb-3.5 font-semibold">Venue & Guest</th>
                  <th className="pb-3.5 font-semibold">Date</th>
                  <th className="pb-3.5 font-semibold">Status</th>
                  <th className="pb-3.5 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/40">
                {isLoadingBookings ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-text-muted">
                      Loading recent bookings...
                    </td>
                  </tr>
                ) : isErrorBookings ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-red-500">
                      Failed to load recent bookings.
                    </td>
                  </tr>
                ) : filteredBookings.length > 0 ? (
                  filteredBookings.map((booking: any) => {
                    const statusText =
                      booking.status === "CONFIRMED"
                        ? "Confirmed"
                        : booking.status === "PENDING_PAYMENT"
                        ? "Pending"
                        : booking.status;

                    return (
                      <tr key={booking.id} className="group/row">
                        <td className="py-4 pr-3">
                          <div className="flex items-center gap-3">
                            <img
                              src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=150&auto=format&fit=crop&q=80"
                              alt={booking.venueName}
                              className="h-11 w-11 rounded-lg object-cover border border-border-subtle shadow-sm transition-transform duration-200 group-hover/row:scale-105"
                            />
                            <div className="flex flex-col">
                              <span className="text-label-md font-semibold text-on-surface">
                                {booking.venueName}
                              </span>
                              <span className="text-label-sm text-text-muted mt-0.5">
                                {booking.guestName}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 pr-3 text-text-muted font-medium">
                          {new Date(booking.bookingDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-4 pr-3">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold",
                              booking.status === "CONFIRMED"
                                ? "bg-sky-50 text-sky-700"
                                : booking.status === "PENDING_PAYMENT"
                                ? "bg-orange-50 text-orange-700"
                                : "bg-red-50 text-red-700"
                            )}
                          >
                            {statusText}
                          </span>
                        </td>
                        <td className="py-4 text-right font-semibold text-on-surface">
                          {formatVenuePrice(Number(booking.totalPrice))}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-text-muted">
                      No matching bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Upcoming Events List (1/3 width on desktop) */}
        <div className="rounded-2xl bg-white border border-border-subtle p-6 shadow-elevation-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-on-surface">Upcoming Events</h2>
              <button
                className="rounded-lg p-1.5 text-text-muted hover:bg-surface-container-low transition-colors"
                aria-label="Actions"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>

            {/* List of Events */}
            <div className="space-y-5">
              {isLoadingBookings ? (
                <div className="text-body-md text-text-muted">Loading events...</div>
              ) : isErrorBookings ? (
                <div className="text-body-md text-red-500">Failed to load events.</div>
              ) : upcomingEvents.length > 0 ? (
                upcomingEvents.map((event: any) => (
                  <div key={event.id} className="flex items-center gap-4 group/event">
                    {/* Styled Date Block */}
                    <div
                      className={cn(
                        "flex h-[60px] w-[60px] shrink-0 flex-col items-center justify-center rounded-2xl shadow-sm transition-all duration-200 group-hover/event:-translate-y-0.5",
                        event.isPrimary
                          ? "bg-primary-container text-white"
                          : "bg-surface-container-high text-primary-container border border-border-subtle/50"
                      )}
                    >
                      <span className="text-[10px] font-bold tracking-wider uppercase leading-none opacity-90">
                        {event.month}
                      </span>
                      <span className="text-lg font-bold mt-1 leading-none">
                        {event.day}
                      </span>
                    </div>

                    {/* Event details */}
                    <div className="flex flex-col min-w-0">
                      <span className="text-label-md font-bold text-on-surface truncate group-hover/event:text-primary-container transition-colors">
                        {event.title}
                      </span>
                      <span className="text-label-sm text-text-muted mt-1 truncate">
                        {event.venue} &bull; {event.time}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-body-md text-text-muted">No upcoming events scheduled.</div>
              )}
            </div>
          </div>


        </div>
      </div>


    </div>
  );
}
