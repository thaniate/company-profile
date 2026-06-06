import Link from "next/link";

const footerLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Contact", href: "#contact" },
];

const socials = [
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Dribbble", href: "#" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-5 h-5 border border-gold rotate-45 inline-block" />
              <span className="font-display text-lg tracking-widest text-cream uppercase">
                Studio
              </span>
            </div>
            <p className="text-muted text-sm leading-relaxed max-w-xs">
              A creative studio crafting brands and digital products that leave
              a lasting impression.
            </p>
          </div>

          {/* Nav */}
          <div className="space-y-4">
            <p className="text-xs tracking-widest uppercase text-gold font-mono">
              Navigation
            </p>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted hover:text-cream text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div className="space-y-4">
            <p className="text-xs tracking-widest uppercase text-gold font-mono">
              Follow Us
            </p>
            <ul className="space-y-2">
              {socials.map((s) => (
                <li key={s.label}>
                  
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-cream text-sm transition-colors duration-200 inline-flex items-center gap-2 group"
                  >
                    {s.label}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted text-xs font-mono tracking-wider">
            © {year} Studio. All rights reserved.
          </p>
          <Link
            href="/login"
            className="text-muted/40 hover:text-muted text-xs font-mono tracking-wider transition-colors duration-300"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
