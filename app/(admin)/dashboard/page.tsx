import {
  Sparkles,
  Briefcase,
  FolderOpen,
  MessageSquare,
  Mail,
} from 'lucide-react';
import Link from 'next/link';

const cards = [
  { label: 'Hero Section', href: '/dashboard/hero', icon: Sparkles, desc: 'Edit headline, subtext, and CTA' },
  { label: 'Services', href: '/dashboard/services', icon: Briefcase, desc: 'Manage service offerings' },
  { label: 'Portfolio', href: '/dashboard/portfolio', icon: FolderOpen, desc: 'Add or update portfolio items' },
  { label: 'Testimonials', href: '/dashboard/testimonials', icon: MessageSquare, desc: 'Manage client testimonials' },
  { label: 'Contacts', href: '/dashboard/contacts', icon: Mail, desc: 'View contact submissions' },
];

export default function DashboardPage() {
  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your company profile content</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(({ label, href, icon: Icon, desc }) => (
          <Link
            key={href}
            href={href}
            className="group bg-gray-900 border border-gray-800 hover:border-indigo-500/50 rounded-2xl p-6 transition"
          >
            <div className="w-10 h-10 bg-indigo-600/10 group-hover:bg-indigo-600/20 rounded-xl flex items-center justify-center mb-4 transition">
              <Icon size={20} className="text-indigo-400" />
            </div>
            <h3 className="text-white font-semibold text-sm mb-1">{label}</h3>
            <p className="text-gray-500 text-xs">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
