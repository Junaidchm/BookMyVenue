"use client";

import React, { useMemo } from "react";
import { Search, Bell, Settings, Filter, Download, Users, CheckSquare, ArrowUpRight, ArrowUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Dummy data for the chart
const activityData = [
  { name: "1st", value: 45 },
  { name: "5th", value: 52 },
  { name: "10th", value: 38 },
  { name: "15th", value: 65 },
  { name: "20th", value: 59 },
  { name: "25th", value: 80 },
  { name: "30th", value: 72 },
];

const topVenues = [
  {
    id: 1,
    name: "The Grand Hall",
    location: "New York, NY",
    revenue: "$24.5k",
    bookings: "12 bookings",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=100&h=100",
  },
  {
    id: 2,
    name: "Sunset Terrace",
    location: "Malibu, CA",
    revenue: "$18.2k",
    bookings: "9 bookings",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=100&h=100",
  },
  {
    id: 3,
    name: "Urban Loft Space",
    location: "Chicago, IL",
    revenue: "$15.8k",
    bookings: "15 bookings",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=100&h=100",
  },
];

const recentApprovals = [
  {
    id: 1,
    name: "Lakeside Retreat",
    owner: "Sarah Jenkins",
    category: "Outdoor / Nature",
    date: "Oct 24, 2023",
    status: "Pending",
    image: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=100&h=100",
  },
  {
    id: 2,
    name: "The Glasshouse",
    owner: "Botanica Events LLC",
    category: "Unique / Conservatory",
    date: "Oct 23, 2023",
    status: "Approved",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=100&h=100",
  },
  {
    id: 3,
    name: "Downtown Studio B",
    owner: "Mark Rivera",
    category: "Studio / Corporate",
    date: "Oct 22, 2023",
    status: "Rejected",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=100&h=100",
  },
];

export default function AdminDashboard() {
  // Dynamic date
  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface p-4 rounded-xl border border-border-subtle shadow-elevation-card">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <Input
            id="admin-search"
            type="text"
            placeholder="Search venues, users, or reports..."
            className="pl-10 bg-surface-container-lowest border-border-subtle focus-visible:ring-ring rounded-full h-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            className="relative p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors duration-200"
            aria-label="Notifications — 3 unread"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-primary-container rounded-full border-2 border-surface animate-pulse" />
          </button>
          <button
            className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors duration-200"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-headline-md text-on-surface mb-1">Platform Overview</h1>
          <p className="text-text-muted text-label-md">{formattedDate}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2 bg-surface h-10 border-border-subtle hover:bg-surface-container-low transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
          <Button variant="outline" className="flex items-center gap-2 bg-surface h-10 border-border-subtle hover:bg-surface-container-low transition-colors">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Revenue */}
        <Card className="border-border-subtle shadow-elevation-card bg-surface overflow-hidden relative group hover:shadow-elevation-card-hover transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-2">
              <span className="text-label-md text-text-muted">Total Revenue</span>
              <Badge variant="secondary" className="bg-status-success-bg text-status-success-text hover:bg-status-success-bg border-none px-2 py-0.5 flex gap-1 items-center font-medium">
                <ArrowUpRight className="w-3 h-3" />
                +12.5%
              </Badge>
            </div>
            <div className="text-4xl font-bold text-on-surface mb-6">$124,500</div>

            {/* Sparkline area */}
            <div className="absolute bottom-0 left-0 w-full h-24 pointer-events-none opacity-15 group-hover:opacity-25 transition-opacity duration-300">
              <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full fill-primary-container">
                <path d="M0,30 L0,20 C10,15 20,25 30,22 C40,18 50,10 60,15 C70,20 80,5 90,10 L100,15 L100,30 Z" />
              </svg>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-24 pointer-events-none">
              <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full stroke-primary-container" fill="none" strokeWidth="1">
                <path d="M0,20 C10,15 20,25 30,22 C40,18 50,10 60,15 C70,20 80,5 90,10 L100,15" />
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Active Users */}
        <Card className="border-border-subtle shadow-elevation-card bg-surface group hover:shadow-elevation-card-hover transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary-container/15 flex items-center justify-center text-primary-container">
                <Users className="w-5 h-5" />
              </div>
              <Badge variant="secondary" className="bg-status-success-bg text-status-success-text hover:bg-status-success-bg border-none px-2 py-0.5 flex gap-1 items-center font-medium">
                <ArrowUp className="w-3 h-3" />
                +4%
              </Badge>
            </div>
            <div className="text-label-md text-text-muted mb-1">Active Users</div>
            <div className="text-2xl font-bold text-on-surface">8,249</div>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card className="border-border-subtle shadow-elevation-card bg-surface group hover:shadow-elevation-card-hover transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-status-warning-bg flex items-center justify-center text-status-warning-text border border-outline-variant/20">
                <CheckSquare className="w-5 h-5" />
              </div>
            </div>
            <div className="text-label-md text-text-muted mb-1">Pending Approvals</div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold text-on-surface">24</div>
              <span className="text-xs font-medium text-status-warning-text bg-status-warning-bg px-2 py-0.5 rounded-full">Requires attention</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Middle Row: Charts & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Platform Activity Chart */}
        <Card className="lg:col-span-2 border-border-subtle shadow-elevation-card bg-surface">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b-0">
            <CardTitle className="text-headline-sm text-on-surface">Platform Activity</CardTitle>
            <Button variant="outline" size="sm" className="h-8 text-xs font-medium text-on-surface-variant border-border-subtle bg-surface hover:bg-surface-container-low">
              Last 30 Days
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: 'var(--shadow-card-hover)',
                      backgroundColor: 'var(--surface)',
                      color: 'var(--on-surface)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="var(--tertiary-container)"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, fill: 'var(--surface)', stroke: 'var(--tertiary-container)' }}
                    activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--tertiary-container)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Venues List */}
        <Card className="border-border-subtle shadow-elevation-card bg-surface">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b-0">
            <CardTitle className="text-headline-sm text-on-surface">Top Venues</CardTitle>
            <Button variant="ghost" size="sm" className="h-8 text-xs font-medium text-primary-container hover:text-primary-container hover:bg-primary-container/10 px-2 flex items-center gap-1">
              View All <ArrowUpRight className="w-3 h-3" />
            </Button>
          </CardHeader>
          <CardContent className="mt-4 flex flex-col gap-6">
            {topVenues.map((venue) => (
              <div key={venue.id} className="flex items-center justify-between group cursor-pointer rounded-lg p-2 -mx-2 hover:bg-surface-container-low transition-colors duration-200">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 rounded-lg border border-border-subtle">
                    <AvatarImage src={venue.image} alt={venue.name} className="object-cover" />
                    <AvatarFallback className="rounded-lg bg-surface-container text-text-muted">VN</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-sm font-semibold text-on-surface">{venue.name}</h4>
                    <p className="text-xs text-text-muted">{venue.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-on-surface">{venue.revenue}</div>
                  <div className="text-xs font-medium text-status-success-text">{venue.bookings}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Venue Approvals Table */}
      <Card className="border-border-subtle shadow-elevation-card bg-surface">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border-subtle pb-4">
          <CardTitle className="text-headline-sm text-on-surface">Recent Venue Approvals</CardTitle>
          <Button variant="secondary" size="sm" className="h-8 text-xs font-medium bg-primary-container/15 text-primary-container hover:bg-primary-container/25">
            View Queue
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-transparent">
                <TableRow className="border-b border-border-subtle hover:bg-transparent">
                  <TableHead className="text-xs font-medium text-text-muted uppercase tracking-wider py-4 pl-6">Venue Name</TableHead>
                  <TableHead className="text-xs font-medium text-text-muted uppercase tracking-wider py-4">Owner</TableHead>
                  <TableHead className="text-xs font-medium text-text-muted uppercase tracking-wider py-4 hidden md:table-cell">Category</TableHead>
                  <TableHead className="text-xs font-medium text-text-muted uppercase tracking-wider py-4 hidden sm:table-cell">Date Submitted</TableHead>
                  <TableHead className="text-xs font-medium text-text-muted uppercase tracking-wider py-4">Status</TableHead>
                  <TableHead className="text-xs font-medium text-text-muted uppercase tracking-wider py-4 text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentApprovals.map((approval) => (
                  <TableRow key={approval.id} className="border-b border-border-subtle/50 hover:bg-surface-container-low/50 transition-colors duration-200">
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 rounded-lg border border-border-subtle">
                          <AvatarImage src={approval.image} alt={approval.name} className="object-cover" />
                          <AvatarFallback className="rounded-lg bg-surface-container">VN</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-on-surface">{approval.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-sm text-on-surface-variant">{approval.owner}</TableCell>
                    <TableCell className="py-4 text-sm text-on-surface-variant hidden md:table-cell">{approval.category}</TableCell>
                    <TableCell className="py-4 text-sm text-on-surface-variant hidden sm:table-cell">{approval.date}</TableCell>
                    <TableCell className="py-4">
                      <Badge
                        variant="outline"
                        className={`font-medium border-0 px-2.5 py-0.5 ${
                          approval.status === 'Approved' ? 'bg-status-success-bg text-status-success-text' :
                          approval.status === 'Pending' ? 'bg-status-warning-bg text-status-warning-text' :
                          'bg-error-container text-on-error-container'
                        }`}
                      >
                        {approval.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 text-right pr-6">
                       <Button variant="ghost" size="sm" className="h-8 text-text-muted hover:text-on-surface" aria-label={`Open menu for ${approval.name}`}>
                         <span className="sr-only">Open menu</span>
                         •••
                       </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
