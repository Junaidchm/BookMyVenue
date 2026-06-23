"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  Save,
  CheckCircle,
  Clock,
  Sparkles,
  Edit3,
  LogOut,
  Camera,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getAllVenues, Venue } from "@/lib/venues/data";
const FEATURED_VENUES = getAllVenues();
import { VenueCard } from "./user-profile-venue-card";

// Inlined Types
export type RenterProfile = {
  name: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
};

export type RenterBooking = {
  id: string;
  venueId: string; // Map to FEATURED_VENUES dynamically
  eventDate: string;
  guests: number;
  totalPaid: number;
  status: "Confirmed" | "Pending" | "Completed";
};

// Inlined Renter Data
const MOCK_RENTER_PROFILE: RenterProfile = {
  name: "Alex Rivera",
  email: "alex.rivera@gmail.com",
  phone: "+1 (555) 321-9876",
  location: "San Francisco, CA",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
};

const MOCK_RENTER_BOOKINGS: RenterBooking[] = [
  {
    id: "b1",
    venueId: "1", // The Glass Pavilion
    eventDate: "Dec 10, 2024",
    guests: 150,
    totalPaid: 2400,
    status: "Confirmed",
  },
  {
    id: "b2",
    venueId: "4", // Garden House Retreat
    eventDate: "Jan 15, 2025",
    guests: 45,
    totalPaid: 1850,
    status: "Pending",
  },
  {
    id: "b3",
    venueId: "3", // Urban Loft Studio
    eventDate: "Aug 12, 2024",
    guests: 60,
    totalPaid: 1200,
    status: "Completed",
  },
];

const SUGGESTED_LOCATIONS = [
  "Madhya Pradesh, India",
  "Uttar Pradesh, India",
  "Maharashtra, India",
  "Kerala, India",
  "Karnataka, India",
  "Delhi, India",
  "Tamil Nadu, India",
  "Gujarat, India",
  "Rajasthan, India",
  "Punjab, India",
  "Lahore, Pakistan",
  "Karachi, Pakistan",
  "Islamabad, Pakistan",
  "San Francisco, CA",
  "New York, NY",
  "Austin, TX",
  "Napa Valley, CA",
  "Seattle, WA",
  "London, United Kingdom",
  "Kensington, London",
  "Chelsea, London",
  "Shoreditch, London",
];

export function UserProfile() {
  // Local edit states
  const [name, setName] = useState(MOCK_RENTER_PROFILE.name);
  const [email, setEmail] = useState(MOCK_RENTER_PROFILE.email);
  const [phone, setPhone] = useState(MOCK_RENTER_PROFILE.phone);
  const [location, setLocation] = useState(MOCK_RENTER_PROFILE.location);
  const [avatar, setAvatar] = useState(MOCK_RENTER_PROFILE.avatar);
  
  // Last saved states (to restore on cancel)
  const [savedName, setSavedName] = useState(MOCK_RENTER_PROFILE.name);
  const [savedEmail, setSavedEmail] = useState(MOCK_RENTER_PROFILE.email);
  const [savedPhone, setSavedPhone] = useState(MOCK_RENTER_PROFILE.phone);
  const [savedLocation, setSavedLocation] = useState(MOCK_RENTER_PROFILE.location);
  const [savedAvatar, setSavedAvatar] = useState(MOCK_RENTER_PROFILE.avatar);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Validation errors state
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
  }>({});

  // Location Autocomplete state
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [apiSuggestions, setApiSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (!location || location.trim().length < 3 || !showSuggestions) {
      setApiSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=5`
        );
        if (response.ok) {
          const data = await response.json();
          const suggestions = data.map((item: any) => item.display_name);
          setApiSuggestions(suggestions);
        } else {
          throw new Error("Nominatim API response not OK");
        }
      } catch (error) {
        console.warn("Failed to fetch from Nominatim, using local fallback:", error);
        const fallback = SUGGESTED_LOCATIONS.filter((loc) =>
          loc.toLowerCase().includes(location.toLowerCase())
        );
        setApiSuggestions(fallback);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [location, showSuggestions]);

  const suggestionsToDisplay = apiSuggestions.length > 0 
    ? apiSuggestions 
    : SUGGESTED_LOCATIONS.filter((loc) =>
        loc.toLowerCase().includes(location ? location.toLowerCase() : "")
      );

  // Fetch initial profile data on mount from database API
  useEffect(() => {
    async function fetchProfile() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/user/profile");
        if (!response.ok) {
          throw new Error("API response not OK");
        }
        const data = await response.json();
        
        // Populate profile with database data
        setName(data.name || MOCK_RENTER_PROFILE.name);
        setEmail(data.email || MOCK_RENTER_PROFILE.email);
        setPhone(data.phone || MOCK_RENTER_PROFILE.phone);
        setLocation(data.location || MOCK_RENTER_PROFILE.location);
        setAvatar(data.avatar || MOCK_RENTER_PROFILE.avatar);

        // Lock in saved states
        setSavedName(data.name || MOCK_RENTER_PROFILE.name);
        setSavedEmail(data.email || MOCK_RENTER_PROFILE.email);
        setSavedPhone(data.phone || MOCK_RENTER_PROFILE.phone);
        setSavedLocation(data.location || MOCK_RENTER_PROFILE.location);
        setSavedAvatar(data.avatar || MOCK_RENTER_PROFILE.avatar);
      } catch (err) {
        console.warn("Using offline mock data as API backend is not ready:", err);
        // Fallback already pre-initialized to MOCK_RENTER_PROFILE
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, []);

  // Map user bookings to common FEATURED_VENUES
  const userBookings = MOCK_RENTER_BOOKINGS.map((booking) => {
    const venue = FEATURED_VENUES.find((v: Venue) => v.id === booking.venueId) || FEATURED_VENUES[0];
    return { ...booking, venue };
  });

  // Alex Rivera has saved Sunset Terrace Estate (id: 2) and Urban Loft Studio (id: 3)
  const savedVenues = FEATURED_VENUES.filter((venue: Venue) => venue.id === "2" || venue.id === "3");

  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      phone?: string;
      location?: string;
    } = {};

    // 1. Name validation
    if (!name || name.trim() === "") {
      newErrors.name = "Name cannot be empty.";
    }

    // 2. Email validation
    if (!email || email.trim() === "") {
      newErrors.email = "Email cannot be empty.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Please enter a valid email address.";
      }
    }

    // 3. Phone validation (expects 10-12 digits to accommodate optional country codes)
    const cleanPhone = phone ? phone.trim() : "";
    const digitsOnly = cleanPhone.replace(/\D/g, "");
    if (!cleanPhone) {
      newErrors.phone = "Phone number cannot be empty.";
    } else if (digitsOnly.length < 10 || digitsOnly.length > 12 || /[a-zA-Z]/.test(cleanPhone)) {
      newErrors.phone = "Phone number must be a valid 10 to 12 digit mobile number.";
    }

    // 4. Location validation
    if (!location || location.trim() === "") {
      newErrors.location = "Location cannot be empty.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    const payload = {
      name,
      phone,
      location,
      avatar,
    };

    try {
      // Put updated data into backend user profile database api
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("PUT profile API request failed");
      }

      const data = await response.json();
      console.log("Successfully saved profile to database:", data);

      setSavedName(data.name || name);
      setSavedEmail(data.email || email);
      setSavedPhone(data.phone || phone);
      setSavedLocation(data.location || location);
      setSavedAvatar(data.avatar || avatar);
    } catch (err) {
      console.warn("Saving profile locally (Offline Mode) as backend API failed:", err);
      // Local fallback lock in
      setSavedName(name);
      setSavedEmail(email);
      setSavedPhone(phone);
      setSavedLocation(location);
      setSavedAvatar(avatar);
    } finally {
      setIsSaving(false);
      setIsSaved(true);
      setIsEditing(false);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const handleCancel = () => {
    // Revert inputs back to last saved values
    setName(savedName);
    setEmail(savedEmail);
    setPhone(savedPhone);
    setLocation(savedLocation);
    setAvatar(savedAvatar);
    setErrors({});
    setIsEditing(false);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Validate file size and type
    const MAX_SIZE_MB = 5;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`Avatar must be smaller than ${MAX_SIZE_MB} MB.`);
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }

    // 2. Immediately preview the selected image locally
    const localUrl = URL.createObjectURL(file);
    setAvatar(localUrl);

    // 3. Upload to API Gateway/Backend avatar endpoint
    setIsUploading(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("bmv_token") : null;
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await fetch("/api/v1/users/me/avatar", {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload avatar");
      }

      const result = await res.json();
      if (result.avatarUrl) {
        setAvatar(result.avatarUrl);
        setSavedAvatar(result.avatarUrl);
      }
    } catch (err) {
      console.error("Avatar upload error:", err);
      alert("Failed to upload avatar to server.");
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-32 text-center">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-container border-t-transparent" />
          <p className="text-body-md text-text-muted">Loading account details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-16">
      {/* Page Header */}
      <div className="mb-10 border-b border-border-subtle pb-6">
        <h1 className="font-display text-display-lg-mobile md:text-headline-md font-bold text-on-surface">
          My Account
        </h1>
        <p className="mt-2 text-body-md text-text-muted">
          Manage your personal details, track event bookings, and view your favorited spaces.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* ─── LEFT COLUMN: PERSONAL DETAILS FORM ───────────────────────────── */}
        <div className="lg:col-span-1 space-y-6">
          <form
            onSubmit={handleSave}
            className="rounded-2xl border border-border-subtle bg-white p-6 shadow-elevation-card space-y-6"
          >
            <div className="flex flex-col items-center text-center">
              <div className="group relative size-24 overflow-hidden rounded-full border border-primary-container/20 shadow-inner bg-stone-100 cursor-pointer">
                <Image
                  src={avatar}
                  alt={name}
                  fill
                  className="object-cover transition-opacity group-hover:opacity-75"
                  sizes="96px"
                />
                {/* Change photo overlay */}
                <label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
                >
                  <Camera className="size-5 text-white/90" />
                  <span className="text-[9px] font-bold uppercase mt-1 tracking-wider text-white/95">Change</span>
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  </div>
                )}
              </div>
              <h3 className="mt-3.5 font-display text-headline-sm font-semibold text-on-surface">
                {savedName}
              </h3>
            </div>

            <div className="border-t border-border-subtle/60" />

            {/* Notification Alert */}
            {isSaved && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3.5 text-label-sm font-semibold text-emerald-800 flex items-center gap-2 animate-fade-in">
                <CheckCircle className="size-4 text-emerald-600 shrink-0" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            {/* Form Inputs */}
            <div className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-label-md text-on-surface font-semibold" htmlFor="profile-name">
                  Full Name
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-text-muted/70">
                    <User className="size-4.5" />
                  </div>
                  <input
                    id="profile-name"
                    type="text"
                    required
                    disabled={!isEditing}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-border-subtle py-3 pl-10 pr-4 text-body-md bg-white focus-ring-brand disabled:bg-stone-50 disabled:text-text-muted disabled:cursor-not-allowed transition-all"
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-500 font-semibold mt-1">{errors.name}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-label-md text-on-surface font-semibold flex items-center justify-between" htmlFor="profile-email">
                  <span>Email Address</span>
                  <span className="text-[10px] text-text-muted font-normal font-sans">Non-changeable</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-text-muted/70">
                    <Mail className="size-4.5" />
                  </div>
                  <input
                    id="profile-email"
                    type="email"
                    required
                    disabled
                    value={email}
                    className="w-full rounded-xl border border-border-subtle py-3 pl-10 pr-4 text-body-md bg-stone-50 text-text-muted cursor-not-allowed transition-all opacity-85"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 font-semibold mt-1">{errors.email}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-label-md text-on-surface font-semibold" htmlFor="profile-phone">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-text-muted/70">
                    <Phone className="size-4.5" />
                  </div>
                  <input
                    id="profile-phone"
                    type="tel"
                    required
                    disabled={!isEditing}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-border-subtle py-3 pl-10 pr-4 text-body-md bg-white focus-ring-brand disabled:bg-stone-50 disabled:text-text-muted disabled:cursor-not-allowed transition-all"
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-500 font-semibold mt-1">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-label-md text-on-surface font-semibold" htmlFor="profile-location">
                  Location
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-text-muted/70">
                    <MapPin className="size-4.5" />
                  </div>
                  <input
                    id="profile-location"
                    type="text"
                    required
                    disabled={!isEditing}
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setShowSuggestions(false)}
                    className="w-full rounded-xl border border-border-subtle py-3 pl-10 pr-4 text-body-md bg-white focus-ring-brand disabled:bg-stone-50 disabled:text-text-muted disabled:cursor-not-allowed transition-all"
                  />
                  {isEditing && showSuggestions && suggestionsToDisplay.length > 0 && (
                    <ul className="absolute z-50 left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-xl border border-stone-200 bg-white shadow-lg py-1 text-sm text-stone-850">
                      {suggestionsToDisplay.map((suggestion) => (
                        <li
                          key={suggestion}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setLocation(suggestion);
                            setShowSuggestions(false);
                          }}
                          className="px-4 py-2.5 hover:bg-stone-50 cursor-pointer transition-colors"
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {errors.location && (
                  <p className="text-xs text-red-500 font-semibold mt-1">{errors.location}</p>
                )}
              </div>
            </div>

            {isEditing ? (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 rounded-full border border-border-subtle py-3 text-label-md font-bold text-on-surface hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 items-center justify-center gap-2 rounded-full bg-[#582200] py-3 text-label-md font-bold text-white hover:bg-[#3c2d26] transition-all disabled:opacity-75 shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex"
                >
                  <Save className="size-4" />
                  <span>{isSaving ? "Saving..." : "Save"}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-container py-3.5 text-label-md font-bold text-white hover:bg-[#e0620f] transition-all shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <Edit3 className="size-4" />
                  <span>Edit Profile</span>
                </button>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-border-subtle/60"></div>
                  <span className="flex-shrink mx-4 text-[10px] font-bold text-text-muted/50 uppercase tracking-wider">Account Actions</span>
                  <div className="flex-grow border-t border-border-subtle/60"></div>
                </div>

                <Link
                  href="/"
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50/50 py-3 text-label-md font-bold text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all cursor-pointer"
                >
                  <LogOut className="size-4" />
                  <span>Logout</span>
                </Link>
              </div>
            )}
          </form>
        </div>

        {/* ─── RIGHT COLUMN: BOOKINGS & FAVORITES ────────────────────────────── */}
        <div className="lg:col-span-2 space-y-10">
          
          <div className="rounded-2xl border border-border-subtle bg-white p-6 shadow-elevation-card space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-headline-sm font-bold text-on-surface">
                My Venue Bookings
              </h2>
              <span className="rounded-full bg-surface-container-low px-3 py-1 text-[11px] font-semibold text-primary-container">
                {userBookings.length} Bookings Total
              </span>
            </div>

            <div className="space-y-4">
              {userBookings.map((booking) => {
                const isConfirmed = booking.status === "Confirmed";
                const isPending = booking.status === "Pending";
                
                return (
                  <div
                    key={booking.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-xl border border-border-subtle/50 hover:border-border-subtle hover:bg-stone-50/30 transition-all gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative size-16 overflow-hidden rounded-lg border border-border-subtle/80 shrink-0">
                        <Image
                          src={booking.venue.images.main}
                          alt={booking.venue.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      
                      <div className="flex flex-col min-w-0">
                        <h4 className="text-label-md text-on-surface font-semibold truncate">
                          {booking.venue.name}
                        </h4>
                        <span className="text-label-sm text-text-muted mt-0.5">
                          {booking.venue.location}
                        </span>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[12px] text-text-muted">
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3.5" />
                            {booking.eventDate}
                          </span>
                          <span>&bull;</span>
                          <span>{booking.guests} Guests</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 border-t border-border-subtle/40 pt-3 sm:border-none sm:pt-0 shrink-0">
                      <span className="text-label-md font-bold text-primary-container">
                        ${booking.totalPaid.toLocaleString()}
                      </span>
                      
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          isConfirmed
                            ? "bg-sky-50 text-sky-700"
                            : isPending
                            ? "bg-orange-50 text-orange-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {isPending && <Clock className="size-3" />}
                        {booking.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Heart className="size-5.5 text-primary-container fill-primary-container" />
              <h2 className="font-display text-headline-sm font-bold text-on-surface">
                Saved Venues
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {savedVenues.map((venue: Venue) => (
                <VenueCard key={venue.id} venue={venue} isSaved={true} />
              ))}
            </div>

            {savedVenues.length === 0 && (
              <div className="rounded-xl border border-dashed border-border-subtle p-8 text-center">
                <Sparkles className="size-8 text-text-muted mx-auto mb-2 opacity-65" />
                <p className="text-body-md text-text-muted">
                  No saved venues yet. Explore and heart venues to see them here!
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
