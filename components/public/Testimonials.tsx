"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Testimonial } from "@/lib/types";

export default function Testimonials({ data }: { data: Testimonial[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

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

  if (data.length === 0) return null;

  const current = data[active];

  return (
    <section
      id="testimonials"
      className="section-padding bg-surface border-y border-border"
      ref={ref}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="anim-hidden mb-16">
          <div className="flex items-center gap-4 mb-4">
            <span className="gold-line" />
            <span className="text-gold text-xs tracking-[0.3em] uppercase font-mono">
              Client Words
            </span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl text-cream leading-tight">
            What They <em>Say</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Quote */}
          <div className="anim-hidden space-y-8">
            {/* Large quote mark */}
            <div className="font-display text-[8rem] text-gold/20 leading-none select-none -mb-8">
              "
            </div>

            <blockquote
              key={active}
              className="font-display text-2xl md:text-3xl text-cream leading-relaxed italic"
              style={{ animation: "fadeIn 0.4s ease forwards" }}
            >
              {current.content}
            </blockquote>

            <div className="flex items-center gap-4 pt-4 border-t border-border">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full overflow-hidden bg-border flex-shrink-0">
                {current.avatar_url ? (
                  <Image
                    src={current.avatar_url}
                    alt={current.name}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-surface text-gold font-display text-lg">
                    {current.name[0]}
                  </div>
                )}
              </div>
              <div>
                <p className="text-cream font-medium text-sm">{current.name}</p>
                <p className="text-muted text-xs font-mono tracking-wide mt-0.5">
                  {current.role} — {current.company}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation + all names */}
          <div className="anim-hidden space-y-2">
            {data.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setActive(i)}
                className={`w-full text-left px-6 py-4 border transition-all duration-300 group ${
                  i === active
                    ? "border-gold bg-gold/5 text-cream"
                    : "border-border text-muted hover:border-muted hover:text-cream/70"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs font-mono tracking-wide mt-0.5 opacity-60">
                      {t.company}
                    </p>
                  </div>
                  {i === active && (
                    <span className="text-gold text-lg">◈</span>
                  )}
                </div>
              </button>
            ))}

            {/* Dots */}
            <div className="flex items-center gap-2 pt-4 px-1">
              {data.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`transition-all duration-300 ${
                    i === active
                      ? "w-6 h-1 bg-gold"
                      : "w-1.5 h-1 bg-border hover:bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
