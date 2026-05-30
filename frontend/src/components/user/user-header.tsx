"use client";

import { Bell, Heart, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { UserNav } from "@/components/user/user-nav";
import { USER_PROFILE } from "@/lib/user/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

export function UserHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 right-0 left-0 z-50 mx-auto flex h-20 max-w-[var(--container-max)] items-center justify-between border-b border-[color:var(--outline-variant)]/30 bg-surface/80 px-margin-mobile shadow-sm backdrop-blur-md md:px-margin-desktop">
      <div className="flex items-center gap-4">
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 border-r-0 bg-surface-container-low p-0">
            <SheetTitle className="sr-only">User navigation</SheetTitle>
            <UserNav onNavigate={() => setMenuOpen(false)} className="p-4" />
          </SheetContent>
        </Sheet>
        <Link
          href="/user"
          className="font-display text-headline-md tracking-tight text-brand-muted"
        >
          BookMyVenue
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-on-surface-variant hover:text-brand-muted"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-on-surface-variant hover:text-brand-muted"
          aria-label="Favorites"
        >
          <Heart className="size-5" />
        </Button>
        <Separator
          orientation="vertical"
          className="ml-2 hidden h-6 bg-[color:var(--outline-variant)]/30 sm:block"
        />
        <div className="hidden items-center gap-3 sm:flex">
          <span className="text-label-md text-on-surface">
            {USER_PROFILE.name}
          </span>
          <Avatar className="size-8 border border-[color:var(--outline-variant)]">
            <AvatarImage src={USER_PROFILE.avatar} alt={USER_PROFILE.name} />
            <AvatarFallback>J</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
