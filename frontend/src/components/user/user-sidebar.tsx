import { UserNav } from "@/components/user/user-nav";

export function UserSidebar() {
  return (
    <aside className="fixed top-20 left-0 hidden h-[calc(100vh-5rem)] w-64 flex-col gap-stack-sm border-r border-[color:var(--outline-variant)]/30 bg-surface-container-low p-stack-md md:flex">
      <UserNav />
    </aside>
  );
}
