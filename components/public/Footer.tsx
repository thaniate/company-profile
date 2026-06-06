import Link from "next/link";

const footerLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Contact", href: "#contact" },
];

const socials = [
  { label: "IG", href: "#" },
  { label: "Behance", href: "#" },
  { label: "Dribbble", href: "#" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-text-dark border-t-2 border-sangria">
      {/* Gingham strip */}
      <div className="gingham-strip" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div className="space-y-4">
            <span className="font-accent text-cream text-2xl">Studio</span>

            <p className="text-cream/40 text-[0.65rem] leading-[1.8] font-body tracking-[0.03em] max-w-xs">
              A creative studio crafting brands and digital products that leave
              a lasting impression.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <p className="text-[0.58rem] tracking-[0.2em] uppercase font-body font-bold text-sangria">
              Navigation
            </p>

            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream/50 hover:text-cream text-[0.7rem] font-body transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div className="space-y-4">
            <p className="text-[0.58rem] tracking-[0.2em] uppercase font-body font-bold text-sangria">
              Follow Us
            </p>

            <div className="flex items-center gap-4">
              {socials.map((s, i) => (
                <span key={s.label} className="flex items-center gap-4">
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cream/50 hover:text-cream text-[0.7rem] font-body font-bold transition-colors duration-200"
                    data-cursor
                  >
                    {s.label}
                  </a>

                  {i < socials.length - 1 && (
                    <span className="text-sangria/40 text-xs">·</span>
                  )}
                </span>
              ))}
            </div>

            {/* Bandung tag */}
            <div
              className="w-fit bg-sangria text-cream font-body font-bold text-[0.55rem] tracking-[0.1em] uppercase px-3 py-1.5 mt-2"
              style={{ transform: "rotate(-1deg)" }}
            >
              📍 Bandung, Indonesia
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-cream/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-cream/30 text-[0.62rem] font-body tracking-wider">
            © {year} Studio — All rights reserved
          </p>

          <Link
            href="/login"
            className="text-cream/20 hover:text-cream/50 text-[0.6rem] font-body tracking-wider transition-colors duration-300"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}