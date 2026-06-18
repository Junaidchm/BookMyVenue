"use client";

import React from "react";
import {
  Search, Filter, UserPlus, Monitor, AlertTriangle,
  MoreVertical, ChevronLeft, ChevronRight, TrendingUp
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const userData = [
  {
    id: 1,
    name: "Sarah Jenkins",
    email: "sarah.j@example.com",
    role: "Venue Owner",
    joinDate: "Oct 12, 2023",
    activityMain: "3 Venues",
    activitySub: "142 Total Bookings",
    image: "https://i.pravatar.cc/150?u=sarah",
    isReported: false,
  },
  {
    id: 2,
    name: "Marcus K.",
    email: "marcus.k@email.com",
    role: "Venue Booker",
    joinDate: "Jan 05, 2024",
    activityMain: "12 Bookings",
    activitySub: "Last active 2h ago",
    image: "https://i.pravatar.cc/150?u=marcus",
    isReported: false,
  },
  {
    id: 3,
    name: "David Miller",
    email: "david.m88@test.com",
    role: "Venue Booker",
    joinDate: "Nov 22, 2023",
    activityMain: "2 Cancellations",
    activitySub: "Reported by Owner",
    activitySubColor: "text-error",
    image: "https://i.pravatar.cc/150?u=david",
    isReported: true,
  }
];

const tabs = [
  { label: "All Users", count: undefined, active: true },
  { label: "Venue Bookers", count: undefined, active: false },
  { label: "Venue Owners", count: undefined, active: false },
  { label: "Flagged", count: 8, active: false },
];

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-8 pb-8 max-w-6xl">
      {/* Header Section */}
      <div>
        <h1 className="text-headline-md text-on-surface mb-2">User Management</h1>
        <p className="text-text-muted text-body-md">Monitor, manage, and assist BookMyVenue users.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* New Signups */}
        <Card className="border-border-subtle shadow-elevation-card bg-surface overflow-hidden rounded-xl group hover:shadow-elevation-card-hover transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-semibold text-text-muted tracking-wider uppercase">New Signups (24H)</span>
              <div className="w-9 h-9 rounded-lg bg-primary-container/15 flex items-center justify-center">
                <UserPlus className="w-4.5 h-4.5 text-primary-container" />
              </div>
            </div>
            <div className="flex items-baseline gap-3">
              <div className="text-4xl font-bold text-on-surface">142</div>
              <Badge variant="secondary" className="bg-status-success-bg text-status-success-text hover:bg-status-success-bg border-none px-2 py-0.5 flex gap-1 items-center font-medium rounded text-xs">
                <TrendingUp className="w-3 h-3" />
                12%
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Active Sessions */}
        <Card className="border-border-subtle shadow-elevation-card bg-surface overflow-hidden rounded-xl group hover:shadow-elevation-card-hover transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-semibold text-text-muted tracking-wider uppercase">Active Sessions</span>
              <div className="w-9 h-9 rounded-lg bg-tertiary/15 flex items-center justify-center">
                <Monitor className="w-4.5 h-4.5 text-tertiary" />
              </div>
            </div>
            <div className="flex items-baseline gap-3">
              <div className="text-4xl font-bold text-on-surface">1,894</div>
              <span className="text-sm text-text-muted font-medium">Currently online</span>
            </div>
          </CardContent>
        </Card>

        {/* Reported Users */}
        <Card className="border-border-subtle shadow-elevation-card bg-surface overflow-hidden rounded-xl group hover:shadow-elevation-card-hover transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-semibold text-text-muted tracking-wider uppercase">Reported Users</span>
              <div className="w-9 h-9 rounded-lg bg-error-container/40 flex items-center justify-center">
                <AlertTriangle className="w-4.5 h-4.5 text-error" />
              </div>
            </div>
            <div className="flex items-baseline gap-3">
              <div className="text-4xl font-bold text-on-surface">8</div>
              <Badge variant="secondary" className="bg-status-warning-bg text-status-warning-text hover:bg-status-warning-bg border-none px-2 py-0.5 rounded text-xs font-medium">
                Requires review
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col gap-4">
        {/* Tabs and Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
            {tabs.map((tab) => (
              <Button
                key={tab.label}
                className={
                  tab.active
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-5 py-2 h-10 text-sm font-medium"
                    : "bg-transparent text-on-surface-variant hover:bg-surface-container-low rounded-md px-5 py-2 h-10 text-sm font-medium"
                }
                variant={tab.active ? "default" : "ghost"}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <Badge className="ml-2 bg-error-container text-on-error-container hover:bg-error-container border border-error/20 px-1.5 min-w-[20px] h-5 flex items-center justify-center rounded-full text-xs font-bold">
                    {tab.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <Input
                id="user-search"
                type="text"
                placeholder="Search users..."
                className="pl-9 h-10 border-border-subtle focus-visible:ring-ring rounded-lg bg-surface"
              />
            </div>
            <Button variant="outline" size="icon" className="h-10 w-10 border-border-subtle bg-surface rounded-lg shrink-0 hover:bg-surface-container-low" aria-label="Filter users">
              <Filter className="w-4 h-4 text-text-muted" />
            </Button>
          </div>
        </div>

        {/* Users Table */}
        <Card className="border-border-subtle shadow-elevation-card bg-surface rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-primary-container/5">
                  <TableRow className="border-b border-border-subtle hover:bg-transparent">
                    <TableHead className="text-xs font-semibold text-text-muted uppercase tracking-wider py-4 pl-6 w-[35%]">User</TableHead>
                    <TableHead className="text-xs font-semibold text-text-muted uppercase tracking-wider py-4 w-[15%]">Role</TableHead>
                    <TableHead className="text-xs font-semibold text-text-muted uppercase tracking-wider py-4 w-[20%] hidden sm:table-cell">Join Date</TableHead>
                    <TableHead className="text-xs font-semibold text-text-muted uppercase tracking-wider py-4 w-[25%] hidden md:table-cell">Activity</TableHead>
                    <TableHead className="text-xs font-semibold text-text-muted uppercase tracking-wider py-4 text-right pr-6 w-[5%]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userData.map((user) => (
                    <TableRow key={user.id} className="border-b border-border-subtle/50 hover:bg-surface-container-low/50 transition-colors duration-200">
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10 border border-border-subtle">
                            <AvatarImage src={user.image} alt={user.name} className="object-cover" />
                            <AvatarFallback className="bg-primary-container/15 text-primary-container font-medium">
                              {user.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-on-surface">{user.name}</span>
                              {user.isReported && (
                                <AlertTriangle className="w-4 h-4 text-error" aria-label="User has been reported" />
                              )}
                            </div>
                            <p className="text-sm text-text-muted">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          variant="secondary"
                          className={`font-medium border-0 px-3 py-1 rounded-full text-xs ${
                            user.role === 'Venue Owner'
                              ? 'bg-tertiary/10 text-tertiary hover:bg-tertiary/15'
                              : 'bg-primary-container/15 text-primary-container hover:bg-primary-container/20'
                          }`}
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 text-sm text-text-muted font-medium hidden sm:table-cell">
                        {user.joinDate}
                      </TableCell>
                      <TableCell className="py-4 hidden md:table-cell">
                        <div className="text-sm font-semibold text-on-surface">{user.activityMain}</div>
                        <div className={`text-xs ${user.activitySubColor || 'text-text-muted'}`}>
                          {user.activitySub}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-right pr-6">
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted hover:text-on-surface rounded-full hover:bg-surface-container-low" aria-label={`Actions for ${user.name}`}>
                           <span className="sr-only">Open menu</span>
                           <MoreVertical className="w-4 h-4" />
                         </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-border-subtle">
              <div className="text-sm text-text-muted font-medium">
                Showing 1 to 3 of 4,521 entries
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md text-text-muted hover:text-on-surface" disabled aria-label="Previous page">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="default" className="h-8 w-8 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground p-0 text-sm font-medium" aria-current="page">
                  1
                </Button>
                <Button variant="ghost" className="h-8 w-8 rounded-md text-on-surface-variant hover:bg-surface-container-low p-0 text-sm font-medium">
                  2
                </Button>
                <Button variant="ghost" className="h-8 w-8 rounded-md text-on-surface-variant hover:bg-surface-container-low p-0 text-sm font-medium">
                  3
                </Button>
                <div className="text-text-muted px-1">...</div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md text-on-surface-variant hover:bg-surface-container-low" aria-label="Next page">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
