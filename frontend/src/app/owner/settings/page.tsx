"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Settings as GearIcon, Save, Shield, User, Bell, Building2, Phone, CreditCard, Landmark, Loader2, AlertCircle } from "lucide-react";
import authService from "@/services/auth.service";

export default function SettingsPage() {
  const [businessName, setBusinessName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bankRoutingNumber, setBankRoutingNumber] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  // Fetch live profile details
  const { data: profileResponse, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["owner", "profile"],
    queryFn: () => authService.getProfile(),
  });
  const profile = profileResponse?.data;

  // Prefill fields
  useEffect(() => {
    if (profile) {
      setBusinessName(profile.ownerProfile?.businessName || "");
      setPhoneNumber(profile.ownerProfile?.phoneNumber || "");
      setBankRoutingNumber(profile.ownerProfile?.bankRoutingNumber || "");
      setBankAccountNumber(profile.ownerProfile?.bankAccountNumber || "");
    }
  }, [profile]);

  // Update profile mutation
  const saveMutation = useMutation({
    mutationFn: (payload: {
      businessName: string;
      phoneNumber: string;
      bankRoutingNumber: string;
      bankAccountNumber: string;
    }) => authService.updateProfile(payload),
    onSuccess: () => {
      setIsSaved(true);
      refetch();
      setTimeout(() => setIsSaved(false), 3000);
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({
      businessName: businessName.trim(),
      phoneNumber: phoneNumber.trim(),
      bankRoutingNumber: bankRoutingNumber.trim(),
      bankAccountNumber: bankAccountNumber.trim(),
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-border-subtle pb-5">
        <div>
          <h1 className="text-4xl font-bold text-on-surface">Settings</h1>
          <p className="mt-1.5 text-body-md text-text-muted">Configure your personal and portal preferences.</p>
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
            <h3 className="text-lg font-bold text-red-800">Failed to Load Profile</h3>
            <p className="text-body-md text-red-600 mt-1">
              {error instanceof Error ? error.message : "Something went wrong while fetching settings."}
            </p>
          </div>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSave} className="rounded-2xl bg-white border border-border-subtle p-6 shadow-elevation-card space-y-6">
              <h3 className="text-2xl font-bold text-on-surface flex items-center gap-2 border-b border-border-subtle/50 pb-3">
                <User className="h-5.5 w-5.5 text-primary-container" />
                <span>Profile Settings</span>
              </h3>

              {isSaved && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-label-sm font-semibold text-emerald-800">
                  Changes saved successfully!
                </div>
              )}

              {saveMutation.isError && (
                <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-label-sm font-semibold text-red-800">
                  {saveMutation.error instanceof Error ? saveMutation.error.message : "Failed to update profile"}
                </div>
              )}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-label-md text-on-surface font-semibold" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={profile?.fullName || ""}
                    disabled
                    className="w-full rounded-xl border border-border-subtle px-4 py-3 text-body-md bg-stone-50 text-text-muted cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-label-md text-on-surface font-semibold" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={profile?.email || ""}
                    disabled
                    className="w-full rounded-xl border border-border-subtle px-4 py-3 text-body-md bg-stone-50 text-text-muted cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-label-md text-on-surface font-semibold flex items-center gap-1.5" htmlFor="businessName">
                    <Building2 className="h-4 w-4 text-text-muted" />
                    <span>Business Name</span>
                  </label>
                  <input
                    id="businessName"
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Sarah's Banquet Hall"
                    className="w-full rounded-xl border border-border-subtle px-4 py-3 text-body-md bg-white focus-ring-brand"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-label-md text-on-surface font-semibold flex items-center gap-1.5" htmlFor="phoneNumber">
                    <Phone className="h-4 w-4 text-text-muted" />
                    <span>Phone Number</span>
                  </label>
                  <input
                    id="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-border-subtle px-4 py-3 text-body-md bg-white focus-ring-brand"
                  />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-on-surface flex items-center gap-2 border-b border-border-subtle/50 pb-3 pt-4">
                <CreditCard className="h-5.5 w-5.5 text-primary-container" />
                <span>Payout Bank Details</span>
              </h3>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-label-md text-on-surface font-semibold flex items-center gap-1.5" htmlFor="bankRoutingNumber">
                    <Landmark className="h-4 w-4 text-text-muted" />
                    <span>Bank IFSC / Routing Code</span>
                  </label>
                  <input
                    id="bankRoutingNumber"
                    type="text"
                    value={bankRoutingNumber}
                    onChange={(e) => setBankRoutingNumber(e.target.value)}
                    placeholder="HDFC0001234"
                    className="w-full rounded-xl border border-border-subtle px-4 py-3 text-body-md bg-white focus-ring-brand"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-label-md text-on-surface font-semibold flex items-center gap-1.5" htmlFor="bankAccountNumber">
                    <CreditCard className="h-4 w-4 text-text-muted" />
                    <span>Bank Account Number</span>
                  </label>
                  <input
                    id="bankAccountNumber"
                    type="text"
                    value={bankAccountNumber}
                    onChange={(e) => setBankAccountNumber(e.target.value)}
                    placeholder="50100234567890"
                    className="w-full rounded-xl border border-border-subtle px-4 py-3 text-body-md bg-white focus-ring-brand"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="flex items-center gap-2 rounded-full bg-[#582200] px-6 py-3 text-label-md font-bold text-white shadow-md hover:bg-[#3c2d26] disabled:bg-stone-300 disabled:cursor-not-allowed transition-all"
              >
                {saveMutation.isPending ? (
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                ) : (
                  <Save className="h-4.5 w-4.5" />
                )}
                <span>{saveMutation.isPending ? "Saving..." : "Save Changes"}</span>
              </button>
            </form>

            <div className="rounded-2xl bg-white border border-border-subtle p-6 shadow-elevation-card space-y-4">
              <h3 className="text-2xl font-bold text-on-surface flex items-center gap-2">
                <Shield className="h-5.5 w-5.5 text-primary-container" />
                <span>Security</span>
              </h3>
              <p className="text-body-md text-text-muted">Manage your password, login metrics, and two-factor authentication.</p>
              <button className="rounded-full border border-border-subtle px-5 py-2.5 text-label-sm font-bold text-on-surface hover:bg-stone-50 transition-colors">
                Reset Password
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-border-subtle p-6 shadow-elevation-card h-max space-y-4">
            <h3 className="text-xl font-bold text-on-surface flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary-container" />
              <span>Alert Preferences</span>
            </h3>
            <div className="space-y-3">
              {[
                { label: "New inquiry requests", defaultChecked: true },
                { label: "Booking confirmations", defaultChecked: true },
                { label: "Payout transfers", defaultChecked: false },
              ].map((pref, i) => (
                <label key={i} className="flex items-center gap-2.5 text-label-md text-on-surface cursor-pointer select-none">
                  <input
                    type="checkbox"
                    defaultChecked={pref.defaultChecked}
                    className="peer h-4.5 w-4.5 rounded border border-border-subtle checked:bg-primary-container transition-all"
                  />
                  <span className="text-text-muted peer-checked:text-on-surface font-medium">{pref.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
