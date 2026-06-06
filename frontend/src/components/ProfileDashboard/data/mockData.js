/**
 * mockData.js
 * Temporary local data for the User Profile Dashboard.
 * ─────────────────────────────────────────────────────
 * TODO: Remove this file when API integration is complete.
 * Each export corresponds to a profileService.js function.
 */

// ─── User Profile ─────────────────────────────────────────────────────────────
export const mockUser = {
  id: "usr_bmv_001",
  name: "Junaid Ahmed",
  email: "junaid.ahmed@email.com",
  phone: "+92 300 1234567",
  address: "DHA Phase 5, Lahore, Punjab, Pakistan",
  bio: "Event enthusiast and corporate planner. I love discovering unique venues for memorable gatherings — from intimate dinners to grand weddings.",
  role: "customer",
  status: "active",       // active | inactive | suspended
  memberSince: "2023-03-15",
  avatarInitials: "JA",
};

// ─── Booking Statistics ───────────────────────────────────────────────────────
export const mockBookingStats = {
  total: 12,
  upcoming: 2,
  completed: 8,
  cancelled: 2,
};

// ─── Upcoming Bookings ────────────────────────────────────────────────────────
export const mockUpcomingBookings = [
  {
    id: "bkg_u001",
    venueName: "The Grand Marquee",
    venueLocation: "Gulberg III, Lahore",
    date: "2025-12-20",
    time: "06:00 PM",
    guests: 250,
    status: "confirmed",
    amount: 350000,
    currency: "PKR",
    bookingRef: "BMV-2025-0001",
  },
  {
    id: "bkg_u002",
    venueName: "Serena Hotel Banquet",
    venueLocation: "Constitution Ave, Islamabad",
    date: "2026-01-14",
    time: "07:30 PM",
    guests: 120,
    status: "pending",
    amount: 220000,
    currency: "PKR",
    bookingRef: "BMV-2026-0014",
  },
];

// ─── Booking History ──────────────────────────────────────────────────────────
export const mockBookingHistory = [
  {
    id: "bkg_h001",
    venueName: "Pearl Continental Banquet",
    venueLocation: "Mall Road, Lahore",
    date: "2025-11-05",
    time: "02:00 PM",
    guests: 80,
    status: "completed",
    amount: 120000,
    currency: "PKR",
    bookingRef: "BMV-2025-1105",
    rating: 5,
  },
  {
    id: "bkg_h002",
    venueName: "Monal Terrace",
    venueLocation: "Margalla Hills, Islamabad",
    date: "2025-10-15",
    time: "07:30 PM",
    guests: 40,
    status: "completed",
    amount: 85000,
    currency: "PKR",
    bookingRef: "BMV-2025-1015",
    rating: 4,
  },
  {
    id: "bkg_h003",
    venueName: "Avari Towers Ballroom",
    venueLocation: "Fatima Jinnah Rd, Karachi",
    date: "2025-09-22",
    time: "06:00 PM",
    guests: 300,
    status: "cancelled",
    amount: 480000,
    currency: "PKR",
    bookingRef: "BMV-2025-0922",
    rating: null,
  },
  {
    id: "bkg_h004",
    venueName: "Faletti's Hotel Garden",
    venueLocation: "Egerton Rd, Lahore",
    date: "2025-08-10",
    time: "05:00 PM",
    guests: 60,
    status: "completed",
    amount: 95000,
    currency: "PKR",
    bookingRef: "BMV-2025-0810",
    rating: 4,
  },
  {
    id: "bkg_h005",
    venueName: "Islamabad Club Lawn",
    venueLocation: "Ataturk Ave, Islamabad",
    date: "2025-07-04",
    time: "04:00 PM",
    guests: 150,
    status: "cancelled",
    amount: 175000,
    currency: "PKR",
    bookingRef: "BMV-2025-0704",
    rating: null,
  },
];

// ─── Favourite Venues ─────────────────────────────────────────────────────────
export const mockFavorites = [
  {
    id: "ven_001",
    name: "The Grand Marquee",
    location: "Gulberg III, Lahore",
    category: "Wedding Hall",
    capacity: 500,
    pricePerDay: 350000,
    currency: "PKR",
    rating: 4.8,
    reviewCount: 142,
    gradient: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
  },
  {
    id: "ven_002",
    name: "Monal Terrace",
    location: "Margalla Hills, Islamabad",
    category: "Outdoor Terrace",
    capacity: 80,
    pricePerDay: 85000,
    currency: "PKR",
    rating: 4.9,
    reviewCount: 98,
    gradient: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
  },
  {
    id: "ven_003",
    name: "Avari Towers Ballroom",
    location: "Fatima Jinnah Rd, Karachi",
    category: "Ballroom",
    capacity: 600,
    pricePerDay: 480000,
    currency: "PKR",
    rating: 4.7,
    reviewCount: 213,
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
  },
  {
    id: "ven_004",
    name: "Serena Hotel Banquet",
    location: "Constitution Ave, Islamabad",
    category: "Hotel Banquet",
    capacity: 300,
    pricePerDay: 220000,
    currency: "PKR",
    rating: 4.6,
    reviewCount: 87,
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  },
];

// ─── Recent Activity ──────────────────────────────────────────────────────────
export const mockRecentActivity = [
  {
    id: "act_001",
    type: "booking_confirmed",   // booking_confirmed | booking_cancelled | profile_update | booking_pending | review_posted
    title: "Booking Confirmed",
    description: "Your booking for The Grand Marquee on Dec 20, 2025 was confirmed.",
    timestamp: "2025-11-28T10:30:00Z",
    meta: { bookingRef: "BMV-2025-0001" },
  },
  {
    id: "act_002",
    type: "booking_pending",
    title: "Booking Submitted",
    description: "Your booking request for Serena Hotel Banquet on Jan 14, 2026 is under review.",
    timestamp: "2025-11-25T14:15:00Z",
    meta: { bookingRef: "BMV-2026-0014" },
  },
  {
    id: "act_003",
    type: "profile_update",
    title: "Profile Updated",
    description: "You updated your phone number and bio.",
    timestamp: "2025-11-20T09:00:00Z",
    meta: {},
  },
  {
    id: "act_004",
    type: "review_posted",
    title: "Review Posted",
    description: "You left a 5-star review for Pearl Continental Banquet.",
    timestamp: "2025-11-10T16:45:00Z",
    meta: { venueName: "Pearl Continental Banquet" },
  },
  {
    id: "act_005",
    type: "booking_cancelled",
    title: "Booking Cancelled",
    description: "Your booking for Islamabad Club Lawn on Jul 4, 2025 was cancelled.",
    timestamp: "2025-07-01T11:00:00Z",
    meta: { bookingRef: "BMV-2025-0704" },
  },
];

// ─── Account Settings ─────────────────────────────────────────────────────────
export const mockAccountSettings = {
  notifications: {
    emailBookingConfirmations: true,
    emailPromotions: false,
    smsReminders: true,
    pushNotifications: true,
  },
  privacy: {
    showProfilePublicly: true,
    allowDataSharing: false,
  },
};
