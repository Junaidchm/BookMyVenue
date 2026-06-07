"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/venues", label: "Venues" },
  { href: "#", label: "About" },
];

export function SiteNavbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <nav className="flex h-14 w-full max-w-[var(--container-max)] items-center justify-between rounded-full border border-stone-100 bg-white/80 px-6 shadow-xl shadow-stone-200/50 backdrop-blur-md">
        <Link
          href="/"
          className="font-display text-xl font-bold text-on-surface"
        >
          BookMy<span className="text-primary-container">Venue</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/venues"
                ? pathname.startsWith("/venues")
                : pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors duration-200",
                  isActive
                    ? "text-primary-container"
                    : "text-on-surface-variant hover:text-on-surface"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <Button
            asChild
            className="hidden h-10 rounded-full bg-primary-container px-6 text-sm font-semibold text-white shadow-lg shadow-primary-container/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-secondary-container active:scale-[0.98] md:inline-flex"
          >
            <Link href="/login">Sign In</Link>
          </Button>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-9 rounded-full md:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-surface p-6">
              <div className="mt-8 flex flex-col gap-4">
                {NAV_LINKS.map((link) => {
                  const isActive =
                    link.href === "/venues"
                      ? pathname.startsWith("/venues")
                      : pathname === link.href;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "rounded-xl px-4 py-3 text-base font-medium transition-colors",
                        isActive
                          ? "bg-surface-container-low text-primary-container"
                          : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                <div className="mt-4 border-t border-border-subtle pt-4">
                  <Button
                    asChild
                    className="w-full rounded-full bg-primary-container py-3 text-sm font-semibold text-white shadow-lg shadow-primary-container/20 hover:bg-secondary-container"
                  >
                    <Link href="/login">Sign In</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
