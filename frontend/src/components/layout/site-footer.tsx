import Link from "next/link";

const SOCIAL_LINKS = [
  {
    href: "#",
    label: "Instagram",
    icon: (
      <svg
        className="size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    href: "#",
    label: "X (Twitter)",
    icon: (
      <svg
        className="size-4"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    href: "#",
    label: "Facebook",
    icon: (
      <svg
        className="size-4"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 1.09.044 1.543.11v3.248c-.168-.018-.458-.027-.824-.027-1.17 0-1.623.443-1.623 1.596v2.631h4.266l-.731 3.667h-3.535v8.13A10.95 10.95 0 0 0 23 12c0-6.075-4.925-11-11-11S1 5.925 1 12c0 5.159 3.553 9.49 8.101 10.691" />
      </svg>
    ),
  },
];

const LEGAL_LINKS = [
  { href: "#", label: "Privacy Policy" },
  { href: "#", label: "Terms of Service" },
  { href: "#", label: "Cookie Policy" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border-subtle bg-surface">
      <div className="mx-auto flex max-w-[var(--container-max)] flex-col gap-8 px-gutter py-12">
        {/* Top row */}
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <Link
            href="/"
            className="font-display text-xl font-bold text-on-surface"
          >
            BookMy<span className="text-primary-container">Venue</span>
          </Link>

          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="flex size-10 items-center justify-center rounded-full border border-border-subtle text-text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-container hover:text-primary-container"
              >
                {social.icon}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border-subtle pt-8 md:flex-row">
          <p className="text-label-sm text-text-muted">
            &copy; {new Date().getFullYear()} BookMyVenue. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-6">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-label-sm text-text-muted transition-colors hover:text-on-surface"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
