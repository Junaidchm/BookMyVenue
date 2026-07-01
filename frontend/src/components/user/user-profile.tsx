"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/auth/session-provider";
import { uploadToCloudinary } from "@/lib/venues/api";
import "./user-profile.css";

// Inlined Types
export type UserProfileData = {
  name: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  memberSince?: string;
};

const DEFAULT_USER_PROFILE: UserProfileData = {
  name: "Alex Rivera",
  email: "alex.rivera@gmail.com",
  phone: "+1 (555) 321-9876",
  location: "San Francisco, CA",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
  memberSince: "2024-02-10T08:00:00.000Z",
};

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

// ─── Field View Component ──────────────────────────────────────────────────────
function FieldView({ label, value, badge }: { label: string; value: string; badge?: string }) {
  return (
    <div className="field-group">
      <label className="field-label">
        {label}
        {badge && <span className="field-badge">{badge}</span>}
      </label>
      <p className={`field-value${!value ? " field-value--empty" : ""}`}>
        {value || "Not provided"}
      </p>
    </div>
  );
}

// ─── Field Edit Component ──────────────────────────────────────────────────────
type FieldEditProps = {
  id: string;
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  badge?: string;
  disabled?: boolean;
};

function FieldEdit({ id, label, type = "text", name, value, onChange, error, placeholder, badge, disabled }: FieldEditProps) {
  return (
    <div className="field-group">
      <label htmlFor={id} className="field-label">
        {label}
        {badge && <span className="field-badge">{badge}</span>}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`field-input${error ? " field-input--error" : ""}`}
      />
      {error && (
        <span id={`${id}-err`} className="field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function UserProfile() {
  const { signOut } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [profile, setProfile] = useState<UserProfileData>(DEFAULT_USER_PROFILE);
  const [draft, setDraft] = useState<Partial<UserProfileData>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Metrics mock stats (based on loaded profile or dashboard stats)
  const [metrics, setMetrics] = useState({
    totalBookings: 3,
    upcomingEvents: 2,
    completedEvents: 1,
    wishlistCount: 2,
  });

  // Load live activity overview stats
  useEffect(() => {
    async function loadActivityStats() {
      // 1. Load Bookings Stats
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("bmv_token") : null;
        const res = await fetch("/api/v1/users/me/bookings", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        
        if (res.ok) {
          const bookings = await res.json();
          const list = Array.isArray(bookings) ? bookings : (bookings.bookings || []);
          const total = list.length;
          const upcoming = list.filter((b: any) => b.status === "Confirmed" || b.status === "Pending").length;
          const completed = list.filter((b: any) => b.status === "Completed").length;
          
          setMetrics(prev => ({
            ...prev,
            totalBookings: total,
            upcomingEvents: upcoming,
            completedEvents: completed
          }));
        } else {
          throw new Error("Bookings API response not OK");
        }
      } catch (err) {
        console.warn("Failed to fetch live booking stats, using mock fallback:", err);
        setMetrics(prev => ({
          ...prev,
          totalBookings: 3,
          upcomingEvents: 2,
          completedEvents: 1,
        }));
      }

      // 2. Load Wishlist Stats
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("bmv_token") : null;
        const res = await fetch("/api/v1/users/me/favourites", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : (data.favourites || []);
          setMetrics(prev => ({
            ...prev,
            wishlistCount: list.length
          }));
        } else {
          throw new Error("Wishlist API response not OK");
        }
      } catch (err) {
        console.warn("Failed to fetch live wishlist stats, using localStorage fallback:", err);
        // localStorage fallback
        let wishlistCount = 2; // Default mock fallback
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem("bmv_wishlist");
          if (stored) {
            try {
              const list = JSON.parse(stored);
              wishlistCount = list.length;
            } catch {}
          }
        }
        setMetrics(prev => ({
          ...prev,
          wishlistCount
        }));
      }
    }

    loadActivityStats();
  }, []);

  // Autocomplete suggestions states
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [apiAddressSuggestions, setApiAddressSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (!draft.location || draft.location.trim().length < 3 || !showAddressSuggestions) {
      setApiAddressSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(draft.location || "")}&format=json&limit=5`
        );
        if (response.ok) {
          const data = await response.json();
          const suggestions = data.map((item: any) => item.display_name);
          setApiAddressSuggestions(suggestions);
        } else {
          throw new Error("Nominatim API response not OK");
        }
      } catch (error) {
        console.warn("Failed to fetch from Nominatim, using local fallback:", error);
        const fallback = SUGGESTED_LOCATIONS.filter((loc) =>
          loc.toLowerCase().includes((draft.location || "").toLowerCase())
        );
        setApiAddressSuggestions(fallback);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [draft.location, showAddressSuggestions]);

  const addressSuggestionsToDisplay = apiAddressSuggestions.length > 0 
    ? apiAddressSuggestions 
    : SUGGESTED_LOCATIONS.filter((loc) =>
        loc.toLowerCase().includes(draft.location ? draft.location.toLowerCase() : "")
      );

  // Load initial profile data
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          localStorage.setItem("user_profile_data", JSON.stringify(data));
          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("user-profile-updated"));
          }
        } else {
          throw new Error("API offline");
        }
      } catch (err) {
        console.warn("API offline, utilizing mock/localStorage fallback:", err);
        const localData = localStorage.getItem("user_profile_data");
        if (localData) {
          try {
            setProfile(JSON.parse(localData));
          } catch {
            setProfile(DEFAULT_USER_PROFILE);
          }
        } else {
          localStorage.setItem("user_profile_data", JSON.stringify(DEFAULT_USER_PROFILE));
          setProfile(DEFAULT_USER_PROFILE);
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const validateForm = () => {
    const errs: Record<string, string> = {};

    if (!draft.name || draft.name.trim() === "") {
      errs.name = "Name cannot be empty.";
    }

    if (!draft.email || draft.email.trim() === "") {
      errs.email = "Email cannot be empty.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(draft.email)) {
        errs.email = "Please enter a valid email address.";
      }
    }

    // Phone validation
    const cleanPhone = draft.phone ? draft.phone.trim() : "";
    const digitsOnly = cleanPhone.replace(/\D/g, "");
    if (!cleanPhone) {
      errs.phone = "Phone number cannot be empty.";
    } else if (digitsOnly.length < 10 || digitsOnly.length > 12 || /[a-zA-Z]/.test(cleanPhone)) {
      errs.phone = "Phone number must be a valid 10 to 12 digit mobile number.";
    }

    if (!draft.location || draft.location.trim() === "") {
      errs.location = "Location cannot be empty.";
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleEdit = () => {
    setDraft({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
    });
    setFieldErrors({});
    setSaveSuccess(false);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFieldErrors({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    const updated = {
      ...profile,
      name: draft.name!,
      email: draft.email!,
      phone: draft.phone!,
      location: draft.location!,
    };

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updated),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        localStorage.setItem("user_profile_data", JSON.stringify(data));
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("user-profile-updated"));
        }
      } else {
        throw new Error("PUT failed");
      }
    } catch {
      console.warn("Offline Save Fallback:");
      setProfile(updated);
      localStorage.setItem("user_profile_data", JSON.stringify(updated));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("user-profile-updated"));
      }
    } finally {
      setIsSaving(false);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleAvatarClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setProfile((prev) => ({ ...prev, avatar: localUrl }));

    setIsUploading(true);
    try {
      // Upload directly to Cloudinary
      const avatarUrl = await uploadToCloudinary(file);
      
      setProfile((prev) => {
        const finalProfile = { ...prev, avatar: avatarUrl };
        localStorage.setItem("user_profile_data", JSON.stringify(finalProfile));
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("user-profile-updated"));
        }
        
        // Persist immediately to the backend profile database
        fetch("/api/user/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalProfile),
        }).catch((err) => console.warn("Offline fallback: failed to sync avatar with DB:", err));

        return finalProfile;
      });
    } catch (err: any) {
      console.warn("Cloudinary upload failed, reverting avatar to last saved:", err);
      setProfile((prev) => {
        const stored = localStorage.getItem("user_profile_data");
        let fallbackAvatar = "";
        if (stored) {
          try {
            fallbackAvatar = JSON.parse(stored).avatar;
          } catch {}
        }
        const finalProfile = { ...prev, avatar: fallbackAvatar || DEFAULT_USER_PROFILE.avatar };
        localStorage.setItem("user_profile_data", JSON.stringify(finalProfile));
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("user-profile-updated"));
        }
        return finalProfile;
      });
      alert(err.message || "Failed to upload avatar to Cloudinary.");
    } finally {
      setIsUploading(false);
      URL.revokeObjectURL(localUrl);
      if (e.target) {
        e.target.value = "";
      }
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      signOut();
    }
  };

  const memberYear = profile.memberSince
    ? new Date(profile.memberSince).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "—";

  const display = isEditing ? draft : profile;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-32 text-center pd-root">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#f97316] border-t-transparent" />
          <p className="text-body-md text-text-muted">Loading profile details...</p>
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
            onKeyDown={(e) => {
              if (!isUploading && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                handleAvatarClick();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Change profile picture"
            title="Click to upload profile picture"
          >
            {isUploading ? (
              <span className="avatar-spinner" style={{ animation: "spin 1s linear infinite" }}>🔄</span>
            ) : profile.avatar ? (
              <img
                src={profile.avatar}
                alt={`${profile.name}'s avatar`}
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
            onChange={handleAvatarUpload}
            disabled={isUploading}
          />

          <div className="profile-header__info">
            <h1 className="profile-header__name">{profile.name}</h1>
            <p className="profile-header__email">{profile.email}</p>
            <div className="profile-header__meta">
              <span className="badge badge--confirmed badge--sm">Active</span>
              <span className="profile-header__since">
                Member since {memberYear}
              </span>
            </div>
          </div>
        </div>

        {/* Success message banner */}
        {saveSuccess && (
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
              {isEditing ? (
                <FieldEdit
                  id="field-name"
                  label="Full Name"
                  name="name"
                  value={display.name!}
                  onChange={handleChange}
                  error={fieldErrors.name}
                  placeholder="Your full name"
                />
              ) : (
                <FieldView label="Full Name" value={display.name!} />
              )}

              {/* Email Address */}
              {isEditing ? (
                <FieldEdit
                  id="field-email"
                  label="Email Address"
                  type="email"
                  name="email"
                  value={display.email!}
                  onChange={handleChange}
                  error={fieldErrors.email}
                  badge="Cannot be changed"
                  disabled
                />
              ) : (
                <FieldView label="Email Address" value={display.email!} badge="Verified" />
              )}

              {/* Phone Number */}
              {isEditing ? (
                <FieldEdit
                  id="field-phone"
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  value={display.phone!}
                  onChange={handleChange}
                  error={fieldErrors.phone}
                  placeholder="+1 (555) 321-9876"
                />
              ) : (
                <FieldView label="Phone Number" value={display.phone!} />
              )}

              {/* Location */}
              {isEditing ? (
                <div className="field-group" style={{ position: "relative" }}>
                  <label htmlFor="field-location" className="field-label">
                    Location
                  </label>
                  <input
                    id="field-location"
                    type="text"
                    name="location"
                    value={display.location || ""}
                    onChange={(e) => {
                      handleChange(e);
                      setShowAddressSuggestions(true);
                    }}
                    onFocus={() => setShowAddressSuggestions(true)}
                    onBlur={() => {
                      setTimeout(() => setShowAddressSuggestions(false), 200);
                    }}
                    placeholder="City, Country"
                    className={`field-input${fieldErrors.location ? " field-input--error" : ""}`}
                  />
                  {showAddressSuggestions && addressSuggestionsToDisplay.length > 0 && (
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
                      {addressSuggestionsToDisplay.map((suggestion) => (
                        <li
                          key={suggestion}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setDraft((prev) => ({ ...prev, location: suggestion }));
                            if (fieldErrors.location) {
                              setFieldErrors((prev) => {
                                const next = { ...prev };
                                delete next.location;
                                return next;
                              });
                            }
                            setShowAddressSuggestions(false);
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
                  {fieldErrors.location && (
                    <span id="field-location-err" className="field-error" role="alert">
                      {fieldErrors.location}
                    </span>
                  )}
                </div>
              ) : (
                <FieldView label="Location" value={display.location!} />
              )}

            </div>
          </div>
        </section>

        {/* Dashboard Metrics / Activity */}
        <section className="dash-card" id="section-metrics">
          <div className="dash-card__header">
            <h2 className="dash-card__title">
              <span className="dash-card__title-icon" aria-hidden="true">📊</span>
              Account Activity Overview
            </h2>
          </div>
          <div className="dash-card__body">
            <div className="stats-grid">
              <div className="stat-tile stat-tile--accent">
                <span className="stat-tile__icon" aria-hidden="true">📅</span>
                <span className="stat-tile__value">{metrics.totalBookings}</span>
                <span className="stat-tile__label">Total Bookings</span>
              </div>
              <div className="stat-tile">
                <span className="stat-tile__icon" aria-hidden="true">⏳</span>
                <span className="stat-tile__value">{metrics.upcomingEvents}</span>
                <span className="stat-tile__label">Upcoming Events</span>
              </div>
              <div className="stat-tile">
                <span className="stat-tile__icon" aria-hidden="true">✅</span>
                <span className="stat-tile__value">{metrics.completedEvents}</span>
                <span className="stat-tile__label">Completed Events</span>
              </div>
              <div className="stat-tile">
                <span className="stat-tile__icon" aria-hidden="true">❤️</span>
                <span className="stat-tile__value">{metrics.wishlistCount}</span>
                <span className="stat-tile__label">Wishlist Venues</span>
              </div>
            </div>
          </div>
        </section>

        {/* Logout Button */}
        <div style={{ marginTop: "2rem" }}>
          <button
            type="button"
            className="btn btn--danger"
            style={{ width: "100%", padding: "14px", fontSize: "0.95rem" }}
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </div>

      </div>
    </div>
  );
}
