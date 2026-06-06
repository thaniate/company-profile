"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { HeroSection } from "@/lib/types";

export default function Hero({ data }: { data: HeroSection }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const children = el.querySelectorAll(".hero-anim");
    children.forEach((child, i) => {
      setTimeout(() => {
        (child as HTMLElement).style.opacity = "1";
        (child as HTMLElement).style.transform = "translateY(0)";
      }, 200 + i * 120);
    });
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background image */}
      {data.image_url && (
        <div className="absolute inset-0 z-0">
          <Image
            src={data.image_url}
            alt="Hero background"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        </div>
      )}

      {/* Background geometry */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] border border-border/30 rounded-full translate-x-1/2 -translate-y-1/4" />
        <div className="absolute top-1/3 right-16 w-[400px] h-[400px] border border-border/20 rounded-full" />
        <div className="absolute bottom-0 left-0 w-96 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="absolute top-0 right-1/4 w-px h-48 bg-gradient-to-b from-gold/20 to-transparent" />
      </div>

      <div
        ref={containerRef}
        className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20"
      >
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div
            className="hero-anim flex items-center gap-4 mb-8"
            style={{ opacity: 0, transform: "translateY(24px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}
          >
            <span className="gold-line" />
            <span className="text-gold text-xs tracking-[0.3em] uppercase font-mono">
              Creative Studio
            </span>
          </div>

          {/* Headline */}
          <h1
            className="hero-anim font-display text-6xl md:text-7xl lg:text-8xl text-cream leading-[1.05] mb-8"
            style={{ opacity: 0, transform: "translateY(24px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}
          >
            {data.headline.split(" ").map((word, i) => (
              <span key={i} className={i % 3 === 2 ? "italic text-gold" : ""}>
                {word}{" "}
              </span>
            ))}
          </h1>

          {/* Subheadline */}
          <p
            className="hero-anim text-muted text-lg md:text-xl leading-relaxed mb-12 max-w-xl"
            style={{ opacity: 0, transform: "translateY(24px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}
          >
            {data.subheadline}
          </p>

          {/* CTA row */}
          <div
            className="hero-anim flex flex-wrap items-center gap-6"
            style={{ opacity: 0, transform: "translateY(24px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}
          >
            <Link
              href={data.cta_url}
              className="group inline-flex items-center gap-3 bg-gold text-background px-8 py-4 text-sm tracking-widest uppercase font-body font-medium hover:bg-gold-light transition-colors duration-300"
            >
              {data.cta_text}
              <span className="group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </Link>

            <Link
              href="#about"
              className="text-muted hover:text-cream text-sm tracking-widest uppercase transition-colors duration-200 group inline-flex items-center gap-2"
            >
              Our Story
              <span className="w-8 h-px bg-muted group-hover:bg-cream group-hover:w-12 transition-all duration-300 inline-block" />
            </Link>
          </div>

          {/* Stats */}
          <div
            className="hero-anim mt-20 pt-8 border-t border-border grid grid-cols-3 gap-8 max-w-lg"
            style={{ opacity: 0, transform: "translateY(24px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}
          >
            {[
              { value: "50+", label: "Projects" },
              { value: "8+", label: "Years" },
              { value: "100%", label: "Satisfaction" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-4xl text-gold">{stat.value}</p>
                <p className="text-muted text-xs tracking-widest uppercase mt-1 font-mono">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="text-muted/50 text-xs tracking-widest uppercase font-mono">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-gold/50 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
