"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth/session-provider";
import "@/components/ProfileDashboard/ProfileDashboard.css";

// Import modular sub-components
import { OwnerProfileHeader } from "./owner-profile-header";
import { OwnerProfileInfo } from "./owner-profile-info";
import { OwnerProfileMetrics } from "./owner-profile-metrics";

const DEFAULT_OWNER_PROFILE = {
  name: "Sarah Jenkins",
  email: "sarah.j@example.com",
  phone: "+92 300 1234567",
  address: "Lahore, Pakistan",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  venuesCount: 3,
  bookingsReceived: 42,
  completedEvents: 18,
  averageRating: 4.9,
  memberSince: "2024-01-15T08:00:00.000Z",
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

export function OwnerProfile() {
  const { signOut } = useAuth();
  const fileInputRef = useRef(null);

  // States
  const [profile, setProfile] = useState(DEFAULT_OWNER_PROFILE);
  const [draft, setDraft] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Autocomplete suggestions states
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [apiAddressSuggestions, setApiAddressSuggestions] = useState([]);

  useEffect(() => {
    if (!draft.address || draft.address.trim().length < 3 || !showAddressSuggestions) {
      const t = setTimeout(() => {
        setApiAddressSuggestions([]);
      }, 0);
      return () => clearTimeout(t);
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(draft.address || "")}&format=json&limit=5`
        );
        if (response.ok) {
          const data = await response.json();
          const suggestions = data.map((item) => item.display_name);
          setApiAddressSuggestions(suggestions);
        } else {
          throw new Error("Nominatim API response not OK");
        }
      } catch (error) {
        console.warn("Failed to fetch from Nominatim, using local fallback:", error);
        const fallback = SUGGESTED_LOCATIONS.filter((loc) =>
          loc.toLowerCase().includes((draft.address || "").toLowerCase())
        );
        setApiAddressSuggestions(fallback);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [draft.address, showAddressSuggestions]);

  const addressSuggestionsToDisplay = apiAddressSuggestions.length > 0 
    ? apiAddressSuggestions 
    : SUGGESTED_LOCATIONS.filter((loc) =>
        loc.toLowerCase().includes(draft.address ? draft.address.toLowerCase() : "")
      );

  // Load initial profile data
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/owner/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        } else {
          throw new Error("API offline");
        }
      } catch (err) {
        console.warn("API offline, utilizing localStorage fallback:", err);
        const localData = localStorage.getItem("owner_profile_data");
        if (localData) {
          try {
            setProfile(JSON.parse(localData));
          } catch {
            setProfile(DEFAULT_OWNER_PROFILE);
          }
        } else {
          localStorage.setItem("owner_profile_data", JSON.stringify(DEFAULT_OWNER_PROFILE));
          setProfile(DEFAULT_OWNER_PROFILE);
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const validateForm = () => {
    const errs = {};

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

    // Phone validation (expects max 10 numbers other than country code, minimum 9 numbers)
    const cleanPhone = draft.phone ? draft.phone.trim() : "";
    let nationalNumber = cleanPhone;
    if (cleanPhone.startsWith("+")) {
      const countryCodeRegex = /^\+(\d{1,3})\s*/;
      const match = cleanPhone.match(countryCodeRegex);
      if (match) {
        nationalNumber = cleanPhone.slice(match[0].length);
      }
    } else if (cleanPhone.startsWith("0")) {
      nationalNumber = cleanPhone.slice(1);
    }
    const nationalDigits = nationalNumber.replace(/\D/g, "");

    if (!cleanPhone) {
      errs.phone = "Phone number cannot be empty.";
    } else if (/[a-zA-Z]/.test(cleanPhone) || nationalDigits.length !== 10) {
      errs.phone = "Phone number must be a valid 10-digit mobile number (excluding country code).";
    }

    if (!draft.address || draft.address.trim() === "") {
      errs.address = "Address cannot be empty.";
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleEdit = () => {
    setDraft({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      address: profile.address,
    });
    setFieldErrors({});
    setSaveSuccess(false);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFieldErrors({});
  };

  const handleChange = (e) => {
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
      name: draft.name,
      email: draft.email,
      phone: draft.phone,
      address: draft.address,
    };

    try {
      const response = await fetch("/api/owner/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updated),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        localStorage.setItem("owner_profile_data", JSON.stringify(data));
      } else {
        throw new Error("PUT failed");
      }
    } catch {
      console.warn("Offline Save Fallback:");
      setProfile(updated);
      localStorage.setItem("owner_profile_data", JSON.stringify(updated));
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

  const handleAvatarUpload = async (e) => {
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
    const updatedWithLocal = { ...profile, avatar: localUrl };
    setProfile(updatedWithLocal);

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

      if (res.ok) {
        const result = await res.json();
        if (result.avatarUrl) {
          const finalProfile = { ...profile, avatar: result.avatarUrl };
          setProfile(finalProfile);
          localStorage.setItem("owner_profile_data", JSON.stringify(finalProfile));
        }
      } else {
        throw new Error("Upload response failed");
      }
    } catch (err) {
      console.warn("Avatar server upload failed, using local URL:", err);
      localStorage.setItem("owner_profile_data", JSON.stringify(updatedWithLocal));
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      signOut();
    }
  };

  const memberYear = profile.memberSince
    ? new Date(profile.memberSince).toLocaleDateString("en-PK", {
        month: "long",
        year: "numeric",
      })
    : "—";

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

  const display = isEditing ? draft : profile;

  return (
    <div className="pd-root">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        
        {/* Back Link */}
        <div>
          <Link
            href="/owner"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#f97316] hover:underline"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Profile Header */}
        <OwnerProfileHeader
          profile={profile}
          isUploading={isUploading}
          handleAvatarClick={handleAvatarClick}
          fileInputRef={fileInputRef}
          handleAvatarUpload={handleAvatarUpload}
          memberYear={memberYear}
        />

        {/* Success message banner */}
        {saveSuccess && (
          <div className="badge badge--confirmed badge--md" style={{ width: "100%", justifyContent: "center", padding: "10px" }}>
            ✅ Profile updated successfully!
          </div>
        )}

        {/* Profile Information */}
        <OwnerProfileInfo
          isEditing={isEditing}
          display={display}
          draft={draft}
          setDraft={setDraft}
          fieldErrors={fieldErrors}
          setFieldErrors={setFieldErrors}
          isSaving={isSaving}
          handleEdit={handleEdit}
          handleSave={handleSave}
          handleCancel={handleCancel}
          handleChange={handleChange}
          showAddressSuggestions={showAddressSuggestions}
          setShowAddressSuggestions={setShowAddressSuggestions}
          addressSuggestionsToDisplay={addressSuggestionsToDisplay}
        />

        {/* Dashboard Metrics */}
        <OwnerProfileMetrics profile={profile} />

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
