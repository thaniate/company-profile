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
    <section id="about" className="section-padding bg-off-white" ref={ref}>
      {/* Gingham strip top */}
      <div className="gingham-strip mb-16" />

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <div className="anim-hidden relative">
            <div className="relative aspect-[4/5] overflow-hidden bg-cornflower-light border-2 border-sangria">
              {data.image_url ? (
                <Image
                  src={data.image_url}
                  alt={data.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <span
                    className="font-accent text-sangria/20 text-[8rem] leading-none"
                    style={{ animation: "float-slow 5s ease-in-out infinite" }}
                  >
                    S
                  </span>
                </div>
              )}

              {/* Corner checker accents */}
              <div className="absolute top-0 left-0 w-12 h-12 checker opacity-60" />
              <div className="absolute bottom-0 right-0 w-12 h-12 checker opacity-60" />
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-5 -right-5 bg-sangria text-cream px-6 py-4 hidden lg:block border-2 border-sangria">
              <p className="font-display text-3xl font-black">8+</p>
              <p className="text-[0.55rem] tracking-[0.15em] uppercase font-body font-bold mt-0.5">
                Years of craft
              </p>
            </div>
          </div>

          {/* Text side */}
          <div className="space-y-8">
            <div className="anim-hidden">
              <div className="flex items-center gap-3 mb-4">
                <span className="sangria-line" />
                <span className="text-sangria text-[0.65rem] font-bold tracking-[0.2em] uppercase font-body">
                  Who We Are
                </span>
              </div>
              <h2 className="font-display font-black text-sangria leading-tight"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
                {data.title}
              </h2>
            </div>

            <div className="anim-hidden w-full h-[1.5px] bg-sangria/20" />

            <p className="anim-hidden text-sangria-dark text-[0.78rem] leading-[1.8] tracking-[0.03em] font-body">
              {data.description}
            </p>

            {/* Values */}
            <div className="anim-hidden stagger grid grid-cols-2 gap-3 pt-2">
              {[
                { icon: "✦", label: "Design-led" },
                { icon: "◉", label: "Detail obsessed" },
                { icon: "◇", label: "Client-focused" },
                { icon: "★", label: "Results driven" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 text-muted hover:text-sangria transition-colors group border border-sangria/10 hover:border-sangria/40 px-3 py-2.5"
                >
                  <span
                    className="text-sangria text-base group-hover:scale-110 transition-transform inline-block"
                    style={{ animation: "float-slow 4s ease-in-out infinite" }}
                  >
                    {item.icon}
                  </span>
                  <span className="text-[0.7rem] font-bold tracking-[0.1em] uppercase font-body">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gingham strip bottom */}
      <div className="gingham-strip mt-16" />
    </section>
  );
}