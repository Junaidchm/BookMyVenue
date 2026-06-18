"use client";

import { useState, useCallback } from "react";
import { MapPin, Clock, Search, Filter, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const initialVenues = [
  {
    id: 1,
    name: "The Grand Crystal Pavilion",
    location: "Downtown Metro, South District",
    owner: "Jonathan Hayes",
    avatar: "https://i.pravatar.cc/40?img=11",
    requestedTime: "2 hours ago",
    badge: "Urgent",
    badgeType: "urgent" as const,
    buttonLabel: "Review Details",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=200&fit=crop",
    status: "pending",
  },
  {
    id: 2,
    name: "Elevate Innovation Loft",
    location: "Tech Park, Westside",
    owner: "Sarah Kline (Agency)",
    avatar: "SK",
    requestedTime: "5 hours ago",
    badge: "Standard",
    badgeType: "standard" as const,
    buttonLabel: "Review Details",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=200&fit=crop",
    status: "pending",
  },
  {
    id: 3,
    name: "Villa Serenity Gardens",
    location: "North Hills Estate",
    owner: "Elena Rodriguez",
    avatar: "https://i.pravatar.cc/40?img=5",
    requestedTime: "1 day ago",
    badge: "Listing Update",
    badgeType: "update" as const,
    buttonLabel: "Review Changes",
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=200&fit=crop",
    status: "pending",
  },
];

export default function ApprovalsPage() {
  const [venues, setVenues] = useState(initialVenues);
  const [exitingIds, setExitingIds] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState("");

  const animateAndRemove = useCallback((id: number) => {
    setExitingIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setVenues((prev) => prev.filter((v) => v.id !== id));
      setExitingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 300);
  }, []);

  const handleApprove = (id: number) => animateAndRemove(id);
  const handleReject = (id: number) => animateAndRemove(id);

  const filtered = venues.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.location.toLowerCase().includes(search.toLowerCase())
  );

  const pendingCount = venues.length;

  const badgeConfig = {
    urgent: {
      className: "bg-error-container text-on-error-container",
      label: "❗ Urgent",
    },
    standard: {
      className: "bg-surface text-on-surface border border-border-subtle",
      label: "Standard",
    },
    update: {
      className: "bg-surface text-on-surface border border-border-subtle",
      label: "🔄 Listing Update",
    },
  };

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-headline-md text-on-surface mb-2">Venue Approvals</h1>
        <p className="text-text-muted text-body-md">Review and process venue listing requests.</p>
      </div>

      {/* Search + Filter + Stats */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <Input
            id="approval-search"
            type="text"
            placeholder="Search by venue name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-11 border-border-subtle focus-visible:ring-ring rounded-lg bg-surface"
          />
        </div>

        {/* Filter */}
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-surface border-border-subtle text-on-surface-variant h-11 hover:bg-surface-container-low"
        >
          <Filter className="w-4 h-4" />
          All Categories
        </Button>

        {/* Pending stat */}
        <Card className="border-border-subtle bg-surface shadow-elevation-card">
          <CardContent className="px-6 py-2.5 text-center flex flex-col items-center justify-center">
            <p className="text-xs text-text-muted flex items-center gap-1">
              <Clock className="w-3 h-3" /> Pending
            </p>
            <p className="text-2xl font-bold text-primary-container">{pendingCount}</p>
          </CardContent>
        </Card>

        {/* Avg Time stat */}
        <Card className="border-border-subtle bg-surface shadow-elevation-card">
          <CardContent className="px-6 py-2.5 text-center flex flex-col items-center justify-center">
            <p className="text-xs text-text-muted flex items-center gap-1">
              <Clock className="w-3 h-3" /> Avg Time
            </p>
            <p className="text-2xl font-bold text-on-surface">4.2h</p>
          </CardContent>
        </Card>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-status-success-bg mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-status-success-text" />
          </div>
          <p className="text-lg font-semibold text-on-surface mb-1">All caught up!</p>
          <p className="text-sm text-text-muted">No pending approvals at this time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((venue) => {
            const isExiting = exitingIds.has(venue.id);
            const badge = badgeConfig[venue.badgeType];

            return (
              <Card
                key={venue.id}
                className={`border-border-subtle shadow-elevation-card bg-surface overflow-hidden group hover:shadow-elevation-card-hover transition-all duration-300 ${
                  isExiting ? "opacity-0 scale-95 translate-y-2" : "opacity-100 scale-100 translate-y-0"
                }`}
              >
                {/* Image + Badge */}
                <div className="relative overflow-hidden">
                  <img
                    src={venue.image}
                    alt={venue.name}
                    className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {venue.badgeType === "urgent" && (
                      <>
                        <Badge className={badge.className + " text-xs font-semibold"}>
                          {badge.label}
                        </Badge>
                        <Badge className="bg-surface text-on-surface border border-border-subtle text-xs font-semibold">
                          New Listing
                        </Badge>
                      </>
                    )}
                    {venue.badgeType !== "urgent" && (
                      <Badge className={badge.className + " text-xs font-semibold"}>
                        {badge.label}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Content */}
                <CardContent className="p-4">
                  <h3 className="font-semibold text-on-surface text-base mb-1">
                    {venue.name}
                  </h3>
                  <p className="text-sm text-text-muted flex items-center gap-1 mb-3">
                    <MapPin className="w-3 h-3 shrink-0" />
                    {venue.location}
                  </p>

                  {/* Owner */}
                  <div className="flex items-center gap-3 bg-surface-container-low rounded-lg p-2.5 mb-4">
                    {venue.avatar.startsWith("http") ? (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={venue.avatar} alt={venue.owner} className="object-cover" />
                        <AvatarFallback className="bg-primary-container/15 text-primary-container text-xs font-bold">
                          {venue.owner.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-secondary-container text-on-secondary-container text-xs font-bold">
                          {venue.avatar}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <p className="text-sm font-medium text-on-surface">
                        {venue.owner}
                      </p>
                      <p className="text-xs text-text-muted">
                        Requested {venue.requestedTime}
                      </p>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 border-border-subtle text-on-surface-variant text-sm font-medium h-10 hover:bg-surface-container-low"
                    >
                      {venue.buttonLabel}
                    </Button>
                    <Button
                      onClick={() => handleApprove(venue.id)}
                      className="flex-1 bg-status-success-bg text-status-success-text hover:bg-status-success-bg/80 text-sm font-medium h-10 border-0 shadow-none"
                      aria-label={`Approve ${venue.name}`}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleReject(venue.id)}
                      className="flex-1 bg-error-container text-on-error-container hover:bg-error-container/80 text-sm font-medium h-10 border-0 shadow-none"
                      aria-label={`Reject ${venue.name}`}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}