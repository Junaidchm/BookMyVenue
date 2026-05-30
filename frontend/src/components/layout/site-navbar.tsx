import { Heart, UserCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS: { href: string; label: string; active?: boolean }[] = [
  { href: "/venues", label: "Explore", active: true },
  { href: "/owner", label: "Host" },
  { href: "#", label: "Experiences" },
];

export function SiteNavbar() {
  return (
    <nav className="fixed top-4 right-0 left-0 z-50 mx-auto flex w-[90%] max-w-7xl scale-95 items-center justify-between rounded-full border border-stone-100 bg-surface/80 px-8 py-3 shadow-elevation-floating backdrop-blur-md">
      <Link
        href="/"
        className="font-display text-headline-sm font-bold text-on-surface"
      >
        BookMy<span className="text-brand-muted">Venue</span>
      </Link>

      <div className="hidden gap-8 md:flex">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "text-body-md transition-transform duration-200 hover:-translate-y-0.5",
              link.active
                ? "border-b-2 border-brand-muted font-bold text-brand-muted"
                : "text-on-surface-variant hover:text-brand-muted"
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-brand-muted hover:-translate-y-0.5 hover:text-brand-muted"
          aria-label="Favorites"
        >
          <Heart className="size-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-brand-muted hover:-translate-y-0.5 hover:text-brand-muted"
          aria-label="Account"
          asChild
        >
          <Link href="/login">
            <UserCircle className="size-5" />
          </Link>
        </Button>
      </div>
    </nav>
  );
}
