"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
            ? "py-3 bg-cream/95 backdrop-blur-md border-b border-sangria/20"
            : "py-5 bg-transparent"
        )}
        style={{ mixBlendMode: scrolled ? "normal" : "multiply" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-accent text-sangria text-xl tracking-wide">
            Studio
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="relative text-sangria font-body text-[0.68rem] font-bold tracking-[0.15em] uppercase group"
                data-cursor
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-sangria group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </nav>

          {/* CTA */}
          <button
            onClick={() => handleNavClick("#contact")}
            className="hidden md:inline-flex items-center gap-2 bg-sangria text-cream text-[0.65rem] font-bold tracking-[0.18em] uppercase px-5 py-2.5 hover:bg-sangria-dark transition-colors duration-200"
            data-cursor
          >
            Let&apos;s Talk
            <span>→</span>
          </button>

          {/* Mobile burger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-1"
            aria-label="Toggle menu"
            data-cursor
          >
            <span className={clsx("w-6 h-[1.5px] bg-sangria transition-all duration-300", menuOpen && "rotate-45 translate-y-[6px]")} />
            <span className={clsx("w-6 h-[1.5px] bg-sangria transition-all duration-300", menuOpen && "opacity-0")} />
            <span className={clsx("w-6 h-[1.5px] bg-sangria transition-all duration-300", menuOpen && "-rotate-45 -translate-y-[6px]")} />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={clsx(
          "fixed inset-0 z-40 bg-cream flex flex-col justify-center px-10 transition-all duration-500 md:hidden",
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Checker accent top */}
        <div className="absolute top-0 left-0 right-0 h-2 checker" />

        <nav className="flex flex-col gap-6">
          {navLinks.map((link, i) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="text-left font-display text-5xl font-black text-sangria hover:text-cornflower-dark transition-colors duration-200 italic"
              style={{ transitionDelay: menuOpen ? `${i * 60}ms` : "0ms" }}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="mt-10 pt-6 border-t border-sangria/20">
          <button
            onClick={() => handleNavClick("#contact")}
            className="text-[0.65rem] font-bold tracking-[0.2em] uppercase text-muted hover:text-sangria transition-colors"
          >
            Let&apos;s Talk →
          </button>
        </div>

        {/* Checker accent bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-2 checker" />
      </div>
    </>
  );
}