"use client";

import { Star, Loader2, CalendarDays, Clock, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { useAuth } from "@/components/auth/session-provider";
import { bookingService } from "@/services/booking.service";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { Venue } from "@/lib/venues/data";
import { formatVenuePrice } from "@/lib/venues/listing";
import { BookingModal } from "@/components/venues/booking-modal";

// Helper to parse 12h time string (e.g. "08:00 AM") to 24h format (e.g. "08:00")
function parseTimeTo24h(timeStr: string): string {
  if (!timeStr) return "00:00";
  if (/^\d{2}:\d{2}$/.test(timeStr)) return timeStr;
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return timeStr;
  let hr = parseInt(match[1]);
  const min = match[2];
  const ampm = match[3].toUpperCase();
  if (ampm === "PM" && hr < 12) hr += 12;
  if (ampm === "AM" && hr === 12) hr = 0;
  return `${hr.toString().padStart(2, "0")}:${min}`;
}

type VenueBookingCardProps = {
  venue: Venue;
};

export function VenueBookingCard({ venue }: VenueBookingCardProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [date, setDate] = useState("");
  const [sessionIndex, setSessionIndex] = useState("0");
  const [hours, setHours] = useState("2");
  const [startTime, setStartTime] = useState("09:00");

  const [availability, setAvailability] = useState<"checking" | "available" | "unavailable" | "idle">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Custom Calendar States
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const [venueBookings, setVenueBookings] = useState<any[]>([]);
  const calendarRef = useRef<HTMLDivElement>(null);



  // Click outside to close calendar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mock bookings fallback in case API fails
  const getMockBookings = (venueId: string) => {
    const today = new Date();
    const formatDate = (offsetDays: number) => {
      const d = new Date(today);
      d.setDate(today.getDate() + offsetDays);
      return d.toISOString().split("T")[0];
    };

    if (venueId === "glass-pavilion") {
      return [
        {
          id: "mock-b-1",
          bookingDate: formatDate(1),
          startTime: `${formatDate(1)}T10:00:00.000Z`,
          endTime: `${formatDate(1)}T14:00:00.000Z`,
          type: "HOURLY"
        },
        {
          id: "mock-b-2",
          bookingDate: formatDate(3),
          startTime: `${formatDate(3)}T14:00:00.000Z`,
          endTime: `${formatDate(3)}T18:00:00.000Z`,
          type: "HOURLY"
        }
      ];
    } else if (venueId === "royal-botanic-hall") {
      return [
        {
          id: "mock-b-3",
          bookingDate: formatDate(1),
          startTime: `${formatDate(1)}T08:00:00.000Z`,
          endTime: `${formatDate(1)}T13:00:00.000Z`,
          type: "SESSION",
          venueSessionId: 1,
          sessionName: "Morning Session"
        },
        {
          id: "mock-b-4",
          bookingDate: formatDate(2),
          startTime: `${formatDate(2)}T14:00:00.000Z`,
          endTime: `${formatDate(2)}T20:00:00.000Z`,
          type: "SESSION",
          venueSessionId: 2,
          sessionName: "Evening Session"
        }
      ];
    }
    return [];
  };

  // Fetch venue bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await bookingService.getVenueBookings(venue.id);
        if (res.success && res.data && res.data.length > 0) {
          setVenueBookings(res.data);
        } else {
          setVenueBookings(getMockBookings(venue.id));
        }
      } catch (err) {
        console.warn("Failed to fetch venue bookings. Using mock bookings.");
        setVenueBookings(getMockBookings(venue.id));
      }
    };
    fetchBookings();
  }, [venue.id]);

  // Calendar helpers
  const currentYear = currentCalendarDate.getFullYear();
  const currentMonth = currentCalendarDate.getMonth();

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const daysGrid: (Date | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    daysGrid.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    daysGrid.push(new Date(currentYear, currentMonth, i));
  }

  const prevMonth = () => {
    setCurrentCalendarDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentCalendarDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const formatDateString = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const isDateInPast = (d: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d < today;
  };

  const getStartAndEndDatesForDay = (dayStr: string): { start: Date; end: Date; isValid: boolean } => {
    try {
      if (!startTime || !hours) return { start: new Date(), end: new Date(), isValid: false };
      const start = new Date(`${dayStr}T${parseTimeTo24h(startTime)}:00`);
      const duration = parseInt(hours) || 2;
      const end = new Date(start.getTime() + duration * 60 * 60 * 1000);
      return { start, end, isValid: !isNaN(start.getTime()) && !isNaN(end.getTime()) };
    } catch {
      return { start: new Date(), end: new Date(), isValid: false };
    }
  };

  const isDateBooked = (d: Date) => {
    const dateStr = formatDateString(d);
    
    return venueBookings.some((b: any) => {
      const bDate = new Date(b.bookingDate).toISOString().split("T")[0];
      if (bDate !== dateStr) return false;
      
      if (isPerSession && hasSessions) {
        const session = venue.sessions![parseInt(sessionIndex)] || venue.sessions![0];
        return b.sessionName === session.name || b.venueSessionId === session.id;
      } else {
        const { start: reqStart, end: reqEnd, isValid } = getStartAndEndDatesForDay(dateStr);
        if (!isValid) return false;
        
        const bStart = new Date(b.startTime);
        const bEnd = new Date(b.endTime);
        
        return reqStart < bEnd && reqEnd > bStart;
      }
    });
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "Select a date";
    try {
      const option: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateStr).toLocaleDateString('en-IN', option);
    } catch {
      return dateStr;
    }
  };

  const basePrice = venue.basePrice ?? venue.pricePerDay;
  const isPerSession = venue.pricingType === "PER_SESSION";
  const hasSessions = venue.sessions && venue.sessions.length > 0;

  // 1. Dynamic Cost Calculation
  let total = basePrice;
  if (isPerSession && hasSessions) {
    const session = venue.sessions![parseInt(sessionIndex)] || venue.sessions![0];
    total = session.sessionPrice;
  } else if (venue.pricingType === "PER_HOUR") {
    total = basePrice * Math.max(2, parseInt(hours) || 2);
  }


  // Helper to parse start/end dates
  const getStartAndEndDates = (): { start: Date; end: Date; isValid: boolean } => {
    if (!date) return { start: new Date(), end: new Date(), isValid: false };

    try {
      if (isPerSession && hasSessions) {
        const session = venue.sessions![parseInt(sessionIndex)] || venue.sessions![0];
        const start = new Date(`${date}T${parseTimeTo24h(session.startTime)}:00`);
        const end = new Date(`${date}T${parseTimeTo24h(session.endTime)}:00`);
        return { start, end, isValid: !isNaN(start.getTime()) && !isNaN(end.getTime()) };
      } else {
        if (!startTime || !hours) return { start: new Date(), end: new Date(), isValid: false };
        const start = new Date(`${date}T${parseTimeTo24h(startTime)}:00`);
        const duration = parseInt(hours) || 2;
        const end = new Date(start.getTime() + duration * 60 * 60 * 1000);
        return { start, end, isValid: !isNaN(start.getTime()) && !isNaN(end.getTime()) };
      }
    } catch {
      return { start: new Date(), end: new Date(), isValid: false };
    }
  };

  // 2. Real-time End Time Calculation helper
  const getEndTimeStr = () => {
    if (!startTime || !hours) return "";
    const [h, m] = startTime.split(":").map(Number);
    const totalHours = h + (parseInt(hours) || 0);
    const endH = totalHours % 24;
    const ampm = endH >= 12 ? "PM" : "AM";
    const displayH = endH % 12 || 12;
    const displayM = m.toString().padStart(2, "0");
    const nextDayStr = totalHours >= 24 ? " (Next Day)" : "";
    return `${displayH}:${displayM} ${ampm}${nextDayStr}`;
  };

  // 3. Real-time Availability Check
  useEffect(() => {
    const { start, end, isValid } = getStartAndEndDates();
    if (!isValid || !date) {
      setAvailability("idle");
      return;
    }

    setAvailability("checking");
    const checkSlot = async () => {
      try {
        const res = await bookingService.checkAvailability(
          venue.id,
          start.toISOString(),
          end.toISOString()
        );
        if (res.success) {
          setAvailability(res.available ? "available" : "unavailable");
        } else {
          setAvailability("idle");
        }
      } catch (err) {
        console.warn("Availability check failed. Defaulting to available for offline testing.", err);
        setAvailability("available");
      }
    };

    const timer = setTimeout(checkSlot, 500);
    return () => clearTimeout(timer);
  }, [date, startTime, hours, sessionIndex, venue.id, isPerSession, hasSessions]);

  // 4. Reserve Action
  const handleReserve = () => {
    if (!date) {
      toast.error("Please select a date", {
        description: "A booking date is required to proceed with your reservation.",
      });
      return;
    }
    setIsModalOpen(true);
  };

  const confirmReservation = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/venues/${venue.id}`);
      return;
    }

    const { start, end, isValid } = getStartAndEndDates();
    if (!isValid) {
      toast.error("Invalid dates selected", {
        description: "Please check your start time and duration.",
      });
      return;
    }

    if (availability === "unavailable") {
      toast.error("Slot unavailable", {
        description: "This time slot is already booked.",
      });
      return;
    }

    setLoading(true);
    setErrorMessage("");

    const selectedSession = isPerSession && hasSessions 
      ? venue.sessions![parseInt(sessionIndex)] 
      : null;

    try {
      const response = await bookingService.createBooking({
        venueId: parseInt(venue.id) || Number(venue.id),
        bookingDate: date,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        totalPrice: total,
        type: isPerSession ? "SESSION" : "HOURLY",
        venueSessionId: isPerSession && selectedSession ? selectedSession.id : undefined,
        sessionName: isPerSession && selectedSession ? selectedSession.name : undefined,
      });

      if (response.success && response.data?.id) {
        router.push(`/checkout?bookingId=${response.data.id}`);
      } else {
        setErrorMessage(response.message || "Failed to create booking request.");
      }
    } catch (err: any) {
      console.error("Booking error:", err);
      if (err.response?.status === 403) {
        setErrorMessage(err.response?.data?.message || "Booking declined: Forbidden access.");
      } else if (err.response?.status === 409) {
        setErrorMessage("Slot occupied: This slot has just been reserved by another user.");
      } else {
        setErrorMessage(err.response?.data?.message || "Failed to make reservation. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="sticky top-32 gap-0 rounded-2xl border border-border-subtle bg-surface py-0 shadow-elevation-floating overflow-visible">
      <CardContent className="flex flex-col gap-6 p-6 overflow-visible">
        {/* Price & rating header */}
        <div className="flex items-end justify-between">
          <div className="font-display text-headline-md text-on-surface">
            {formatVenuePrice(basePrice)}{" "}
            <span className="font-sans text-body-md font-normal text-text-muted">
              {isPerSession ? "/ session" : "/ hour"}
            </span>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-surface-container-low px-3 py-1.5 text-label-sm font-semibold text-on-surface">
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            {venue.rating} ({venue.reviewCount})
          </div>
        </div>

        {/* Booking Inputs */}
        <div className="rounded-xl border border-border-subtle">
          <div 
            ref={calendarRef}
            className="relative border-b border-border-subtle p-3.5 transition-colors focus-within:bg-surface-container-low"
          >
            <Label className="mb-1 block text-label-sm tracking-wider text-text-muted uppercase">
              Date
            </Label>
            <div 
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className="cursor-pointer h-8 flex items-center justify-between text-sm font-medium text-on-surface select-none"
            >
              <span className={date ? "text-on-surface" : "text-text-muted"}>
                {date ? formatDisplayDate(date) : "Select a date"}
              </span>
              <CalendarDays className="size-4 text-text-muted" />
            </div>

            {/* Custom Calendar Popover */}
            {isCalendarOpen && (
              <div className="absolute left-0 right-0 z-50 mt-2.5 rounded-2xl border border-border-subtle bg-white p-4 shadow-xl animate-in fade-in duration-200">
                <div className="flex items-center justify-between mb-4">
                  <button 
                    type="button" 
                    onClick={prevMonth}
                    className="rounded-full p-1.5 hover:bg-stone-100 transition-colors"
                  >
                    <ChevronLeft className="size-4 text-stone-600" />
                  </button>
                  <span className="font-display font-bold text-sm text-stone-900">
                    {new Date(currentYear, currentMonth).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                  </span>
                  <button 
                    type="button" 
                    onClick={nextMonth}
                    className="rounded-full p-1.5 hover:bg-stone-150 transition-colors"
                  >
                    <ChevronRight className="size-4 text-stone-600" />
                  </button>
                </div>
                
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-text-muted mb-2">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                    <span key={d}>{d}</span>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {daysGrid.map((day, idx) => {
                    if (!day) return <span key={idx} />;
                    const dateStr = formatDateString(day);
                    const isPast = isDateInPast(day);
                    const isBooked = isDateBooked(day);
                    const isSel = date === dateStr;
                    
                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={isPast || isBooked}
                        onClick={() => {
                          setDate(dateStr);
                          setIsCalendarOpen(false);
                        }}
                        className={cn(
                          "flex aspect-square items-center justify-center rounded-full text-xs font-medium transition-all",
                          isPast && "opacity-35 line-through cursor-not-allowed text-stone-400",
                          !isPast && isBooked && "bg-red-50 text-red-600 border border-red-200 font-semibold cursor-not-allowed",
                          !isPast && !isBooked && "text-emerald-700 bg-emerald-50/50 hover:bg-[#fcf2ed] hover:text-primary-container",
                          isSel && "bg-orange-500 text-white font-bold hover:bg-orange-600 hover:text-white"
                        )}
                        title={isBooked ? "Already booked" : isPast ? "Date passed" : "Available"}
                      >
                        {day.getDate()}
                      </button>
                    );
                  })}
                </div>

                {/* Calendar Color Key Legend */}
                <div className="mt-4 flex items-center justify-center gap-4 border-t border-stone-100 pt-3 text-[10px] text-stone-500 font-semibold select-none">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-red-500" />
                    <span>Booked</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-orange-500" />
                    <span>Selected</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {isPerSession && hasSessions ? (
            <div className="border-b border-border-subtle p-3.5 transition-colors focus-within:bg-surface-container-low">
              <Label className="mb-1 block text-label-sm tracking-wider text-text-muted uppercase">
                Session
              </Label>
              <Select value={sessionIndex} onValueChange={setSessionIndex}>
                <SelectTrigger className="h-auto w-full border-0 bg-transparent p-0 text-sm font-medium text-on-surface shadow-none focus-visible:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {venue.sessions!.map((s, idx) => (
                    <SelectItem key={idx} value={idx.toString()}>
                      {s.name} ({s.startTime} - {s.endTime})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="flex flex-col border-b border-border-subtle transition-colors focus-within:bg-surface-container-low">
              <div className="flex border-b border-border-subtle">
                <div className="flex-1 p-3.5 border-r border-border-subtle">
                  <Label className="mb-1 block text-label-sm tracking-wider text-text-muted uppercase">
                    Start Time
                  </Label>
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="h-auto border-0 bg-transparent p-0 text-sm font-medium text-on-surface shadow-none focus-visible:ring-0"
                  />
                </div>
                <div className="flex-1 p-3.5">
                  <Label className="mb-1 block text-label-sm tracking-wider text-text-muted uppercase">
                    Duration (Hrs)
                  </Label>
                  <Input
                    type="number"
                    min={2}
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="h-auto border-0 bg-transparent p-0 text-sm font-medium text-on-surface shadow-none focus-visible:ring-0"
                  />
                </div>
              </div>

              {/* End Time Display */}
              <div className="mt-0.5 text-xs font-semibold text-stone-500 flex items-center gap-1.5 bg-stone-50 px-3.5 py-2.5">
                <Clock className="size-3.5 text-primary" />
                <span>Calculated End Time: <strong className="text-stone-800">{getEndTimeStr()}</strong></span>
              </div>
            </div>
          )}
        </div>

        {/* Real-time availability indicator */}
        {date && (
          <div className="flex items-center gap-2 px-1">
            {availability === "checking" && (
              <>
                <Loader2 className="size-4 animate-spin text-primary" />
                <span className="text-xs text-text-muted">Checking availability...</span>
              </>
            )}
            {availability === "available" && (
              <>
                <CheckCircle2 className="size-4 text-emerald-500" />
                <span className="text-xs font-semibold text-emerald-600">Available to Reserve</span>
              </>
            )}
            {availability === "unavailable" && (
              <>
                <AlertCircle className="size-4 text-red-500" />
                <span className="text-xs font-semibold text-red-600">Unavailable / Already Reserved</span>
              </>
            )}
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-700 flex items-start gap-2">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* CTA */}
        <Button
          size="lg"
          onClick={handleReserve}
          disabled={loading || (!!date && availability !== "available")}
          className="w-full rounded-full bg-primary py-6 text-label-md font-bold text-white shadow-lg shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-650 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              Securing Slot...
            </span>
          ) : (
            "Reserve Now"
          )}
        </Button>

        <p className="text-center text-label-sm text-text-muted">
          You won&apos;t be charged yet
        </p>

        <Separator className="bg-border-subtle" />

        {/* Total */}
        <div className="flex justify-between text-body-md text-on-surface-variant">
          <span className="underline decoration-dotted underline-offset-4">
            Total before taxes
          </span>
          <span className="font-display font-bold text-on-surface text-lg">
            {formatVenuePrice(total)}
          </span>
        </div>
      </CardContent>
    </Card>

    <BookingModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      venue={venue}
      date={date}
      startTime={startTime}
      hours={hours}
      sessionIndex={sessionIndex}
      isPerSession={isPerSession}
      total={total}
      onConfirm={() => {
        setIsModalOpen(false);
        confirmReservation();
      }}
    />
    </>
  );
}
