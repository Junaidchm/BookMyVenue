import { UserNav } from "@/components/user/user-nav";
import Link from "next/link";

export function UserSidebar() {
  return (
    <aside className="fixed top-0 left-0 hidden h-screen w-64 flex-col border-r border-[color:var(--outline-variant)]/30 bg-surface-container-lowest md:flex">
      <div className="p-6">
        <Link
          href="/user"
          className="font-display text-headline-sm tracking-tight text-brand-muted"
        >
          BookMyVenue
        </Link>
      </div>
      <UserNav className="flex-1 px-4 pb-6" />
    </aside>
  );
}
