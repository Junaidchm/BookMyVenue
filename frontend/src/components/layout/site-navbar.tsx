"use client";

import Link from "next/link";
import { Building2, Menu, X } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/venues", label: "Venues" },
  { href: "#about", label: "About" },
] as const;

export function SiteNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="fixed top-4 right-0 left-0 z-50 flex justify-center px-4">
        <nav className="flex w-full max-w-4xl items-center justify-between rounded-full border border-white/60 bg-white/80 px-4 py-2.5 shadow-xl shadow-stone-200/50 backdrop-blur-md md:px-6">
          <Link
            href="/"
            className="group flex items-center gap-2"
            onClick={() => setMobileOpen(false)}
          >
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary-container shadow-md transition-transform group-hover:scale-105">
              <Building2 className="size-4 fill-white text-white" />
            </div>
            <span className="font-display text-base font-bold text-on-surface">
              BookMy<span className="text-primary-container">Venue</span>
            </span>
          </Link>

          <ul className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-label-md text-text-muted transition-colors hover:text-on-surface"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="text-label-md text-text-muted transition-colors hover:text-on-surface"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-primary-container px-5 py-2.5 text-label-md text-white shadow-md shadow-primary-container/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              Get Started
            </Link>
          </div>

          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full text-on-surface transition-colors hover:bg-surface-container-low md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </nav>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-on-surface/20 backdrop-blur-sm transition-opacity md:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!mobileOpen}
        onClick={() => setMobileOpen(false)}
      />

      <div
        className={cn(
          "fixed top-0 right-0 z-50 flex h-full w-72 flex-col bg-surface p-6 shadow-floating transition-transform duration-300 ease-in-out md:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="mb-8 flex items-center justify-between">
          <span className="font-display text-headline-sm text-on-surface">Menu</span>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full hover:bg-surface-container-low"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          >
            <X className="size-5" />
          </button>
        </div>

        <ul className="flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block rounded-xl px-4 py-3 text-body-md text-on-surface transition-colors hover:bg-surface-container-low"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-col gap-3 pt-8">
          <Link
            href="/login"
            className="rounded-full border border-border-subtle py-3 text-center text-label-md text-on-surface transition-colors hover:bg-surface-container-low"
            onClick={() => setMobileOpen(false)}
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-primary-container py-3 text-center text-label-md text-white shadow-md shadow-primary-container/20"
            onClick={() => setMobileOpen(false)}
          >
            Get Started
          </Link>
        </div>
      </div>
    </>
  );
}
