'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Sparkles,
  Briefcase,
  FolderOpen,
  MessageSquare,
  Mail,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Hero', href: '/dashboard/hero', icon: Sparkles },
  { label: 'Services', href: '/dashboard/services', icon: Briefcase },
  { label: 'Portfolio', href: '/dashboard/portfolio', icon: FolderOpen },
  { label: 'Testimonials', href: '/dashboard/testimonials', icon: MessageSquare },
  { label: 'Contacts', href: '/dashboard/contacts', icon: Mail },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavLinks = () => (
    <nav className="flex flex-col gap-1 mt-6">
      {navItems.map(({ label, href, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition
              ${isActive
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
          >
            <Icon size={17} />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 min-h-screen bg-gray-900 border-r border-gray-800 px-4 py-6 shrink-0">
        <div className="px-2 mb-2">
          <h2 className="text-white font-bold text-lg tracking-tight">CMS Panel</h2>
          <p className="text-gray-500 text-xs mt-0.5">Company Profile</p>
        </div>
        <NavLinks />
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <h2 className="text-white font-bold text-base">CMS Panel</h2>
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="text-gray-400 hover:text-white transition"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/60" onClick={() => setMobileOpen(false)}>
          <aside
            className="w-64 min-h-screen bg-gray-900 border-r border-gray-800 px-4 py-6 pt-20"
            onClick={(e) => e.stopPropagation()}
          >
            <NavLinks />
          </aside>
        </div>
      )}
    </>
  );
}
