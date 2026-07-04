"use client";

import { CalendarDays, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { Venue } from "@/lib/venues/data";
import { formatVenuePrice } from "@/lib/venues/listing";

type BookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  venue: Venue;
  date: string;
  startTime: string;
  hours: string;
  sessionIndex: string;
  isPerSession: boolean;
  total: number;
  onConfirm: () => void;
};

export function BookingModal({
  isOpen,
  onClose,
  venue,
  date,
  startTime,
  hours,
  sessionIndex,
  isPerSession,
  total,
  onConfirm,
}: BookingModalProps) {
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "Select a date";
    try {
      const option: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };
      return new Date(dateStr).toLocaleDateString("en-IN", option);
    } catch {
      return dateStr;
    }
  };

  const serviceFee = Math.round(total * 0.05);
  const gstTax = Math.round(total * 0.18);
  const grandTotal = total + serviceFee + gstTax;

  return (
    <Dialog open={isOpen} onOpenChange={(val) => { if (!val) onClose(); }}>
      <DialogContent className="max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-stone-100 animate-in fade-in duration-200">
        <DialogHeader className="pb-3 border-b border-stone-100">
          <DialogTitle className="text-xl font-bold text-gray-900">Confirm Reservation</DialogTitle>
          <DialogDescription className="text-xs text-stone-500">
            Please verify your selections and booking slot details.
          </DialogDescription>
        </DialogHeader>

        {/* Content boxes representing details */}
        <div className="grid grid-cols-2 gap-3 my-4">
          {/* Venue Card Box */}
          <div className="col-span-2 rounded-xl bg-stone-50 p-3.5 border border-stone-200/60 flex gap-3 items-center">
            <img
               src={venue.images.main}
              alt={venue.name}
              className="size-12 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-950 text-sm truncate">{venue.name}</h4>
              <p className="text-xs text-stone-500 truncate">{venue.location}</p>
            </div>
          </div>

          {/* Date Representing Box */}
          <div className="rounded-xl border border-stone-200 bg-white p-3 flex flex-col justify-between hover:border-orange-200 transition-colors shadow-sm">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Date</span>
            <div className="flex items-center gap-2 mt-1.5 text-stone-850">
              <CalendarDays className="size-4 text-orange-500 shrink-0" />
              <span className="text-xs font-bold truncate">{formatDisplayDate(date)}</span>
            </div>
          </div>

          {/* Time Slot Representing Box */}
          <div className="rounded-xl border border-stone-200 bg-white p-3 flex flex-col justify-between hover:border-orange-200 transition-colors shadow-sm">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Timing</span>
            <div className="flex items-center gap-2 mt-1.5 text-stone-850">
              <Clock className="size-4 text-orange-500 shrink-0" />
              <span className="text-xs font-bold truncate">
                {isPerSession
                  ? (venue.sessions?.[parseInt(sessionIndex)]?.name || "Session Booking")
                  : `${startTime} (${hours} hrs)`}
              </span>
            </div>
          </div>

          {/* Pricing breakdown box */}
          <div className="col-span-2 rounded-xl bg-orange-50/40 border border-orange-100 p-4">
            <div className="flex justify-between items-center text-xs font-semibold text-stone-700 mb-1.5">
              <span>{isPerSession ? "Session Rate" : "Hourly Base rate"}</span>
              <span>{formatVenuePrice(total)}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] text-stone-500 mb-1">
              <span>Service Fee (5%)</span>
              <span>{formatVenuePrice(serviceFee)}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] text-stone-500 mb-3 pb-2 border-b border-stone-200/50">
              <span>GST Tax (18%)</span>
              <span>{formatVenuePrice(gstTax)}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold text-stone-900">
              <span>Grand Total</span>
              <span className="text-orange-600 text-base">{formatVenuePrice(grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Action triggers */}
        <div className="flex gap-3 mt-4">
          <Button
            variant="outline"
            className="flex-1 rounded-xl h-11 border-stone-200 text-stone-600 hover:bg-stone-50 font-semibold"
            onClick={onClose}
          >
            Go Back
          </Button>
          <Button
            className="flex-1 rounded-xl h-11 bg-orange-500 text-white hover:bg-orange-600 font-bold transition-all shadow-md shadow-orange-500/10"
            onClick={onConfirm}
          >
            Pay & Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
