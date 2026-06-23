import { UserNav } from "@/components/user/user-profile-nav";
import Link from "next/link";

export function UserSidebar() {
  return (
    <aside className="fixed top-0 left-0 hidden h-screen w-64 flex-col border-r border-border-subtle bg-surface md:flex">
      <div className="p-6">
        <Link
          href="/user"
          className="text-xl font-bold"
        >
          <span className="text-on-surface">BookMy</span>
          <span className="text-primary-container">Venue</span>
        </Link>
      </div>
      <UserNav className="flex-1 px-4 pb-6" />
    </aside>
  );
}
