import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Sparkles,
  Info,
  Briefcase,
  FolderOpen,
  MessageSquare,
  Inbox,
  ArrowRight,
} from "lucide-react";

async function getStats() {
  const supabase = await createClient();

  const [services, portfolio, testimonials, contacts, unread] =
    await Promise.all([
      supabase.from("services").select("id", { count: "exact" }),
      supabase.from("portfolio_items").select("id", { count: "exact" }),
      supabase.from("testimonials").select("id", { count: "exact" }),
      supabase.from("contact_submissions").select("id", { count: "exact" }),
      supabase
        .from("contact_submissions")
        .select("id", { count: "exact" })
        .eq("is_read", false),
    ]);

  return {
    services: services.count ?? 0,
    portfolio: portfolio.count ?? 0,
    testimonials: testimonials.count ?? 0,
    contacts: contacts.count ?? 0,
    unread: unread.count ?? 0,
  };
}

const sections = [
  {
    label: "Hero",
    description: "Edit headline, subheadline, and CTA button",
    href: "/dashboard/hero",
    icon: Sparkles,
    stat: null,
    statLabel: null,
  },
  {
    label: "About",
    description: "Update your studio story and image",
    href: "/dashboard/about",
    icon: Info,
    stat: null,
    statLabel: null,
  },
  {
    label: "Services",
    description: "Manage the services you offer",
    href: "/dashboard/services",
    icon: Briefcase,
    stat: "services",
    statLabel: "services",
  },
  {
    label: "Portfolio",
    description: "Showcase your best work",
    href: "/dashboard/portfolio",
    icon: FolderOpen,
    stat: "portfolio",
    statLabel: "projects",
  },
  {
    label: "Testimonials",
    description: "Display client feedback",
    href: "/dashboard/testimonials",
    icon: MessageSquare,
    stat: "testimonials",
    statLabel: "reviews",
  },
  {
    label: "Contacts",
    description: "View incoming messages",
    href: "/dashboard/contacts",
    icon: Inbox,
    stat: "contacts",
    statLabel: "messages",
  },
];

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div className="p-6 md:p-10 max-w-5xl">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="gold-line" />
          <span className="text-gold text-xs tracking-[0.3em] uppercase font-mono">
            CMS Dashboard
          </span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl text-cream">
          Welcome back
        </h1>
        <p className="text-muted text-sm mt-2 font-mono">
          Manage your company profile content from here.
        </p>
      </div>

      {/* Unread badge */}
      {stats.unread > 0 && (
        <Link
          href="/dashboard/contacts"
          className="inline-flex items-center gap-3 bg-gold/10 border border-gold/30 text-gold px-4 py-3 text-sm font-mono tracking-wide mb-8 hover:bg-gold/20 transition-colors group"
        >
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          You have {stats.unread} unread message
          {stats.unread > 1 ? "s" : ""}
          <ArrowRight
            size={14}
            className="ml-auto group-hover:translate-x-0.5 transition-transform"
          />
        </Link>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
        {sections.map(({ label, description, href, icon: Icon, stat, statLabel }) => {
          const count = stat ? stats[stat as keyof typeof stats] : null;

          return (
            <Link
              key={href}
              href={href}
              className="group bg-background hover:bg-surface p-6 transition-colors duration-200 flex flex-col gap-4"
            >
              {/* Icon + count */}
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 border border-border group-hover:border-gold flex items-center justify-center text-muted group-hover:text-gold transition-all duration-300">
                  <Icon size={15} />
                </div>
                {count !== null && (
                  <span className="font-mono text-xs text-muted/50 bg-surface border border-border px-2 py-0.5">
                    {count} {statLabel}
                  </span>
                )}
              </div>

              {/* Text */}
              <div>
                <h2 className="font-display text-xl text-cream group-hover:text-gold transition-colors duration-200">
                  {label}
                </h2>
                <p className="text-muted text-xs mt-1 leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Arrow */}
              <div className="flex items-center gap-2 text-muted/0 group-hover:text-gold transition-all duration-300 mt-auto">
                <span className="text-xs tracking-widest uppercase font-mono">
                  Edit
                </span>
                <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
