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
    activitySubColor: "text-red-600",
    image: "https://i.pravatar.cc/150?u=david",
    isReported: true,
  }
];

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-8 pb-8 max-w-6xl">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">User Management</h1>
        <p className="text-gray-500 text-base">Monitor, manage, and assist BookMyVenue users.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* New Signups */}
        <Card className="border-gray-100 shadow-sm bg-white overflow-hidden rounded-xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-semibold text-gray-500 tracking-wider uppercase">New Signups (24H)</span>
              <UserPlus className="w-5 h-5 text-orange-500" />
            </div>
            <div className="flex items-baseline gap-3">
              <div className="text-4xl font-bold text-gray-900">142</div>
              <Badge variant="secondary" className="bg-green-50 text-green-600 hover:bg-green-100 border-none px-2 py-0.5 flex gap-1 items-center font-medium rounded text-xs">
                <TrendingUp className="w-3 h-3" />
                12%
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Active Sessions */}
        <Card className="border-gray-100 shadow-sm bg-white overflow-hidden rounded-xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Active Sessions</span>
              <Monitor className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex items-baseline gap-3">
              <div className="text-4xl font-bold text-gray-900">1,894</div>
              <span className="text-sm text-gray-500 font-medium">Currently online</span>
            </div>
          </CardContent>
        </Card>

        {/* Reported Users */}
        <Card className="border-gray-100 shadow-sm bg-white overflow-hidden rounded-xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Reported Users</span>
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex items-baseline gap-3">
              <div className="text-4xl font-bold text-gray-900">8</div>
              <Badge variant="secondary" className="bg-yellow-50 text-yellow-800 hover:bg-yellow-100 border-none px-2 py-0.5 rounded text-xs font-medium">
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
            <Button className="bg-[#B95D1A] hover:bg-[#A44201] text-white rounded-md px-5 py-2 h-10 text-sm font-medium">
              All Users
            </Button>
            <Button variant="ghost" className="text-gray-700 hover:bg-gray-100 rounded-md px-5 py-2 h-10 text-sm font-medium">
              Venue Bookers
            </Button>
            <Button variant="ghost" className="text-gray-700 hover:bg-gray-100 rounded-md px-5 py-2 h-10 text-sm font-medium">
              Venue Owners
            </Button>
            <Button variant="ghost" className="text-gray-700 hover:bg-gray-100 rounded-md px-5 py-2 h-10 text-sm font-medium flex items-center gap-2">
              Flagged 
              <Badge className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 px-1.5 min-w-[20px] h-5 flex items-center justify-center rounded-full text-xs font-bold">
                8
              </Badge>
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                type="text" 
                placeholder="Search users..." 
                className="pl-9 h-10 border-gray-200 focus-visible:ring-orange-500 rounded-lg bg-white"
              />
            </div>
            <Button variant="outline" size="icon" className="h-10 w-10 border-gray-200 bg-white rounded-lg shrink-0">
              <Filter className="w-4 h-4 text-gray-500" />
            </Button>
          </div>
        </div>

        {/* Users Table */}
        <Card className="border-gray-200 shadow-sm bg-white rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-orange-50/50">
                <TableRow className="border-b border-gray-200 hover:bg-transparent">
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 pl-6 w-[35%]">User</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 w-[15%]">Role</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 w-[20%]">Join Date</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 w-[25%]">Activity</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 text-right pr-6 w-[5%]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userData.map((user) => (
                  <TableRow key={user.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 border border-gray-100">
                          <AvatarImage src={user.image} alt={user.name} className="object-cover" />
                          <AvatarFallback className="bg-orange-100 text-orange-700 font-medium">
                            {user.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">{user.name}</span>
                            {user.isReported && (
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge 
                        variant="secondary" 
                        className={`font-medium border-0 px-3 py-1 rounded-full text-xs ${
                          user.role === 'Venue Owner' 
                            ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' 
                            : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                        }`}
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 text-sm text-gray-500 font-medium">
                      {user.joinDate}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-sm font-semibold text-gray-900">{user.activityMain}</div>
                      <div className={`text-xs ${user.activitySubColor || 'text-gray-500'}`}>
                        {user.activitySub}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-right pr-6">
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900 rounded-full">
                         <span className="sr-only">Open menu</span>
                         <MoreVertical className="w-4 h-4" />
                       </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {/* Pagination Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <div className="text-sm text-gray-500 font-medium">
                Showing 1 to 3 of 4,521 entries
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md text-gray-400 hover:text-gray-900" disabled>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="default" className="h-8 w-8 rounded-md bg-orange-600 hover:bg-orange-700 text-white p-0 text-sm font-medium">
                  1
                </Button>
                <Button variant="ghost" className="h-8 w-8 rounded-md text-gray-600 hover:bg-gray-100 p-0 text-sm font-medium">
                  2
                </Button>
                <Button variant="ghost" className="h-8 w-8 rounded-md text-gray-600 hover:bg-gray-100 p-0 text-sm font-medium">
                  3
                </Button>
                <div className="text-gray-400 px-1">...</div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md text-gray-600 hover:bg-gray-100">
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
