"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { PortfolioItem } from "@/lib/types";

export default function Portfolio({ data }: { data: PortfolioItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [activeTag, setActiveTag] = useState<string>("All");

  const allTags = [
    "All",
    ...Array.from(new Set(data.flatMap((item) => item.tags))),
  ];

  const filtered =
    activeTag === "All"
      ? data
      : data.filter((item) => item.tags.includes(activeTag));

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
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="portfolio" className="section-padding" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="anim-hidden flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="gold-line" />
              <span className="text-gold text-xs tracking-[0.3em] uppercase font-mono">
                Selected Work
              </span>
            </div>
            <h2 className="font-display text-5xl md:text-6xl text-cream leading-tight">
              Our <em>Portfolio</em>
            </h2>
          </div>

          {/* Tag filters */}
          {allTags.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-4 py-1.5 text-xs tracking-widest uppercase font-mono border transition-all duration-200 ${
                    activeTag === tag
                      ? "border-gold bg-gold text-background"
                      : "border-border text-muted hover:border-muted"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Portfolio grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted font-mono text-sm">
            No projects yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {filtered.map((item, i) => (
              <div
                key={item.id}
                className="anim-hidden group bg-background overflow-hidden"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-surface">
                      <div className="w-12 h-12 border border-border rotate-45 group-hover:rotate-90 transition-transform duration-500" />
                    </div>
                  )}
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="border border-gold text-gold text-xs tracking-widest uppercase px-4 py-2 font-mono">
                      View Project
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-6 border-t border-border">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-gold text-xs tracking-widest uppercase font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-display text-2xl text-cream group-hover:text-gold transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-muted text-sm mt-2 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
