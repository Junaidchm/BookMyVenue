"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/session-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Save, 
  CheckCircle, 
  Edit3, 
  Camera, 
  Bell, 
  Lock,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

const DEFAULT_ADMIN_PROFILE = {
  name: "System Administrator",
  phone: "+1 (555) 019-2834",
  avatar: "https://i.pravatar.cc/150?img=3",
  securityLevel: "Level 3 (Superuser)",
  notificationsEnabled: true,
};

export function AdminProfile() {
  const { user } = useAuth();
  
  // Profile state with default fallback
  const [profile, setProfile] = useState(DEFAULT_ADMIN_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Edit draft inputs
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [error, setError] = useState("");

  // Sync profile details on load
  useEffect(() => {
    const savedData = localStorage.getItem("bmv_admin_profile");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setProfile(parsed);
        setName(parsed.name);
        setPhone(parsed.phone);
        setNotifications(parsed.notificationsEnabled);
        return;
      } catch (e) {
        console.error("Failed to parse admin profile", e);
      }
    }
    
    // Fallback to active user session details
    const initialName = user?.fullName || DEFAULT_ADMIN_PROFILE.name;
    setName(initialName);
    setPhone(DEFAULT_ADMIN_PROFILE.phone);
    setNotifications(DEFAULT_ADMIN_PROFILE.notificationsEnabled);
  }, [user]);

  const handleEdit = () => {
    setName(profile.name);
    setPhone(profile.phone);
    setNotifications(profile.notificationsEnabled);
    setError("");
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Full Name cannot be empty.");
      return;
    }

    setIsSaving(true);
    const updated = {
      ...profile,
      name,
      phone,
      notificationsEnabled: notifications,
    };

    // Save with local storage fallback
    setTimeout(() => {
      setProfile(updated);
      localStorage.setItem("bmv_admin_profile", JSON.stringify(updated));
      setIsSaving(false);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Back Link to Admin Dashboard */}
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-container hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Console</span>
        </Link>
      </div>

      {/* Page Header */}
      <div>
        <h1 className="text-headline-md font-bold text-on-surface">Admin Profile</h1>
        <p className="text-text-muted text-label-md">Manage your profile info, clearance levels, and notifications.</p>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 bg-status-success-bg border border-status-success-text/20 text-status-success-text px-4 py-3 rounded-xl text-sm font-semibold animate-in fade-in duration-205">
          <CheckCircle className="w-4 h-4" />
          Profile updated successfully!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Card: Info & Badges */}
        <div className="space-y-6 md:col-span-1">
          <Card className="border-border-subtle shadow-elevation-card bg-surface overflow-hidden">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="relative group w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-primary-container/20">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white">
                  <Camera className="w-5 h-5" />
                  <span className="text-[10px] uppercase font-bold mt-1">Change</span>
                </div>
              </div>
              
              <h3 className="font-semibold text-lg text-on-surface truncate w-full">{profile.name}</h3>
              <p className="text-xs text-text-muted mb-4">{user?.email || "admin@bookmyvenue.com"}</p>

              <Badge variant="outline" className="bg-primary-container/10 text-primary-container border-none px-3 py-1 font-semibold">
                Console Admin
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-border-subtle shadow-elevation-card bg-surface">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Shield className="w-4 h-4 text-text-muted" /> Clearance Level
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-3">
              <div>
                <p className="font-semibold text-on-surface">Clearance Info</p>
                <p className="text-text-muted">{profile.securityLevel}</p>
              </div>
              <div className="border-t border-border-subtle pt-2">
                <p className="font-semibold text-on-surface">Console Roles</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {user?.roles?.map((role) => (
                    <Badge key={role} variant="outline" className="text-[10px] capitalize bg-surface-container-low text-text-muted border-none">
                      {role}
                    </Badge>
                  )) || <Badge variant="outline" className="text-[10px] border-none bg-surface-container-low text-text-muted">Administrator</Badge>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Card: Editable Details Form */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-border-subtle shadow-elevation-card bg-surface">
            <CardHeader className="flex flex-row justify-between items-center pb-4 border-b border-border-subtle">
              <div>
                <CardTitle className="text-headline-sm">Personal Info</CardTitle>
                <CardDescription>Update your personal information and console configurations.</CardDescription>
              </div>
              {!isEditing && (
                <Button 
                  onClick={handleEdit} 
                  variant="outline" 
                  className="flex items-center gap-2 bg-surface hover:bg-surface-container-low h-9 border-border-subtle transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Profile
                </Button>
              )}
            </CardHeader>

            <CardContent className="pt-6">
              <form onSubmit={handleSave} className="space-y-6">
                
                {error && (
                  <div className="text-xs text-red-500 font-semibold">{error}</div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-muted flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" /> Full Name
                    </label>
                    <Input
                      type="text"
                      disabled={!isEditing}
                      value={isEditing ? name : profile.name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-surface-container-lowest border-border-subtle h-10 disabled:opacity-75 focus-visible:ring-ring"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-muted flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" /> Phone Number
                    </label>
                    <Input
                      type="tel"
                      disabled={!isEditing}
                      value={isEditing ? phone : profile.phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-surface-container-lowest border-border-subtle h-10 disabled:opacity-75 focus-visible:ring-ring"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-muted flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" /> Email Address
                    </label>
                    <Input
                      type="email"
                      disabled
                      value={user?.email || "admin@bookmyvenue.com"}
                      className="bg-surface-container-low/50 border-border-subtle h-10 cursor-not-allowed text-text-muted"
                    />
                  </div>

                  {/* Encryption Status */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-muted flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" /> Security Mode
                    </label>
                    <div className="h-10 px-3 bg-surface-container-low/50 rounded-lg flex items-center justify-between text-xs text-text-muted border border-border-subtle">
                      <span>Password-managed (SSO)</span>
                      <Badge className="bg-surface text-text-muted border border-border-subtle hover:bg-surface px-2 py-0.5 rounded">Secure</Badge>
                    </div>
                  </div>
                </div>

                {/* Notifications Setup */}
                <div className="border-t border-border-subtle pt-6 space-y-4">
                  <h4 className="text-sm font-semibold flex items-center gap-2 text-on-surface">
                    <Bell className="w-4 h-4 text-text-muted" /> Notification Settings
                  </h4>
                  
                  <div className="flex items-start justify-between gap-4 p-3 bg-surface-container-low/30 rounded-xl border border-border-subtle/50">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-on-surface">Console Alerts</p>
                      <p className="text-[11px] text-text-muted">Receive reports about pending host approvals and disputed bookings.</p>
                    </div>
                    
                    <input
                      type="checkbox"
                      disabled={!isEditing}
                      checked={isEditing ? notifications : profile.notificationsEnabled}
                      onChange={(e) => setNotifications(e.target.checked)}
                      className="w-4 h-4 accent-primary-container rounded cursor-pointer self-center"
                    />
                  </div>
                </div>

                {/* Edit Controls */}
                {isEditing && (
                  <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
                    <Button 
                      type="button" 
                      onClick={() => setIsEditing(false)} 
                      variant="ghost" 
                      className="h-10 px-4 hover:bg-surface-container-low"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSaving} 
                      className="bg-primary-container text-white h-10 px-6 font-semibold flex items-center gap-2 rounded-lg hover:bg-primary-container/90"
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                )}

              </form>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
