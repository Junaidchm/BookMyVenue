"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  XCircle,
  Calendar,
  User,
  Mail,
  Clock,
  Building,
  AlertTriangle,
} from "lucide-react";
import bookingService from "@/services/booking.service";
import { cn } from "@/lib/utils";

// Formatting helper matching project style
const formatCurrency = (val: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
};

export default function BookingsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // 1. Fetch bookings
  const { data: bookingsData, isLoading, isError, error } = useQuery({
    queryKey: ["owner", "bookings"],
    queryFn: () => bookingService.getOwnerBookings(),
  });
  const bookings = bookingsData?.data ?? [];

  // 2. Cancellation Mutation
  const cancelMutation = useMutation({
    mutationFn: (bookingId: string) => bookingService.cancelBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner", "bookings"] });
      queryClient.invalidateQueries({ queryKey: ["owner", "bookings", "stats"] });
      setCancellingId(null);
    },
    onError: (err: any) => {
      alert(err.message || "Failed to cancel booking. Please try again.");
      setCancellingId(null);
    },
  });

  // Filter Logic
  const filteredBookings = bookings.filter((booking: any) => {
    const matchesSearch =
      booking.venueName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guestEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination calculations
  const totalItems = filteredBookings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setExpandedRow(null);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
    setExpandedRow(null);
  };

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-subtle pb-5">
        <div>
          <h1 className="text-4xl font-bold text-on-surface">Bookings Ledger</h1>
          <p className="mt-1.5 text-body-md text-text-muted">
            Inspect customer reservations, check payment statuses, and manage schedules.
          </p>
        </div>
      </div>

      {/* Query Loading */}
      {isLoading && (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#582200]" />
        </div>
      )}

      {/* Query Error */}
      {isError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 flex items-start gap-4">
          <AlertCircle className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-bold text-red-800">Failed to Load Bookings</h3>
            <p className="text-body-md text-red-600 mt-1">
              {error instanceof Error ? error.message : "Something went wrong while fetching booking records."}
            </p>
          </div>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="space-y-6">
          {/* Controls Bar: Search & Status Filter */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white border border-border-subtle p-4 rounded-2xl shadow-elevation-card">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search guest, email, or venue..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                  setExpandedRow(null);
                }}
                className="w-full rounded-full border border-border-subtle py-2.5 pl-10 pr-4 text-body-md focus:border-primary-container focus:outline-none transition-colors"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-1 bg-stone-100 p-1 rounded-xl">
              {[
                { label: "All", value: "ALL" },
                { label: "Confirmed", value: "CONFIRMED" },
                { label: "Pending Payment", value: "PENDING_PAYMENT" },
                { label: "Cancelled", value: "CANCELLED" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => handleStatusFilterChange(tab.value)}
                  className={cn(
                    "rounded-lg px-3.5 py-1.5 text-label-md font-semibold transition-all duration-200",
                    statusFilter === tab.value
                      ? "bg-white text-on-surface shadow-sm"
                      : "text-text-muted hover:text-on-surface"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table Ledger Card */}
          <div className="rounded-2xl bg-white border border-border-subtle shadow-elevation-card overflow-hidden">
            {filteredBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center text-text-muted">
                <Calendar className="h-10 w-10 mb-3 text-text-muted/65" />
                <p className="text-body-lg font-medium">No bookings found</p>
                <p className="text-body-md text-text-muted/80 mt-1">
                  Try adjusting your filters or search search terms.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-body-md">
                  <thead>
                    <tr className="border-b border-border-subtle bg-stone-50/55 text-label-sm uppercase tracking-wider text-text-muted/80">
                      <th className="px-6 py-4 font-semibold">Venue & Guest</th>
                      <th className="px-6 py-4 font-semibold">Scheduled Date</th>
                      <th className="px-6 py-4 font-semibold text-right">Amount</th>
                      <th className="px-6 py-4 font-semibold text-center">Status</th>
                      <th className="w-16 px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle/40">
                    {paginatedBookings.map((booking: any) => {
                      const isExpanded = expandedRow === booking.id;
                      const isConfirmed = booking.status === "CONFIRMED";
                      const isPending = booking.status === "PENDING_PAYMENT";
                      const isCancelled = booking.status === "CANCELLED";

                      return (
                        <React.Fragment key={booking.id}>
                          {/* Main Row */}
                          <tr
                            onClick={() => toggleRow(booking.id)}
                            className={cn(
                              "group cursor-pointer hover:bg-stone-50/45 transition-colors",
                              isExpanded && "bg-stone-50/30"
                            )}
                          >
                            <td className="px-6 py-5">
                              <div className="flex flex-col">
                                <span className="font-semibold text-on-surface text-body-lg group-hover:text-primary-container transition-colors">
                                  {booking.venueName}
                                </span>
                                <span className="text-label-md text-text-muted mt-0.5">
                                  {booking.guestName}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <span className="font-medium text-on-surface">
                                {new Date(booking.bookingDate).toLocaleDateString("en-US", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-right font-bold text-on-surface">
                              {formatCurrency(Number(booking.totalPrice))}
                            </td>
                            <td className="px-6 py-5 text-center">
                              <span
                                className={cn(
                                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-label-sm font-bold shadow-sm",
                                  isConfirmed && "bg-sky-50 text-sky-700 border border-sky-100",
                                  isPending && "bg-orange-50 text-orange-700 border border-orange-100",
                                  isCancelled && "bg-red-50 text-red-700 border border-red-100"
                                )}
                              >
                                <span
                                  className={cn(
                                    "h-1.5 w-1.5 rounded-full",
                                    isConfirmed && "bg-sky-500",
                                    isPending && "bg-orange-500",
                                    isCancelled && "bg-red-500"
                                  )}
                                />
                                {isConfirmed ? "Confirmed" : isPending ? "Pending Payment" : "Cancelled"}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-center">
                              <div className="rounded-full p-1.5 text-text-muted hover:bg-stone-100 hover:text-on-surface transition-all">
                                {isExpanded ? (
                                  <ChevronUp className="h-5 w-5" />
                                ) : (
                                  <ChevronDown className="h-5 w-5" />
                                )}
                              </div>
                            </td>
                          </tr>

                          {/* Expanded Row */}
                          {isExpanded && (
                            <tr>
                              <td colSpan={5} className="bg-stone-50/20 px-8 py-6 border-t border-border-subtle/50">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                  {/* Left: Info details */}
                                  <div className="space-y-4">
                                    <h4 className="text-label-md font-bold text-text-muted uppercase tracking-wider">
                                      Reservation Details
                                    </h4>
                                    <div className="space-y-3.5">
                                      <div className="flex items-center gap-3 text-body-md text-on-surface">
                                        <Building className="h-4.5 w-4.5 text-text-muted shrink-0" />
                                        <span className="font-semibold">{booking.venueName}</span>
                                      </div>
                                      <div className="flex items-center gap-3 text-body-md text-on-surface">
                                        <Clock className="h-4.5 w-4.5 text-text-muted shrink-0" />
                                        <span>
                                          {new Date(booking.startTime).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}{" "}
                                          -{" "}
                                          {new Date(booking.endTime).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-3 text-body-md text-on-surface">
                                        <User className="h-4.5 w-4.5 text-text-muted shrink-0" />
                                        <span>{booking.guestName}</span>
                                      </div>
                                      <div className="flex items-center gap-3 text-body-md text-on-surface">
                                        <Mail className="h-4.5 w-4.5 text-text-muted shrink-0" />
                                        <a href={`mailto:${booking.guestEmail}`} className="text-primary-container hover:underline">
                                          {booking.guestEmail}
                                        </a>
                                      </div>
                                      <div className="text-[11px] text-text-muted mt-2 font-mono">
                                        ID: {booking.id}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Right: Actions / Quick cancellation */}
                                  <div className="flex flex-col justify-between border-t border-border-subtle/40 pt-4 md:border-t-0 md:border-l md:border-border-subtle/40 md:pl-8 md:pt-0">
                                    <div className="space-y-2">
                                      <h4 className="text-label-md font-bold text-text-muted uppercase tracking-wider">
                                        Actions
                                      </h4>
                                      <p className="text-label-sm text-text-muted">
                                        Manage reservations directly. Cancellation updates the schedule immediately.
                                      </p>
                                    </div>

                                    <div className="mt-4 flex items-center gap-3">
                                      {/* Cancel Trigger */}
                                      {!isCancelled && cancellingId !== booking.id && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setCancellingId(booking.id);
                                          }}
                                          className="rounded-full border border-red-200 bg-red-50 px-5 py-2 text-label-md font-bold text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors"
                                        >
                                          Cancel Booking
                                        </button>
                                      )}

                                      {/* Cancellation Confirm Panel */}
                                      {cancellingId === booking.id && (
                                        <div
                                          className="rounded-xl border border-red-200 bg-red-50/50 p-4 w-full space-y-3"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <div className="flex items-start gap-2.5 text-red-700">
                                            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-red-500" />
                                            <p className="text-label-sm font-semibold">
                                              Are you sure you want to cancel this booking? This action is permanent.
                                            </p>
                                          </div>
                                          <div className="flex items-center gap-2.5">
                                            <button
                                              onClick={() => cancelMutation.mutate(booking.id)}
                                              disabled={cancelMutation.isPending}
                                              className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-label-sm font-bold text-white hover:bg-red-700 disabled:opacity-50"
                                            >
                                              {cancelMutation.isPending ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                              ) : (
                                                "Confirm Cancel"
                                              )}
                                            </button>
                                            <button
                                              onClick={() => setCancellingId(null)}
                                              disabled={cancelMutation.isPending}
                                              className="rounded-lg border border-border-subtle bg-white px-3.5 py-1.5 text-label-sm font-bold text-on-surface hover:bg-stone-50"
                                            >
                                              Back
                                            </button>
                                          </div>
                                        </div>
                                      )}

                                      {isCancelled && (
                                        <div className="flex items-center gap-2 text-red-700 font-semibold text-body-md bg-red-50/40 border border-red-100 px-3 py-1.5 rounded-lg">
                                          <XCircle className="h-5 w-5 text-red-500" />
                                          <span>This booking was cancelled.</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border-subtle pt-4">
              <span className="text-label-sm text-text-muted">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} bookings
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-border-subtle px-3.5 py-1.5 text-label-sm font-bold text-on-surface hover:bg-stone-50 disabled:opacity-50 transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={cn(
                      "rounded-lg px-3.5 py-1.5 text-label-sm font-bold transition-all",
                      currentPage === page
                        ? "bg-primary-container text-white"
                        : "border border-border-subtle text-on-surface hover:bg-stone-50"
                    )}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-border-subtle px-3.5 py-1.5 text-label-sm font-bold text-on-surface hover:bg-stone-50 disabled:opacity-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
