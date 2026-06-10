"use client";

import React from "react";
import { Search, Bell, Settings, Filter, Download, Users, CheckSquare, TrendingUp, ArrowUpRight, ArrowUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Top Bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            type="text" 
            placeholder="Search venues, users, or reports..." 
            className="pl-10 bg-gray-50/50 border-gray-200 focus-visible:ring-orange-500 rounded-full h-10"
          />
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-orange-500 rounded-full border border-white"></span>
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">Platform Overview</h1>
          <p className="text-gray-500 text-sm">Sunday, May 31, 2026</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2 bg-white h-10 border-gray-200">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
          <Button variant="outline" className="flex items-center gap-2 bg-white h-10 border-gray-200">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Revenue */}
        <Card className="border-gray-100 shadow-sm bg-white overflow-hidden relative">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-gray-500">Total Revenue</span>
              <Badge variant="secondary" className="bg-green-50 text-green-600 hover:bg-green-100 border-none px-2 py-0.5 flex gap-1 items-center font-medium">
                <ArrowUpRight className="w-3 h-3" />
                +12.5%
              </Badge>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-6">$124,500</div>
            
            {/* Fake sparkline with SVG */}
            <div className="absolute bottom-0 left-0 w-full h-24 pointer-events-none opacity-20">
              <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full text-orange-500 fill-current">
                <path d="M0,30 L0,20 C10,15 20,25 30,22 C40,18 50,10 60,15 C70,20 80,5 90,10 L100,15 L100,30 Z"></path>
              </svg>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-24 pointer-events-none">
              <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full text-orange-500 stroke-current" fill="none" strokeWidth="1">
                <path d="M0,20 C10,15 20,25 30,22 C40,18 50,10 60,15 C70,20 80,5 90,10 L100,15"></path>
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Active Users */}
        <Card className="border-gray-100 shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                <Users className="w-5 h-5" />
              </div>
              <Badge variant="secondary" className="bg-green-50 text-green-600 hover:bg-green-100 border-none px-2 py-0.5 flex gap-1 items-center font-medium">
                <ArrowUp className="w-3 h-3" />
                +4%
              </Badge>
            </div>
            <div className="text-sm font-medium text-gray-500 mb-1">Active Users</div>
            <div className="text-2xl font-bold text-gray-900">8,249</div>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card className="border-gray-100 shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center text-yellow-600 border border-yellow-100">
                <CheckSquare className="w-5 h-5" />
              </div>
            </div>
            <div className="text-sm font-medium text-gray-500 mb-1">Pending Approvals</div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold text-gray-900">24</div>
              <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">Requires attention</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Middle Row: Charts & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Platform Activity Chart */}
        <Card className="lg:col-span-2 border-gray-100 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b-0">
            <CardTitle className="text-xl font-bold text-gray-900">Platform Activity</CardTitle>
            <Button variant="outline" size="sm" className="h-8 text-xs font-medium text-gray-600 border-gray-200 bg-white">
              Last 30 Days
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 12 }} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#0ea5e9" 
                    strokeWidth={3} 
                    dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#0ea5e9' }} 
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#0ea5e9' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Venues List */}
        <Card className="border-gray-100 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b-0">
            <CardTitle className="text-xl font-bold text-gray-900">Top Venues</CardTitle>
            <Button variant="ghost" size="sm" className="h-8 text-xs font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-50 px-2 flex items-center gap-1">
              View All <ArrowUpRight className="w-3 h-3" />
            </Button>
          </CardHeader>
          <CardContent className="mt-4 flex flex-col gap-6">
            {topVenues.map((venue) => (
              <div key={venue.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 rounded-lg border border-gray-100">
                    <AvatarImage src={venue.image} alt={venue.name} className="object-cover" />
                    <AvatarFallback className="rounded-lg bg-gray-100 text-gray-500">VN</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">{venue.name}</h4>
                    <p className="text-xs text-gray-500">{venue.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">{venue.revenue}</div>
                  <div className="text-xs font-medium text-green-600">{venue.bookings}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Venue Approvals Table */}
      <Card className="border-gray-100 shadow-sm bg-white">
        <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 pb-4">
          <CardTitle className="text-xl font-bold text-gray-900">Recent Venue Approvals</CardTitle>
          <Button variant="secondary" size="sm" className="h-8 text-xs font-medium bg-orange-100 text-orange-700 hover:bg-orange-200">
            View Queue
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-transparent">
              <TableRow className="border-b border-gray-100 hover:bg-transparent">
                <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider py-4 pl-6">Venue Name</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider py-4">Owner</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider py-4">Category</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider py-4">Date Submitted</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider py-4">Status</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider py-4 text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentApprovals.map((approval) => (
                <TableRow key={approval.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 rounded-lg border border-gray-100">
                        <AvatarImage src={approval.image} alt={approval.name} className="object-cover" />
                        <AvatarFallback className="rounded-lg bg-gray-100">VN</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-gray-900">{approval.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-sm text-gray-600">{approval.owner}</TableCell>
                  <TableCell className="py-4 text-sm text-gray-600">{approval.category}</TableCell>
                  <TableCell className="py-4 text-sm text-gray-600">{approval.date}</TableCell>
                  <TableCell className="py-4">
                    <Badge 
                      variant="outline" 
                      className={`font-medium border-0 px-2.5 py-0.5 ${
                        approval.status === 'Approved' ? 'bg-green-50 text-green-700' :
                        approval.status === 'Pending' ? 'bg-yellow-50 text-yellow-700' :
                        'bg-red-50 text-red-700'
                      }`}
                    >
                      {approval.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 text-right pr-6">
                     <Button variant="ghost" size="sm" className="h-8 text-gray-400 hover:text-gray-900">
                       <span className="sr-only">Open menu</span>
                       ...
                     </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
