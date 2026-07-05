"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Loader2, AlertCircle } from "lucide-react";
import bookingService from "@/services/booking.service";
import { cn } from "@/lib/utils";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-indexed

  // Fetch bookings for the owner
  const { data: bookingsData, isLoading, isError, error } = useQuery({
    queryKey: ["owner", "bookings"],
    queryFn: () => bookingService.getOwnerBookings(),
  });
  const bookings = bookingsData?.data ?? [];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const monthName = currentDate.toLocaleString("en-US", { month: "long" });

  // Calendar calculations
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-border-subtle pb-5">
        <div>
          <h1 className="text-4xl font-bold text-on-surface">Calendar</h1>
          <p className="mt-1.5 text-body-md text-text-muted">Schedule and manage upcoming events.</p>
        </div>
      </div>

      {isLoading && (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#582200]" />
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 flex items-start gap-4">
          <AlertCircle className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-bold text-red-800">Failed to Load Calendar</h3>
            <p className="text-body-md text-red-600 mt-1">
              {error instanceof Error ? error.message : "Something went wrong while fetching events."}
            </p>
          </div>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="rounded-2xl bg-white border border-border-subtle p-6 shadow-elevation-card space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-on-surface">{monthName} {currentYear}</h2>
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevMonth}
                className="rounded-full p-2 border border-border-subtle hover:bg-stone-50 transition-colors"
                aria-label="Previous Month"
              >
                <ChevronLeft className="h-5 w-5 text-on-surface" />
              </button>
              <button
                onClick={handleNextMonth}
                className="rounded-full p-2 border border-border-subtle hover:bg-stone-50 transition-colors"
                aria-label="Next Month"
              >
                <ChevronRight className="h-5 w-5 text-on-surface" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-3 text-center">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <span key={day} className="text-label-sm font-bold text-text-muted uppercase tracking-wider py-2">
                {day}
              </span>
            ))}

            {/* Empty cells to align first day of the week */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[90px] rounded-xl border border-transparent p-2" />
            ))}

            {/* Calendar Days */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const dayNum = i + 1;

              // Filter bookings matching this date
              const dayBookings = bookings.filter((b: any) => {
                const bookingDate = new Date(b.bookingDate);
                return (
                  bookingDate.getFullYear() === currentYear &&
                  bookingDate.getMonth() === currentMonth &&
                  bookingDate.getDate() === dayNum
                );
              });

              const hasEvent = dayBookings.length > 0;

              return (
                <div
                  key={dayNum}
                  className={cn(
                    "relative min-h-[90px] rounded-xl border border-border-subtle/50 p-2 text-left transition-all",
                    hasEvent ? "bg-primary-fixed/10 border-primary-container/10" : "bg-stone-50/30 hover:bg-stone-50"
                  )}
                >
                  <span className={cn("text-label-md font-semibold", hasEvent ? "text-primary-container" : "text-on-surface")}>
                    {dayNum}
                  </span>
                  <div className="mt-1 space-y-1 max-h-[60px] overflow-y-auto scrollbar-none">
                    {dayBookings.map((b: any) => {
                      const isConfirmed = b.status === "CONFIRMED";
                      return (
                        <div
                          key={b.id}
                          title={`${b.venueName} - ${b.guestName}`}
                          className={cn(
                            "rounded px-1.5 py-0.5 text-[9px] font-bold text-white truncate shadow-sm",
                            isConfirmed ? "bg-sky-600" : "bg-orange-600"
                          )}
                        >
                          {b.venueName}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
