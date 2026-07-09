"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAuth } from "@/components/auth/session-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import apiClient from "@/services/api-client";
import {
  Building2,
  Phone,
  Briefcase,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function OnboardingPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: session, update } = useSession();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    businessName: "",
    bankRoutingNumber: "",
    bankAccountNumber: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Guards
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/login?callbackUrl=/host/onboarding");
      } else if (user?.roles?.includes("OWNER")) {
        router.push("/owner");
      }
    }
  }, [isAuthenticated, authLoading, user, router]);

  if (authLoading || !isAuthenticated || user?.roles?.includes("OWNER")) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.businessName.trim() || !formData.phoneNumber.trim()) {
        setError("Please fill in all details before proceeding.");
        return;
      }
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.bankAccountNumber.trim() || !formData.bankRoutingNumber.trim()) {
      setError("Please fill in all bank details.");
      return;
    }

    setSubmitting(true);

    try {
      // 1. Submit the became-owner info to backend
      await apiClient.post("/auth/become-owner", formData);

      // 2. Trigger next-auth token refresh
      await update();

      // Move to success step
      setStep(3);
      
      // Redirect after 3s
      setTimeout(() => {
        router.push("/owner");
        router.refresh();
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to complete onboarding.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col justify-between">
      {/* Mini navbar */}
      <header className="h-16 border-b border-stone-200/80 bg-white/70 backdrop-blur-md px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-white">
            <Building2 className="size-4" />
          </div>
          <span className="font-display text-sm font-bold text-stone-900">
            BookMy<span className="text-primary">Venue</span>
          </span>
        </div>
        <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
          Step {step} of 3
        </span>
      </header>

      {/* Main card */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-white rounded-3xl border border-stone-200 p-8 md:p-10 shadow-xl space-y-8 relative overflow-hidden">
          {/* Progress bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-stone-100 flex">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-primary tracking-wider uppercase">Host Setup</span>
                <h1 className="text-3xl font-bold tracking-tight text-stone-900">Let&apos;s build your host profile</h1>
                <p className="text-sm text-stone-500">Provide basic information about your hosting business.</p>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 text-sm">
                  <AlertCircle className="size-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="businessName" className="text-xs font-bold uppercase tracking-wider text-stone-600">
                    Host / Business Name
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute top-3 left-3 size-4.5 text-stone-400" />
                    <Input
                      id="businessName"
                      placeholder="e.g. Dream Event Spaces"
                      value={formData.businessName}
                      onChange={(e) => handleInputChange("businessName", e.target.value)}
                      className="pl-10 h-11 border-stone-200 focus-visible:ring-primary rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="phoneNumber" className="text-xs font-bold uppercase tracking-wider text-stone-600">
                    Contact Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute top-3 left-3 size-4.5 text-stone-400" />
                    <Input
                      id="phoneNumber"
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                      className="pl-10 h-11 border-stone-200 focus-visible:ring-primary rounded-xl"
                      type="tel"
                      required
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full h-11 bg-primary text-white hover:bg-orange-600 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-200">
                Continue
                <ChevronRight className="ml-1 size-4" />
              </Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-primary tracking-wider uppercase">Payout Account</span>
                <h1 className="text-3xl font-bold tracking-tight text-stone-900">Configure your payout bank</h1>
                <p className="text-sm text-stone-500">Payments from event planners will be settled to this account.</p>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 text-sm">
                  <AlertCircle className="size-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="bankAccountNumber" className="text-xs font-bold uppercase tracking-wider text-stone-600">
                    Bank Account Number
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute top-3 left-3 size-4.5 text-stone-400" />
                    <Input
                      id="bankAccountNumber"
                      placeholder="Enter account number"
                      value={formData.bankAccountNumber}
                      onChange={(e) => handleInputChange("bankAccountNumber", e.target.value)}
                      className="pl-10 h-11 border-stone-200 focus-visible:ring-primary rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="bankRoutingNumber" className="text-xs font-bold uppercase tracking-wider text-stone-600">
                    Routing Number (IFSC)
                  </label>
                  <div className="relative">
                    <Building2 className="absolute top-3 left-3 size-4.5 text-stone-400" />
                    <Input
                      id="bankRoutingNumber"
                      placeholder="Enter bank routing or IFSC code"
                      value={formData.bankRoutingNumber}
                      onChange={(e) => handleInputChange("bankRoutingNumber", e.target.value)}
                      className="pl-10 h-11 border-stone-200 focus-visible:ring-primary rounded-xl"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={submitting}
                  className="flex-1 h-11 border-stone-200 text-stone-700 rounded-xl font-semibold hover:bg-stone-50"
                >
                  <ChevronLeft className="mr-1 size-4" />
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 h-11 bg-primary text-white hover:bg-orange-600 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-1 size-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <ChevronRight className="ml-1 size-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center justify-center text-center py-10 space-y-6 animate-in fade-in zoom-in duration-300">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle className="size-10" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-stone-900">You are now a Host!</h1>
                <p className="text-sm text-stone-500 max-w-sm">
                  Your profile has been created and your OWNER role is active.
                  We are redirecting you to your new Owner Portal...
                </p>
              </div>
              <Loader2 className="h-6 w-6 animate-spin text-stone-400 mt-4" />
            </div>
          )}
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="h-14 border-t border-stone-200/50 bg-white/40 flex items-center justify-center text-[11px] text-stone-400">
        &copy; {new Date().getFullYear()} BookMyVenue. All rights reserved.
      </footer>
    </div>
  );
}
