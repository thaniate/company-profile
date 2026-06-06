"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
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
    <section id="hero" className="min-h-screen grid grid-cols-1 lg:grid-cols-2 relative overflow-hidden">

      {/* LEFT */}
      <div
        ref={containerRef}
        className="flex flex-col justify-end px-8 md:px-14 pt-32 pb-14 relative z-10 bg-cream"
      >
        {/* Eyebrow */}
        <div
          className="hero-anim flex items-center gap-3 mb-6"
          style={{ opacity: 0, transform: "translateY(24px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}
        >
          <span className="sangria-line" />
          <span className="text-sangria text-[0.65rem] font-bold tracking-[0.2em] uppercase font-body">
            Creative Studio
          </span>
        </div>

        {/* Headline */}
        <h1
          className="hero-anim font-display font-black text-sangria leading-[0.92] mb-8"
          style={{
            fontSize: "clamp(3.5rem, 7vw, 6.5rem)",
            opacity: 0,
            transform: "translateY(24px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          {data.headline.split(" ").map((word, i) => (
            <span key={i} className={i % 3 === 2 ? "italic text-cornflower-dark" : ""}>
              {word}{" "}
            </span>
          ))}
        </h1>

        {/* Subheadline */}
        <p
          className="hero-anim text-sangria-dark text-[0.72rem] leading-[1.8] max-w-sm mb-10 tracking-[0.03em] font-body"
          style={{ opacity: 0, transform: "translateY(24px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}
        >
          {data.subheadline}
        </p>

        {/* CTA */}
        <div
          className="hero-anim flex flex-wrap items-center gap-5"
          style={{ opacity: 0, transform: "translateY(24px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}
        >
          <Link
            href={data.cta_url}
            className="group inline-flex items-center gap-3 bg-sangria text-cream text-[0.65rem] font-bold tracking-[0.18em] uppercase px-8 py-4 hover:bg-sangria-dark transition-colors duration-200"
            data-cursor
          >
            {data.cta_text}
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </Link>

          <Link
            href="#about"
            className="text-sangria text-[0.65rem] font-bold tracking-[0.15em] uppercase hover:text-cornflower-dark transition-colors group inline-flex items-center gap-2"
          >
            Our Story
            <span className="w-6 h-[1.5px] bg-sangria group-hover:bg-cornflower-dark group-hover:w-10 transition-all duration-300 inline-block" />
          </Link>
        </div>

        {/* Stats */}
        <div
          className="hero-anim mt-16 pt-6 border-t border-sangria/20 grid grid-cols-3 gap-6 max-w-sm"
          style={{ opacity: 0, transform: "translateY(24px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}
        >
          {[
            { value: "50+", label: "Projects" },
            { value: "8+", label: "Years" },
            { value: "100%", label: "Satisfaction" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-3xl font-black text-sangria">{stat.value}</p>
              <p className="text-muted text-[0.6rem] tracking-[0.2em] uppercase mt-0.5 font-body font-bold">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — cornflower panel */}
      <div className="relative bg-cornflower hidden lg:flex items-center justify-center overflow-hidden min-h-[500px]">
        {/* Big bg text */}
        <span
          className="font-accent absolute whitespace-nowrap pointer-events-none select-none"
          style={{
            fontSize: "clamp(6rem, 16vw, 13rem)",
            color: "rgba(147,5,0,0.08)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            letterSpacing: "-0.02em",
          }}
        >
          STUDIO
        </span>

        {/* Sticker 1 */}
        <div
          className="absolute top-[15%] left-[10%] bg-sangria text-cream font-body font-bold text-[0.6rem] tracking-[0.1em] uppercase px-4 py-2"
          style={{ transform: "rotate(-6deg)", animation: "wobble1 4s ease-in-out infinite" }}
        >
          ✦ Creative Studio
        </div>

        {/* Sticker 2 */}
        <div
          className="absolute bottom-[25%] right-[8%] bg-cream text-sangria border-2 border-sangria font-body font-bold text-[0.55rem] tracking-[0.08em] px-3 py-2"
          style={{ transform: "rotate(4deg)", animation: "wobble2 5s ease-in-out infinite" }}
        >
          Est. 2016
        </div>

        {/* Circle badge */}
        <div className="absolute bottom-[10%] left-[8%] w-28 h-28 rounded-full bg-cream border-2 border-sangria flex flex-col items-center justify-center text-center">
          <span className="font-display font-black text-sangria text-2xl leading-none">50+</span>
          <span className="font-body font-bold text-sangria text-[0.5rem] tracking-[0.1em] uppercase mt-1">Projects</span>
        </div>

        {/* Spinning star */}
        <div
          className="absolute top-[50%] left-[5%] text-sangria text-3xl"
          style={{ animation: "spin-slow 12s linear infinite" }}
        >
          ✦
        </div>

        {/* Floating main icon */}
        <div
          className="relative z-10 w-48 h-48 rounded-full bg-cream border-2 border-sangria flex items-center justify-center"
          style={{ animation: "float-slow 5s ease-in-out infinite" }}
        >
          <span className="font-accent text-sangria text-6xl">S</span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden lg:flex flex-col items-center gap-2">
        <span className="text-sangria/40 text-[0.6rem] tracking-[0.2em] uppercase font-body font-bold">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-sangria/40 to-transparent" />
      </div>
    </section>
  );
}