"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import clsx from "clsx";
import {
  LayoutDashboard,
  Sparkles,
  Info,
  Briefcase,
  FolderOpen,
  MessageSquare,
  Inbox,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Hero", href: "/dashboard/hero", icon: Sparkles },
  { label: "About", href: "/dashboard/about", icon: Info },
  { label: "Services", href: "/dashboard/services", icon: Briefcase },
  { label: "Portfolio", href: "/dashboard/portfolio", icon: FolderOpen },
  { label: "Testimonials", href: "/dashboard/testimonials", icon: MessageSquare },
  { label: "Contacts", href: "/dashboard/contacts", icon: Inbox },
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
      <div className="px-6 py-7 border-b border-border flex items-center gap-3">
        <span className="w-5 h-5 border border-gold rotate-45 flex-shrink-0" />
        <span className="font-display text-base tracking-widest text-cream uppercase">
          Studio
        </span>
        <span className="ml-auto text-muted/30 text-xs font-mono">CMS</span>
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
                "flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-200 group rounded-sm",
                active
                  ? "bg-gold/10 text-gold border-l-2 border-gold pl-[10px]"
                  : "text-muted hover:text-cream hover:bg-surface border-l-2 border-transparent"
              )}
            >
              <Icon size={15} className="flex-shrink-0" />
              <span className="tracking-wide">{label}</span>
              {active && (
                <ChevronRight size={12} className="ml-auto text-gold/60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-5 border-t border-border">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted hover:text-red-400 transition-colors duration-200 w-full group"
        >
          <LogOut size={15} />
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
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur border-b border-border px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-4 h-4 border border-gold rotate-45" />
          <span className="font-display text-sm tracking-widest text-cream uppercase">
            Studio CMS
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-muted hover:text-cream p-1"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-background/80 backdrop-blur-sm">
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
