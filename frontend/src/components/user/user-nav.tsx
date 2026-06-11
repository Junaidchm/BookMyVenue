"use client";

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

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  USER_NAV,
  USER_NAV_BOTTOM,
  USER_PROFILE,
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

export function UserNav({ onNavigate, className }: UserNavProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/user") return pathname === "/user";
    return pathname.startsWith(href);
  };

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="mb-8 flex items-center gap-3 rounded-2xl bg-[#FDF7F3] p-4">
        <Avatar className="size-10 border border-[color:var(--outline-variant)]">
          <AvatarImage src={USER_PROFILE.avatar} alt={USER_PROFILE.name} />
          <AvatarFallback>{USER_PROFILE.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-label-sm text-on-surface-variant">
            Welcome back,
          </span>
          <span className="font-display text-label-lg font-bold text-on-surface">
            {USER_PROFILE.name}
          </span>
        </div>
      </div>

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
                  ? "bg-primary font-bold text-on-primary"
                  : "text-on-surface-variant hover:bg-surface-variant"
              )}
            >
              <Icon className="size-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-2 border-t border-[color:var(--outline-variant)]/30 pt-4 pb-2">
        {USER_NAV_BOTTOM.map((item) => {
          const Icon = ICONS[item.icon];
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-xl px-4 py-2 text-label-md text-on-surface-variant transition-all hover:bg-surface-variant"
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
