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
    <section id="testimonials" className="section-padding bg-sangria" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="anim-hidden mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-[1.5px] bg-cream block flex-shrink-0" />
            <span className="text-cream/70 text-[0.65rem] font-bold tracking-[0.2em] uppercase font-body">
              Client Words
            </span>
          </div>
          <h2
            className="font-display font-black text-cream leading-tight"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
          >
            What They <em>Say</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Quote */}
          <div className="anim-hidden space-y-8">
            {/* Large quote mark */}
            <div
              className="font-accent text-cream/10 leading-none select-none -mb-8"
              style={{ fontSize: "8rem" }}
            >
              "
            </div>

            <blockquote
              key={active}
              className="font-display text-2xl md:text-3xl text-cream leading-relaxed italic font-bold"
              style={{ animation: "fadeIn 0.4s ease forwards" }}
            >
              {current.content}
            </blockquote>

            <div className="flex items-center gap-4 pt-4 border-t border-cream/20">
              {/* Avatar */}
              <div className="w-12 h-12 overflow-hidden bg-cornflower-light border-2 border-cream/30 flex-shrink-0">
                {current.avatar_url ? (
                  <Image
                    src={current.avatar_url}
                    alt={current.name}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-cornflower text-sangria font-display font-black text-lg">
                    {current.name[0]}
                  </div>
                )}
              </div>
              <div>
                <p className="text-cream font-body font-bold text-[0.75rem] tracking-wide">
                  {current.name}
                </p>
                <p className="text-cream/50 text-[0.62rem] font-body tracking-[0.1em] mt-0.5">
                  {current.role} — {current.company}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation list */}
          <div className="anim-hidden space-y-2">
            {data.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setActive(i)}
                data-cursor
                className={`w-full text-left px-5 py-4 border-2 transition-all duration-300 ${
                  i === active
                    ? "border-cream bg-cream/10 text-cream"
                    : "border-cream/20 text-cream/50 hover:border-cream/50 hover:text-cream/80"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[0.72rem] font-bold font-body tracking-wide">
                      {t.name}
                    </p>
                    <p className="text-[0.6rem] font-body tracking-[0.1em] mt-0.5 opacity-60">
                      {t.company}
                    </p>
                  </div>
                  {i === active && (
                    <span className="text-cream text-lg">✦</span>
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
                      ? "w-6 h-1 bg-cream"
                      : "w-1.5 h-1 bg-cream/30 hover:bg-cream/60"
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