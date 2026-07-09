"use client";

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  AlertCircle,
  IndianRupee,
} from "lucide-react";
import bookingService from "@/services/booking.service";
import { cn } from "@/lib/utils";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function AnalyticsPage() {
  // ── Data Sources ────────────────────────────────────────────────────────────
  const {
    data: statsResponse,
    isLoading: statsLoading,
    isError: statsError,
  } = useQuery({
    queryKey: ["owner", "stats"],
    queryFn: () => bookingService.getOwnerStats(),
  });

  const {
    data: bookingsResponse,
    isLoading: bookingsLoading,
    isError: bookingsError,
  } = useQuery({
    queryKey: ["owner", "bookings"],
    queryFn: () => bookingService.getOwnerBookings(),
  });

  const stats = statsResponse?.data;
  const bookings: any[] = bookingsResponse?.data ?? [];

  const isLoading = statsLoading || bookingsLoading;
  const isError = statsError || bookingsError;

  // ── Derived Analytics ────────────────────────────────────────────────────────
  const derived = useMemo(() => {
    if (!bookings.length) {
      return {
        confirmed: 0,
        pending: 0,
        cancelled: 0,
        revenueByMonth: new Array(12).fill(0),
        bookingsByMonth: new Array(12).fill(0),
        maxRevenue: 0,
        maxBookings: 0,
      };
    }

    const confirmed = bookings.filter((b) => b.status === "CONFIRMED").length;
    const pending = bookings.filter((b) => b.status === "PENDING_PAYMENT").length;
    const cancelled = bookings.filter((b) => b.status === "CANCELLED").length;

    const revenueByMonth = new Array(12).fill(0);
    const bookingsByMonth = new Array(12).fill(0);

    bookings.forEach((b) => {
      const month = new Date(b.createdAt).getMonth();
      bookingsByMonth[month]++;
      if (b.status === "CONFIRMED") {
        revenueByMonth[month] += Number(b.totalPrice ?? 0);
      }
    });

    const maxRevenue = Math.max(...revenueByMonth, 1);
    const maxBookings = Math.max(...bookingsByMonth, 1);

    return { confirmed, pending, cancelled, revenueByMonth, bookingsByMonth, maxRevenue, maxBookings };
  }, [bookings]);

  // ── Metric cards ─────────────────────────────────────────────────────────────
  const metricCards = [
    {
      label: "Total Revenue",
      value: stats ? `₹${Number(stats.totalRevenue).toLocaleString("en-IN")}` : "—",
      icon: IndianRupee,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Total Bookings",
      value: stats?.totalCount ?? "—",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Confirmed",
      value: derived.confirmed,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Pending Payment",
      value: derived.pending,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Cancelled",
      value: derived.cancelled,
      icon: XCircle,
      color: "text-red-500",
      bg: "bg-red-50",
    },
    {
      label: "Upcoming Confirmed",
      value: stats?.activeCount ?? "—",
      icon: TrendingUp,
      color: "text-primary-container",
      bg: "bg-[#fcf2ed]",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-subtle pb-5">
        <div>
          <h1 className="text-4xl font-bold text-on-surface">Analytics</h1>
          <p className="mt-1.5 text-body-md text-text-muted">
            Real-time performance metrics derived from your booking data.
          </p>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#582200]" />
        </div>
      )}

      {/* Error */}
      {isError && !isLoading && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 flex items-start gap-4">
          <AlertCircle className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-bold text-red-800">Failed to Load Analytics</h3>
            <p className="text-body-md text-red-600 mt-1">
              Something went wrong while fetching analytics data. Please try again later.
            </p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && bookings.length === 0 && !stats?.totalCount && (
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center p-8 border border-dashed border-border-subtle rounded-2xl bg-white space-y-3 shadow-sm">
          <TrendingUp className="h-12 w-12 text-text-muted/50" />
          <h3 className="text-2xl font-bold text-on-surface">No Data Yet</h3>
          <p className="text-body-md text-text-muted max-w-sm">
            Analytics will appear once your venues receive their first confirmed bookings.
          </p>
        </div>
      )}

      {/* Content */}
      {!isLoading && !isError && (
        <>
          {/* ── Metric Cards Grid ─────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {metricCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className="rounded-2xl bg-white border border-border-subtle p-5 shadow-elevation-card flex flex-col gap-3"
                >
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", card.bg)}>
                    <Icon className={cn("h-5 w-5", card.color)} />
                  </div>
                  <div>
                    <p className="text-label-sm text-text-muted">{card.label}</p>
                    <p className="text-2xl font-bold text-on-surface mt-0.5">{card.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Monthly Bookings Chart ─────────────────────────────────────────── */}
          <div className="rounded-2xl bg-white border border-border-subtle p-6 shadow-elevation-card space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-on-surface">Bookings by Month</h2>
              <p className="text-label-sm text-text-muted mt-0.5">All bookings across all your venues this year</p>
            </div>
            <div className="h-52 flex items-end gap-2 pt-4 border-b border-border-subtle">
              {derived.bookingsByMonth.map((count, i) => {
                const pct = Math.round((count / derived.maxBookings) * 100);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group cursor-default">
                    <span className="text-[10px] font-semibold text-text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                      {count}
                    </span>
                    <div
                      className="w-full bg-primary-fixed hover:bg-primary-container rounded-t-lg transition-all duration-300"
                      style={{ height: pct > 0 ? `${Math.max(pct, 4)}%` : "2px" }}
                    />
                    <span className="text-[10px] font-bold text-text-muted">{MONTHS[i]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Monthly Revenue Chart ──────────────────────────────────────────── */}
          <div className="rounded-2xl bg-white border border-border-subtle p-6 shadow-elevation-card space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-on-surface">Revenue by Month</h2>
              <p className="text-label-sm text-text-muted mt-0.5">Confirmed booking revenue per month</p>
            </div>
            <div className="h-52 flex items-end gap-2 pt-4 border-b border-border-subtle">
              {derived.revenueByMonth.map((rev, i) => {
                const pct = Math.round((rev / derived.maxRevenue) * 100);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group cursor-default">
                    <span className="text-[10px] font-semibold text-text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                      {rev > 0 ? `₹${rev.toLocaleString("en-IN")}` : "—"}
                    </span>
                    <div
                      className="w-full bg-emerald-100 hover:bg-emerald-400 rounded-t-lg transition-all duration-300"
                      style={{ height: pct > 0 ? `${Math.max(pct, 4)}%` : "2px" }}
                    />
                    <span className="text-[10px] font-bold text-text-muted">{MONTHS[i]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Booking Status Breakdown ───────────────────────────────────────── */}
          <div className="rounded-2xl bg-white border border-border-subtle p-6 shadow-elevation-card space-y-4">
            <h2 className="text-2xl font-bold text-on-surface">Booking Status Breakdown</h2>
            <div className="space-y-3">
              {[
                { label: "Confirmed", count: derived.confirmed, color: "bg-green-400" },
                { label: "Pending Payment", count: derived.pending, color: "bg-amber-400" },
                { label: "Cancelled", count: derived.cancelled, color: "bg-red-400" },
              ].map((row) => {
                const total = bookings.length || 1;
                const pct = Math.round((row.count / total) * 100);
                return (
                  <div key={row.label} className="space-y-1">
                    <div className="flex justify-between text-label-sm">
                      <span className="font-medium text-on-surface">{row.label}</span>
                      <span className="text-text-muted">
                        {row.count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-surface-container-low overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all duration-500", row.color)}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
