export const USER_PROFILE = {
  name: "Julian",
  avatar:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBd-7MVyDDc6D3cjibJXR8un6kWWwBASIlERfsUC36i6jeJ5WE64yVhztaglN-ePgTcVv110fq51VenOqa9WKMradZ8YT9PjhKWECEPMRlX4tJwtYXhVTYJB_hdWjAjy4_jNqhEOcN5fIhV8tcW9VUkCncC0AQsmKBOU4V6fgFknc3VOFzSNaw7mFUsjCFzyITvpk9DTJbUqPpkOfmiEVp1vhQsqo6yThNQAwwUJU1E2pP7pvQL1SlhnSeYTVm_JiCp7XjFN4UhsYo",
} as const;

export const USER_NAV = [
  { href: "/user", label: "Dashboard", icon: "layout-dashboard" as const },
  {
    href: "/user/bookings",
    label: "My Bookings",
    icon: "calendar" as const,
  },
  { href: "/user/saved", label: "Saved Venues", icon: "heart" as const },
  { href: "/user/settings", label: "Settings", icon: "settings" as const },
] as const;

export const USER_NAV_BOTTOM = [
  { href: "#", label: "Help Center", icon: "help-circle" as const },
  { href: "/login", label: "Log Out", icon: "log-out" as const },
] as const;

export type BookingStatus = "CONFIRMED" | "PENDING_PAYMENT" | "CANCELLED" | "FAILED" | "COMPLETED";

export type UpcomingBooking = {
  id: string;
  reference: string;
  venue: string;
  location: string;
  dateTime: string;
  status: BookingStatus;
  image: string;
  href: string;
  guests: number;
};

export type PastBooking = {
  id: string;
  venue: string;
  dateLocation: string;
  status: BookingStatus;
  image: string;
};



export const STATUS_LABELS: Record<BookingStatus, string> = {
  CONFIRMED: "Confirmed",
  PENDING_PAYMENT: "Pending Payment",
  CANCELLED: "Cancelled",
  FAILED: "Failed",
  COMPLETED: "Completed",
};

export const DASHBOARD_STATS = {
  totalBookings: 12,
  savedVenues: 24,
  loyaltyPoints: 1450,
};

export const SAVED_VENUES = [
  {
    id: "1",
    name: "Modern Boardroom",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDJNNVMbFl4E4TrFZpMDptjKn14CiGT_XwJi8ZDITMkTrPacKM1UJ9bkeMpyjuJT8U_fpsNVLahVnpYduj5G_oZJtHOp5eRR_b9a7CxxQhAzLt5TaYxUPx81yuSY3fxytSfnzlWQjYuoK1aLQrPjZw13CgSsF7tDSZjppDKXJk2fvDBErhmd2x2Y7VaC1o29Sloq5OoMdZ8HoyICQ3aXAfC7SJhTyJP4VrLLnjwLZJoAgzDkPhKNrclvq_JiqD9icaAeAFISHdHMPY",
  },
  {
    id: "2",
    name: "The Grand Hall",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCRXToQMNF3VGPVDCK5-PtXPHCBVHBgXXE_70hDC9B1hEt13ZT9l6Ry_z9II_AD9gJ-NFzoCsnpFMNlP62TdZhEXkEAXzV1EKyKoORJPeUJH-UfhWAdAz0e78-oaVElauMwhUK8pIfmaUr_6PLpvLEXIf7WVAl5JEPxa0PPky88r_iizdG_k5jHhIJkPaR-qBxzbpbzjYza504VN8RUT9JdInKkfl_HP2Gd0oq01BvVmi5nsDYXJ5AC5r9S360Vu9FWrjrKqD_VWi0",
  },
];

export const RECENT_ACTIVITY = [
  {
    id: "1",
    type: "booking-confirmed",
    title: "Booking confirmed for The Glasshouse Loft.",
    time: "2 hours ago",
    icon: "check-circle",
  },
  {
    id: "2",
    type: "message",
    title: "New message from Host (Sunset Terrace).",
    time: "Yesterday",
    icon: "message-square",
  },
  {
    id: "3",
    type: "saved",
    title: "You saved Modern Boardroom to favorites.",
    time: "3 days ago",
    icon: "heart",
  },
];
