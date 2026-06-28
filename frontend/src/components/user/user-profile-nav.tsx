"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Heart,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Settings,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/session-provider";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  USER_NAV,
  USER_NAV_BOTTOM,
} from "@/lib/user/data";

const ICONS: Record<string, LucideIcon> = {
  "layout-dashboard": LayoutDashboard,
  calendar: Calendar,
  heart: Heart,
  "message-circle": MessageCircle,
  settings: Settings,
  "help-circle": HelpCircle,
  "log-out": LogOut,
};

type UserNavProps = {
  onNavigate?: () => void;
  className?: string;
};

const DEFAULT_USER_PROFILE = {
  name: "Alex Rivera",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
};

export function UserNav({ onNavigate, className }: UserNavProps) {
  const pathname = usePathname();
  const { signOut } = useAuth();

  const [profile, setProfile] = useState(DEFAULT_USER_PROFILE);

  useEffect(() => {
    const handleProfileSync = () => {
      if (typeof window !== "undefined") {
        const localData = localStorage.getItem("user_profile_data");
        if (localData) {
          try {
            const parsed = JSON.parse(localData);
            if (parsed.name && parsed.avatar) {
              setProfile({
                name: parsed.name,
                avatar: parsed.avatar,
              });
            }
          } catch (e) {
            console.error("Failed to parse user profile data:", e);
          }
        }
      }
    };

    handleProfileSync();

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleProfileSync);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", handleProfileSync);
      }
    };
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/user") return pathname === "/user";
    return pathname.startsWith(href);
  };

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <Link href="/user/profile" className="mb-8 flex items-center gap-3 rounded-2xl bg-surface-container p-4 hover:bg-surface-container-high transition-all cursor-pointer">
        <Avatar className="size-10 border border-border-subtle">
          <AvatarImage src={profile.avatar} alt={profile.name} />
          <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-label-sm text-text-muted">
            Welcome back,
          </span>
          <span className="font-display text-label-lg font-bold text-on-surface">
            {profile.name}
          </span>
        </div>
      </Link>

      <nav className="flex flex-1 flex-col gap-2">
        {USER_NAV.map((item) => {
          const Icon = ICONS[item.icon];
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-label-md transition-all",
                active
                  ? "bg-primary-container/15 font-bold text-primary-container"
                  : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
              )}
            >
              <Icon className="size-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-2 border-t border-border-subtle pt-4 pb-2">
        {USER_NAV_BOTTOM.map((item) => {
          const Icon = ICONS[item.icon];
          if (item.label === "Log Out") {
            return (
              <button
                key={item.href}
                onClick={() => {
                  if (onNavigate) onNavigate();
                  signOut();
                }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-2 text-left text-label-md text-on-surface-variant transition-all hover:bg-surface-container-low hover:text-on-surface"
              >
                <Icon className="size-5 shrink-0" />
                {item.label}
              </button>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-xl px-4 py-2 text-label-md text-on-surface-variant transition-all hover:bg-surface-container-low hover:text-on-surface"
            >
              <Icon className="size-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
