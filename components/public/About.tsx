"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { AboutSection } from "@/lib/types";

export default function About({ data }: { data: AboutSection }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".anim-hidden").forEach((el) => {
              el.classList.add("anim-visible");
            });
          }
        });
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="section-padding" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <div className="anim-hidden relative">
            <div className="relative aspect-[4/5] overflow-hidden bg-surface border border-border">
              {data.image_url ? (
                <Image
                  src={data.image_url}
                  alt={data.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 border border-border rotate-45" />
                </div>
              )}
              {/* Corner accent */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-gold -translate-x-3 -translate-y-3" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-gold translate-x-3 translate-y-3" />
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 bg-gold text-background p-6 hidden lg:block">
              <p className="font-display text-4xl font-semibold">8+</p>
              <p className="text-xs tracking-widest uppercase font-body mt-1">
                Years of craft
              </p>
            </div>
          </div>

          {/* Text side */}
          <div className="space-y-8">
            <div className="anim-hidden">
              <div className="flex items-center gap-4 mb-4">
                <span className="gold-line" />
                <span className="text-gold text-xs tracking-[0.3em] uppercase font-mono">
                  Who We Are
                </span>
              </div>
              <h2 className="font-display text-5xl md:text-6xl text-cream leading-tight">
                {data.title}
              </h2>
            </div>

            <div className="anim-hidden w-full h-px bg-border" />

            <p className="anim-hidden text-muted text-lg leading-relaxed">
              {data.description}
            </p>

            {/* Values */}
            <div className="anim-hidden stagger grid grid-cols-2 gap-4 pt-4">
              {[
                { icon: "◈", label: "Design-led" },
                { icon: "◉", label: "Detail obsessed" },
                { icon: "◇", label: "Client-focused" },
                { icon: "○", label: "Results driven" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 text-muted hover:text-cream transition-colors group"
                >
                  <span className="text-gold text-lg group-hover:scale-110 transition-transform inline-block">
                    {item.icon}
                  </span>
                  <span className="text-sm tracking-wide">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
