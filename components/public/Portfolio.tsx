"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
    <section id="portfolio" className="section-padding bg-off-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="anim-hidden flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="sangria-line" />
              <span className="text-sangria text-[0.65rem] font-bold tracking-[0.2em] uppercase font-body">
                Selected Work
              </span>
            </div>
            <h2
              className="font-display font-black text-sangria leading-tight"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
            >
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
                  data-cursor
                  className={`px-4 py-1.5 text-[0.6rem] tracking-[0.15em] uppercase font-body font-bold border-2 transition-all duration-200 ${
                    activeTag === tag
                      ? "border-sangria bg-sangria text-cream"
                      : "border-sangria/30 text-sangria hover:border-sangria"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted font-body text-[0.75rem] tracking-widest uppercase">
            No projects yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, i) => (
              <Link
                key={item.id}
                href={item.slug ? `/projects/${item.slug}` : "#"}
                className="anim-hidden group block"
                style={{ transitionDelay: `${i * 60}ms` }}
                data-cursor
              >
                {/* Visual */}
                <div className="relative aspect-[4/3] overflow-hidden bg-cornflower border-2 border-sangria/20 group-hover:border-sangria transition-colors duration-300">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-cornflower">
                      {/* Number */}
                      <span className="font-body font-bold text-[0.65rem] tracking-[0.2em] text-sangria/50 absolute top-4 left-4">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {/* Icon */}
                      <span
                        className="text-5xl"
                        style={{ animation: "float-slow 4s ease-in-out infinite" }}
                      >
                        ✦
                      </span>
                      {/* Checker corner */}
                      <div className="absolute bottom-3 right-3 w-8 h-8 checker opacity-30" />
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-sangria/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="border-2 border-cream text-cream text-[0.6rem] tracking-[0.18em] uppercase font-body font-bold px-5 py-2.5">
                      View Project →
                    </span>
                  </div>
                </div>

                {/* Meta */}
                <div className="pt-4 pb-2 border-b-2 border-sangria/10 group-hover:border-sangria transition-colors duration-300">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-sangria text-[0.58rem] tracking-[0.15em] uppercase font-body font-bold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-display font-bold text-sangria text-xl group-hover:italic transition-all duration-300">
                    {item.title}
                  </h3>
                  <p className="text-muted text-[0.68rem] mt-1 leading-relaxed font-body line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}