"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  BarChart2,
  Users,
  MapPin,
  HelpCircle,
  LogOut,
  FileText,
} from "lucide-react";
import React from "react";
import { useAuth } from "@/components/auth/session-provider";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Approvals", href: "/admin/approvals", icon: CheckSquare },
  { label: "Reports", href: "/admin/reports", icon: BarChart2 },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Venues", href: "/admin/venues", icon: MapPin },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();

  return (
    <div className="flex min-h-screen bg-[#FDF8F4]">
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between py-6 px-4 fixed h-full">
        <div>
          {/* Logo */}
          <div className="mb-6 px-2">
            <h1 className="text-xl font-bold">
              <span className="text-gray-900">BookMy</span>
              <span className="text-orange-500">Venue</span>
              </h1>
          </div>

          {/* Admin Profile */}
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 rounded-full bg-orange-200 overflow-hidden">
              <img
                src="https://i.pravatar.cc/40?img=3"
                alt="Admin"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900">Admin Console</p>
              <p className="text-xs text-gray-500">Marketplace Control</p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-orange-100 text-orange-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => alert("Report generation coming soon!")}
            className="w-full bg-orange-700 hover:bg-orange-800 text-white text-sm font-medium py-2.5 px-4 rounded-lg flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Generate Report
          </button>

          <hr className="border-black-200 my-1" />

          <Link
            href="mailto:support@bookmyvenue.com"
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            <HelpCircle className="w-4 h-4" />
            Help Center
          </Link>

          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg w-full"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">{children}</main>
    </div>
  );
}