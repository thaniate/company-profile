"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import clsx from "clsx";
import {
  LayoutDashboard, Sparkles, Info, Briefcase,
  FolderOpen, MessageSquare, Inbox, LogOut,
  Menu, X, ChevronRight, Settings2,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Hero", href: "/dashboard/hero", icon: Sparkles },
  { label: "About", href: "/dashboard/about", icon: Info },
  { label: "Services", href: "/dashboard/services", icon: Briefcase },
  { label: "Portfolio", href: "/dashboard/portfolio", icon: FolderOpen },
  { label: "Testimonials", href: "/dashboard/testimonials", icon: MessageSquare },
  { label: "Contacts", href: "/dashboard/contacts", icon: Inbox },
  { label: "Settings", href: "/dashboard/settings", icon: Settings2 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Signed out.");
    router.push("/login");
    router.refresh();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b-2 border-sangria/20 flex items-center gap-3">
        <span className="font-accent text-sangria text-lg">Studio</span>
        <span className="ml-auto text-sangria/30 text-[0.55rem] font-body font-bold tracking-[0.15em] uppercase">CMS</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 text-[0.72rem] font-body font-bold tracking-wide transition-all duration-200 border-l-2",
                active
                  ? "bg-sangria/10 text-sangria border-sangria"
                  : "text-sangria-dark/60 hover:text-sangria hover:bg-sangria/5 border-transparent"
              )}
            >
              <Icon size={14} className="flex-shrink-0" />
              <span>{label}</span>
              {active && <ChevronRight size={11} className="ml-auto text-sangria/50" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-5 border-t-2 border-sangria/10">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-3 px-3 py-2.5 text-[0.72rem] font-body font-bold tracking-wide text-sangria-dark/50 hover:text-sangria-light transition-colors duration-200 w-full"
        >
          <LogOut size={14} />
          <span>{loggingOut ? "Signing out..." : "Sign Out"}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="admin-sidebar hidden lg:flex flex-col w-56 min-h-screen fixed left-0 top-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-cream/95 backdrop-blur border-b-2 border-sangria/20 px-5 py-4 flex items-center justify-between">
        <span className="font-accent text-sangria text-base">Studio CMS</span>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-sangria p-1"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-cream/90 backdrop-blur-sm">
          <div className="admin-sidebar w-64 h-full">
            <div className="pt-16">
              <SidebarContent />
            </div>
          </div>
        </div>
      )}
    </>
  );
}