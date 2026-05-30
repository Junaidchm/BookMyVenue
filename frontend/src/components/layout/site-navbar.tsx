"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/venues", label: "Venues" },
  { href: "#", label: "About" },
];

export function SiteNavbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-surface/95 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-[var(--container-max)] items-center justify-between px-gutter">
        <Link
          href="/"
          className="font-display text-xl font-bold text-on-surface"
        >
          BookMyVenue
        </Link>

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
                  "text-sm font-medium transition-colors",
                  isActive
                    ? "border-b-2 border-brand-muted pb-0.5 text-brand-muted"
                    : "text-on-surface-variant hover:text-brand-muted"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <Button
          asChild
          className="h-10 rounded-full bg-brand-muted px-6 text-sm font-semibold text-on-brand hover:bg-brand-muted/90"
        >
          <Link href="/login">Sign In</Link>
        </Button>
      </nav>
    </header>
  );
}
