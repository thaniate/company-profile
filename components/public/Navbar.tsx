"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import clsx from "clsx";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <>
      <header
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "py-4 bg-background/90 backdrop-blur-md border-b border-border"
            : "py-7"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <span className="w-6 h-6 border border-gold rotate-45 group-hover:rotate-90 transition-transform duration-500" />
            <span className="font-display text-xl tracking-widest text-cream uppercase">
              Studio
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-muted hover:text-cream text-sm tracking-wider uppercase font-body transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </nav>

          {/* CTA */}
          <Link
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("#contact");
            }}
            className="hidden md:inline-flex items-center gap-2 border border-gold text-gold hover:bg-gold hover:text-background px-5 py-2 text-sm tracking-wider uppercase transition-all duration-300"
          >
            Let&apos;s Talk
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-cream p-1"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={clsx(
          "fixed inset-0 z-40 bg-background flex flex-col justify-center px-8 transition-all duration-500 md:hidden",
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <nav className="flex flex-col gap-8">
          {navLinks.map((link, i) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="text-left font-display text-5xl text-cream/80 hover:text-gold transition-colors duration-200"
              style={{ transitionDelay: menuOpen ? `${i * 60}ms` : "0ms" }}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="mt-12 pt-8 border-t border-border">
          <button
            onClick={() => handleNavClick("#contact")}
            className="font-body text-sm text-muted tracking-widest uppercase hover:text-gold transition-colors"
          >
            Let&apos;s Talk →
          </button>
        </div>
      </div>
    </>
  );
}
