"use client";

import React, { useState, useEffect, useRef } from "react";
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
  ChevronLeft,
  FileText,
  Download,
  Trash2,
  Upload,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getAllVenues, Venue } from "@/lib/venues/data";
import { uploadToCloudinary } from "@/lib/venues/api";
import { VenueCard } from "./user-profile-venue-card";
import "@/components/ProfileDashboard/ProfileDashboard.css";

const FEATURED_VENUES = getAllVenues();

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
  venueId: string;
  eventDate: string;
  guests: number;
  totalPaid: number;
  status: "Confirmed" | "Pending" | "Completed" | "Cancelled";
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
    venueId: "1",
    eventDate: "Dec 10, 2024",
    guests: 150,
    totalPaid: 2400,
    status: "Confirmed",
  },
  {
    id: "b2",
    venueId: "4",
    eventDate: "Jan 15, 2025",
    guests: 45,
    totalPaid: 1850,
    status: "Pending",
  },
  {
    id: "b3",
    venueId: "3",
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

export type UserDocument = {
  id: string;
  name: string;
  type: "Invoice" | "Receipt" | "Agreement" | "Permit";
  bookingRef: string;
  venueName: string;
  date: string;
  size: string;
};

const DEFAULT_DOCUMENTS: UserDocument[] = [
  {
    id: "doc1",
    name: "Invoice_BKG-882.pdf",
    type: "Invoice",
    bookingRef: "#BKG-882",
    venueName: "The Glasshouse Estate",
    date: "Oct 12, 2024",
    size: "245 KB",
  },
  {
    id: "doc2",
    name: "Rental_Agreement_BKG-882.pdf",
    type: "Agreement",
    bookingRef: "#BKG-882",
    venueName: "The Glasshouse Estate",
    date: "Oct 10, 2024",
    size: "1.2 MB",
  },
  {
    id: "doc3",
    name: "Receipt_BKG-901.pdf",
    type: "Receipt",
    bookingRef: "#BKG-901",
    venueName: "Summit Executive Suite",
    date: "Nov 05, 2024",
    size: "180 KB",
  },
];

export function UserProfile() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docFileInputRef = useRef<HTMLInputElement>(null);

  const [bookings, setBookings] = useState<RenterBooking[]>(MOCK_RENTER_BOOKINGS);
  const [savedVenueIds, setSavedVenueIds] = useState<string[]>([]);
  const [documents, setDocuments] = useState<UserDocument[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user_documents");
      if (!stored) {
        localStorage.setItem("user_documents", JSON.stringify(DEFAULT_DOCUMENTS));
        setDocuments(DEFAULT_DOCUMENTS);
      } else {
        try {
          setDocuments(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse documents:", e);
        }
      }
    }
  }, []);

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newDoc: UserDocument = {
      id: "doc_" + Date.now(),
      name: file.name,
      type: file.name.toLowerCase().includes("agreement") ? "Agreement" :
            file.name.toLowerCase().includes("invoice") ? "Invoice" :
            file.name.toLowerCase().includes("receipt") ? "Receipt" : "Permit",
      bookingRef: "#BKG-NEW",
      venueName: "Uploaded Document",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      size: (file.size / 1024).toFixed(0) + " KB",
    };

    const updatedDocs = [newDoc, ...documents];
    setDocuments(updatedDocs);
    localStorage.setItem("user_documents", JSON.stringify(updatedDocs));
  };

  const handleDownloadDocument = (doc: UserDocument) => {
    alert(`📥 Downloading Receipt / Document: "${doc.name}"`);
  };

  const handleDeleteDocument = (id: string) => {
    const updatedDocs = documents.filter((d) => d.id !== id);
    setDocuments(updatedDocs);
    localStorage.setItem("user_documents", JSON.stringify(updatedDocs));
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("bmv_wishlist");
      if (!stored) {
        const initialWishlist = ["2", "3"];
        localStorage.setItem("bmv_wishlist", JSON.stringify(initialWishlist));
        setSavedVenueIds(initialWishlist);
      } else {
        try {
          setSavedVenueIds(JSON.parse(stored));
        } catch (e) {
          console.error("Error parsing bmv_wishlist:", e);
        }
      }
    }
  }, []);

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
          interface NominatimSearchResult {
            display_name: string;
          }
          const suggestions = data.map((item: NominatimSearchResult) => item.display_name);
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

  // Fetch initial profile data on mount
  useEffect(() => {
    async function fetchProfile() {
      // First load from localStorage if exists to keep synced
      if (typeof window !== "undefined") {
        const localData = localStorage.getItem("user_profile_data");
        if (localData) {
          try {
            const parsed = JSON.parse(localData);
            setName(parsed.name || MOCK_RENTER_PROFILE.name);
            setEmail(parsed.email || MOCK_RENTER_PROFILE.email);
            setPhone(parsed.phone || MOCK_RENTER_PROFILE.phone);
            setLocation(parsed.location || MOCK_RENTER_PROFILE.location);
            setAvatar(parsed.avatar || MOCK_RENTER_PROFILE.avatar);

            setSavedName(parsed.name || MOCK_RENTER_PROFILE.name);
            setSavedEmail(parsed.email || MOCK_RENTER_PROFILE.email);
            setSavedPhone(parsed.phone || MOCK_RENTER_PROFILE.phone);
            setSavedLocation(parsed.location || MOCK_RENTER_PROFILE.location);
            setSavedAvatar(parsed.avatar || MOCK_RENTER_PROFILE.avatar);
          } catch (e) {
            console.error("Failed to parse local profile:", e);
          }
        }
      }

      try {
        setIsLoading(true);
        const response = await fetch("/api/v1/users/me");
        if (response.ok) {
          const data = await response.json();
          
          setName(data.name || MOCK_RENTER_PROFILE.name);
          setEmail(data.email || MOCK_RENTER_PROFILE.email);
          setPhone(data.phone || MOCK_RENTER_PROFILE.phone);
          setLocation(data.location || data.address || MOCK_RENTER_PROFILE.location);
          setAvatar(data.avatar || data.avatarUrl || MOCK_RENTER_PROFILE.avatar);

          setSavedName(data.name || MOCK_RENTER_PROFILE.name);
          setSavedEmail(data.email || MOCK_RENTER_PROFILE.email);
          setSavedPhone(data.phone || MOCK_RENTER_PROFILE.phone);
          setSavedLocation(data.location || data.address || MOCK_RENTER_PROFILE.location);
          setSavedAvatar(data.avatar || data.avatarUrl || MOCK_RENTER_PROFILE.avatar);

          if (typeof window !== "undefined") {
            localStorage.setItem("user_profile_data", JSON.stringify(data));
          }
        }
      } catch (err) {
        console.warn("Using offline mock data as API backend is not ready:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, []);

  // Map user bookings to common FEATURED_VENUES
  const userBookings = bookings.map((booking) => {
    const venue = FEATURED_VENUES.find((v: Venue) => v.id === booking.venueId) || FEATURED_VENUES[0];
    return { ...booking, venue };
  });

  const savedVenues = FEATURED_VENUES.filter((venue: Venue) => savedVenueIds.includes(venue.id));

  const validateForm = () => {
    const newErrors: {
      name?: string;
      phone?: string;
      location?: string;
    } = {};

    if (!name || name.trim() === "") {
      newErrors.name = "Name cannot be empty.";
    }

    const cleanPhone = phone ? phone.trim() : "";
    const digitsOnly = cleanPhone.replace(/\D/g, "");
    if (!cleanPhone) {
      newErrors.phone = "Phone number cannot be empty.";
    } else if (digitsOnly.length < 10 || digitsOnly.length > 12 || /[a-zA-Z]/.test(cleanPhone)) {
      newErrors.phone = "Phone number must be a valid 10 to 12 digit mobile number.";
    }

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
      const response = await fetch("/api/v1/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("PATCH profile API request failed");
      }

      const data = await response.json();
      setSavedName(data.name || name);
      setSavedEmail(data.email || email);
      setSavedPhone(data.phone || phone);
      setSavedLocation(data.location || data.address || location);
      setSavedAvatar(data.avatar || data.avatarUrl || avatar);

      if (typeof window !== "undefined") {
        localStorage.setItem("user_profile_data", JSON.stringify(data));
        window.dispatchEvent(new Event("storage"));
      }
    } catch (err) {
      console.warn("Saving profile locally (Offline Mode) as backend API failed:", err);
      const offlineData = {
        name,
        email,
        phone,
        location,
        avatar,
      };
      setSavedName(name);
      setSavedEmail(email);
      setSavedPhone(phone);
      setSavedLocation(location);
      setSavedAvatar(avatar);

      if (typeof window !== "undefined") {
        localStorage.setItem("user_profile_data", JSON.stringify(offlineData));
        window.dispatchEvent(new Event("storage"));
      }
    } finally {
      setIsSaving(false);
      setIsSaved(true);
      setIsEditing(false);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setName(savedName);
    setEmail(savedEmail);
    setPhone(savedPhone);
    setLocation(savedLocation);
    setAvatar(savedAvatar);
    setErrors({});
    setIsEditing(false);
  };


  const handleAvatarClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE_MB = 5;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`Avatar must be smaller than ${MAX_SIZE_MB} MB.`);
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setAvatar(localUrl);

    setIsUploading(true);
    try {
      const secureUrl = await uploadToCloudinary(file);
      const token = typeof window !== "undefined" ? localStorage.getItem("bmv_token") : null;

      const res = await fetch("/api/v1/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ avatar: secureUrl }),
      });

      if (!res.ok) {
        throw new Error("Failed to update user profile with avatar URL");
      }

      const result = await res.json();
      const updatedAvatar = result.avatar || result.avatarUrl || secureUrl;

      setAvatar(updatedAvatar);
      setSavedAvatar(updatedAvatar);

      // Keep user_profile_data localstorage cache synced
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("user_profile_data");
        if (stored) {
          try {
            const data = JSON.parse(stored);
            data.avatar = updatedAvatar;
            data.avatarUrl = updatedAvatar;
            localStorage.setItem("user_profile_data", JSON.stringify(data));
          } catch (storageErr) {
            console.warn("Storage sync failed", storageErr);
          }
        }
      }
    } catch (err) {
      console.error("Avatar upload error:", err);
      alert("Failed to upload avatar to server.");
      setAvatar(savedAvatar);
    } finally {
      setIsUploading(false);
      URL.revokeObjectURL(localUrl);
      if (e.target) {
        e.target.value = "";
      }
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-32 text-center pd-root">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-container border-t-transparent" />
          <p className="text-body-md text-text-muted">Loading account details...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="pd-root">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        
        {/* Profile Header */}
        <div className="profile-header-card" id="section-profile">
          <div
            className="profile-header__avatar"
            style={{ cursor: isUploading ? "not-allowed" : "pointer", position: "relative" }}
            onClick={handleAvatarClick}
            role="button"
            tabIndex={0}
            aria-label="Change profile picture"
            title="Click to upload profile picture"
          >
            {isUploading ? (
              <span className="avatar-spinner" style={{ animation: "spin 1s linear infinite" }}>🔄</span>
            ) : avatar ? (
              <img
                src={avatar}
                alt={`${savedName}'s avatar`}
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
              />
            ) : (
              "?"
            )}

            {!isUploading && (
              <div
                className="avatar-overlay"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: "50%",
                  background: "rgba(0, 0, 0, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0,
                  transition: "opacity 0.2s ease",
                  color: "#fff",
                  fontSize: "1.25rem",
                }}
              >
                📷
              </div>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleAvatarChange}
            disabled={isUploading}
          />

          <div className="profile-header__info">
            <h1 className="profile-header__name">{savedName}</h1>
            <p className="profile-header__email">{savedEmail}</p>
            <div className="profile-header__meta">
              <span className="badge badge--confirmed badge--sm">Active</span>
              <span 
                className="badge badge--sm" 
                style={{ 
                  backgroundColor: "var(--clr-primary-faint)", 
                  color: "var(--clr-primary-dark)", 
                  borderColor: "var(--clr-primary-muted)" 
                }}
              >
                Customer Portal
              </span>
            </div>
          </div>
        </div>

        {/* Success message banner */}
        {isSaved && (
          <div className="badge badge--confirmed badge--md" style={{ width: "100%", justifyContent: "center", padding: "10px" }}>
            ✅ Profile updated successfully!
          </div>
        )}

        {/* Profile Information */}
        <section className="dash-card" id="section-info" style={{ overflow: "visible", position: "relative", zIndex: 10 }}>
          <div className="dash-card__header">
            <h2 className="dash-card__title">
              <span className="dash-card__title-icon" aria-hidden="true">👤</span>
              Profile Information
            </h2>
            {!isEditing ? (
              <button
                type="button"
                className="btn btn--outline btn--sm"
                onClick={handleEdit}
                aria-label="Edit profile information"
              >
                ✏️ Edit Profile
              </button>
            ) : (
              <div className="btn-row">
                <button
                  type="button"
                  className="btn btn--primary btn--sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  aria-label="Save profile changes"
                >
                  {isSaving ? "Saving…" : "💾 Save Changes"}
                </button>
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="dash-card__body">
            <div className="field-grid">
              
              {/* Full Name */}
              <div className="field-group">
                <label htmlFor="field-name" className="field-label">Full Name</label>
                {isEditing ? (
                  <input
                    id="field-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className={`field-input${errors.name ? " field-input--error" : ""}`}
                  />
                ) : (
                  <p className="field-value">{savedName}</p>
                )}
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>

              {/* Email Address */}
              <div className="field-group">
                <label htmlFor="field-email" className="field-label">
                  Email Address <span className="field-badge">Cannot be changed</span>
                </label>
                <p id="field-email" className="field-value">{savedEmail}</p>
              </div>

              {/* Phone Number */}
              <div className="field-group">
                <label htmlFor="field-phone" className="field-label">Phone Number</label>
                {isEditing ? (
                  <input
                    id="field-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone number"
                    className={`field-input${errors.phone ? " field-input--error" : ""}`}
                  />
                ) : (
                  <p className="field-value">{savedPhone}</p>
                )}
                {errors.phone && <span className="field-error">{errors.phone}</span>}
              </div>

              {/* Location */}
              <div className="field-group" style={{ position: "relative" }}>
                <label htmlFor="field-location" className="field-label">Location</label>
                {isEditing ? (
                  <>
                    <input
                      id="field-location"
                      type="text"
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => {
                        setTimeout(() => setShowSuggestions(false), 200);
                      }}
                      placeholder="Location"
                      className={`field-input${errors.location ? " field-input--error" : ""}`}
                    />
                    {showSuggestions && suggestionsToDisplay.length > 0 && (
                      <ul 
                        style={{
                          position: "absolute",
                          zIndex: 100,
                          left: 0,
                          right: 0,
                          top: "100%",
                          marginTop: "4px",
                          maxHeight: "150px",
                          overflowY: "auto",
                          borderRadius: "8px",
                          border: "1px solid var(--clr-border, #e5e7eb)",
                          backgroundColor: "#ffffff",
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                          listStyle: "none",
                          padding: "4px 0",
                          margin: 0
                        }}
                      >
                        {suggestionsToDisplay.map((suggestion) => (
                          <li
                            key={suggestion}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setLocation(suggestion);
                              setShowSuggestions(false);
                            }}
                            style={{
                              padding: "8px 16px",
                              cursor: "pointer",
                              fontSize: "0.875rem",
                              color: "#1f2937",
                              transition: "background-color 0.2s"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <p className="field-value">{savedLocation}</p>
                )}
                {errors.location && <span className="field-error">{errors.location}</span>}
              </div>

            </div>
          </div>
        </section>

        {/* Dashboard Metrics */}
        <section className="dash-card">
          <div className="dash-card__header">
            <h2 className="dash-card__title">📊 Dashboard Stats</h2>
          </div>
          <div className="dash-card__body">
            <div className="stats-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
              <div className="stat-tile stat-tile--accent">
                <span className="stat-tile__icon">🎟️</span>
                <span className="stat-tile__value">{bookings.length}</span>
                <span className="stat-tile__label">Total Bookings</span>
              </div>
              <div className="stat-tile">
                <span className="stat-tile__icon">⚡</span>
                <span className="stat-tile__value">{bookings.filter(b => b.status === "Confirmed" || b.status === "Pending").length}</span>
                <span className="stat-tile__label">Active Bookings</span>
              </div>
              <div className="stat-tile">
                <span className="stat-tile__icon">❌</span>
                <span className="stat-tile__value">{bookings.filter(b => b.status === "Cancelled").length}</span>
                <span className="stat-tile__label">Cancelled</span>
              </div>
              <div className="stat-tile">
                <span className="stat-tile__icon">❤️</span>
                <span className="stat-tile__value">{savedVenues.length}</span>
                <span className="stat-tile__label">Favorites</span>
              </div>
            </div>
          </div>
        </section>

        {/* Venue Bookings list */}
        <section className="dash-card">
          <div className="dash-card__header">
            <h2 className="dash-card__title">📅 My Venue Bookings</h2>
            <span className="dash-card__count">{userBookings.length} Bookings Total</span>
          </div>
          <div className="dash-card__body dash-card__body--flush">
            <div className="booking-list">
              {userBookings.map((booking) => {
                const isConfirmed = booking.status === "Confirmed";
                const isPending = booking.status === "Pending";
                const isCancelled = booking.status === "Cancelled";
                
                return (
                  <Link href="/user/bookings" key={booking.id} className="booking-row flex hover:bg-stone-100/10 transition-colors">
                    <div className="booking-row__icon">🏛️</div>
                    <div className="booking-row__details">
                      <h4 className="booking-row__venue">{booking.venue.name}</h4>
                      <div className="booking-row__meta">
                        <span>📍 {booking.venue.location}</span>
                        <span>📅 {booking.eventDate}</span>
                        <span>👥 {booking.guests} Guests</span>
                      </div>
                    </div>
                    <div className="booking-row__right">
                      <p className="booking-row__amount">${booking.totalPaid.toLocaleString()}</p>
                      <span
                        className={`badge badge--sm ${
                          isConfirmed
                            ? "badge--confirmed"
                            : isPending
                            ? "badge--pending"
                            : isCancelled
                            ? "badge--cancelled"
                            : "badge--completed"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </Link>
                );
              })}
              {userBookings.length === 0 && (
                <div style={{ padding: "2rem", textAlign: "center", color: "var(--clr-text-muted)" }}>
                  No bookings found.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Documents & Receipts */}
        <section className="dash-card">
          <div className="dash-card__header flex flex-row items-center justify-between" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <h2 className="dash-card__title">📄 Documents & Receipts</h2>
            <div>
              <button
                type="button"
                onClick={() => docFileInputRef.current?.click()}
                className="btn btn--primary btn--sm"
                style={{ padding: "8px 16px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "6px" }}
              >
                <Upload className="size-4" /> Upload Custom
              </button>
              <input
                type="file"
                ref={docFileInputRef}
                onChange={handleDocumentUpload}
                style={{ display: "none" }}
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              />
            </div>
          </div>
          <div className="dash-card__body">
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "600px" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--clr-border)", color: "var(--clr-text-muted)", fontSize: "0.85rem", fontWeight: "600" }}>
                    <th style={{ padding: "12px 16px" }}>Document Name</th>
                    <th style={{ padding: "12px 16px" }}>Type</th>
                    <th style={{ padding: "12px 16px" }}>Booking Ref</th>
                    <th style={{ padding: "12px 16px" }}>Date</th>
                    <th style={{ padding: "12px 16px" }}>Size</th>
                    <th style={{ padding: "12px 16px", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr
                      key={doc.id}
                      style={{ borderBottom: "1px solid var(--clr-border)" }}
                      className="hover:bg-stone-100/5 transition-colors"
                    >
                      <td style={{ padding: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <FileText className="size-5 text-orange-500" style={{ color: "var(--clr-primary)" }} />
                        <span style={{ fontWeight: "600", color: "var(--clr-text)" }}>{doc.name}</span>
                      </td>
                      <td style={{ padding: "16px" }}>
                        <span
                          style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "0.75rem",
                            fontWeight: "700",
                            textTransform: "uppercase",
                            backgroundColor:
                              doc.type === "Agreement" ? "var(--clr-surface-low)" :
                              doc.type === "Invoice" ? "var(--clr-success-bg)" :
                              doc.type === "Receipt" ? "var(--clr-primary-faint)" : "var(--clr-warning-bg)",
                            color:
                              doc.type === "Agreement" ? "var(--clr-text-muted)" :
                              doc.type === "Invoice" ? "var(--clr-success-text)" :
                              doc.type === "Receipt" ? "var(--clr-primary)" : "var(--clr-warning-text)",
                            border:
                              doc.type === "Agreement" ? "1px solid var(--clr-border)" :
                              doc.type === "Invoice" ? "1px solid var(--clr-success-border)" :
                              doc.type === "Receipt" ? "1px solid var(--clr-primary-muted)" : "1px solid var(--clr-warning-border)",
                          }}
                        >
                          {doc.type}
                        </span>
                      </td>
                      <td style={{ padding: "16px" }}>
                        <div style={{ fontWeight: "600" }}>{doc.bookingRef}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--clr-text-muted)" }}>{doc.venueName}</div>
                      </td>
                      <td style={{ padding: "16px", color: "var(--clr-text-muted)" }}>{doc.date}</td>
                      <td style={{ padding: "16px", color: "var(--clr-text-muted)" }}>{doc.size}</td>
                      <td style={{ padding: "16px", textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", alignItems: "center" }}>
                          <button
                            type="button"
                            onClick={() => handleDownloadDocument(doc)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "var(--clr-primary)",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                              fontSize: "0.85rem",
                              fontWeight: "600",
                            }}
                            className="hover:underline"
                          >
                            <Download className="size-4" /> Download
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteDocument(doc.id)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "var(--clr-error)",
                              cursor: "pointer",
                            }}
                            className="hover:scale-110 transition-transform"
                            title="Delete Document"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {documents.length === 0 && (
              <div style={{ padding: "3rem 1.5rem", textAlign: "center", color: "var(--clr-text-muted)" }}>
                <FileText className="size-8" style={{ margin: "0 auto 10px", color: "var(--clr-border-strong)" }} />
                <p style={{ fontSize: "0.95rem" }}>No documents or receipts uploaded yet.</p>
              </div>
            )}
          </div>
        </section>



      </div>
    </div>
  );
}
