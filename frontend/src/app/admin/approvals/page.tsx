"use client";
import { useState } from "react";
import { MapPin, Clock, Search, Filter, CheckCircle } from "lucide-react";

const initialVenues = [
  {
    id: 1,
    name: "The Grand Crystal Pavilion",
    location: "Downtown Metro, South District",
    owner: "Jonathan Hayes",
    avatar: "https://i.pravatar.cc/40?img=11",
    requestedTime: "2 hours ago",
    badge: "Urgent",
    badgeType: "urgent",
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
    badgeType: "standard",
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
    badgeType: "update",
    buttonLabel: "Review Changes",
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=200&fit=crop",
    status: "pending",
  },
];

export default function ApprovalsPage() {
  const [venues, setVenues] = useState(initialVenues);
  const [search, setSearch] = useState("");

  const handleApprove = (id: number) => {
    setVenues((prev) => prev.filter((v) => v.id !== id));
  };

  const filtered = venues.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.location.toLowerCase().includes(search.toLowerCase())
  );

  const pendingCount = venues.length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Venue Approvals</h1>
      </div>

      {/* Search + Filter + Stats */}
      <div className="flex gap-4 mb-6">
        {/* Search */}
        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2.5">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by venue name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 outline-none text-sm text-gray-700"
          />
        </div>

        {/* Filter */}
        <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-600">
          <Filter className="w-4 h-4" />
          All Categories
        </button>

        {/* Pending */}
        <div className="bg-white border border-gray-200 rounded-lg px-6 py-2.5 text-center">
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Pending
          </p>
          <p className="text-2xl font-bold text-orange-500">{pendingCount}</p>
        </div>

        {/* Avg Time */}
        <div className="bg-white border border-gray-200 rounded-lg px-6 py-2.5 text-center">
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Avg Time
          </p>
          <p className="text-2xl font-bold text-gray-800">4.2h</p>
        </div>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
          <p className="text-lg font-medium">All caught up!</p>
          <p className="text-sm">No pending approvals.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((venue) => (
            <div
              key={venue.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              {/* Image + Badge */}
              <div className="relative">
                <img
                  src={venue.image}
                  alt={venue.name}
                  className="w-full h-44 object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {venue.badgeType === "urgent" && (
                    <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                      ❗ Urgent
                    </span>
                  )}
                  {venue.badgeType === "urgent" && (
                    <span className="bg-white text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">
                      New Listing
                    </span>
                  )}
                  {venue.badgeType === "standard" && (
                    <span className="bg-white text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">
                      Standard
                    </span>
                  )}
                  {venue.badgeType === "update" && (
                    <span className="bg-white text-gray-700 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                      🔄 Listing Update
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-base mb-1">
                  {venue.name}
                </h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                  <MapPin className="w-3 h-3" />
                  {venue.location}
                </p>

                {/* Owner */}
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-2 mb-4">
                  {venue.avatar.startsWith("http") ? (
                    <img
                      src={venue.avatar}
                      alt={venue.owner}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-orange-300 flex items-center justify-center text-xs font-bold text-white">
                      {venue.avatar}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {venue.owner}
                    </p>
                    <p className="text-xs text-gray-400">
                      Requested {venue.requestedTime}
                    </p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 border border-gray-200 text-gray-700 text-sm font-medium py-2 rounded-lg hover:bg-gray-50">
                    {venue.buttonLabel}
                  </button>
                  <button
                    onClick={() => handleApprove(venue.id)}
                    className="flex-1 bg-green-50 text-green-600 text-sm font-medium py-2 rounded-lg hover:bg-green-100 flex items-center justify-center gap-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}