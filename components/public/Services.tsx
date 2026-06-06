"use client";

import { useEffect, useRef } from "react";
import {
  Code,
  Palette,
  Layers,
  TrendingUp,
  Zap,
  Globe,
  BarChart,
  Megaphone,
  Smartphone,
  ShoppingCart,
  Camera,
  PenTool,
} from "lucide-react";
import { Service } from "@/lib/types";

const iconMap: Record<string, React.ReactNode> = {
  Code: <Code size={20} />,
  Palette: <Palette size={20} />,
  Layers: <Layers size={20} />,
  TrendingUp: <TrendingUp size={20} />,
  Zap: <Zap size={20} />,
  Globe: <Globe size={20} />,
  BarChart: <BarChart size={20} />,
  Megaphone: <Megaphone size={20} />,
  Smartphone: <Smartphone size={20} />,
  ShoppingCart: <ShoppingCart size={20} />,
  Camera: <Camera size={20} />,
  PenTool: <PenTool size={20} />,
};

export default function Services({ data }: { data: Service[] }) {
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
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="services"
      className="section-padding bg-surface border-y border-border"
      ref={ref}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="anim-hidden flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="gold-line" />
              <span className="text-gold text-xs tracking-[0.3em] uppercase font-mono">
                What We Do
              </span>
            </div>
            <h2 className="font-display text-5xl md:text-6xl text-cream leading-tight">
              Our <em>Services</em>
            </h2>
          </div>
          <p className="text-muted max-w-xs text-sm leading-relaxed">
            End-to-end digital solutions crafted with precision, purpose, and a
            sharp eye for detail.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
          {data.map((service, i) => (
            <div
              key={service.id}
              className="anim-hidden group bg-surface hover:bg-background p-8 transition-colors duration-300 cursor-default"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              {/* Number */}
              <p className="font-mono text-xs text-muted/40 mb-6 tracking-widest">
                {String(i + 1).padStart(2, "0")}
              </p>

              {/* Icon */}
              <div className="w-10 h-10 border border-border group-hover:border-gold flex items-center justify-center text-muted group-hover:text-gold transition-all duration-300 mb-6">
                {iconMap[service.icon] ?? <Zap size={20} />}
              </div>

              {/* Title */}
              <h3 className="font-display text-2xl text-cream mb-3 group-hover:text-gold transition-colors duration-300">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-muted text-sm leading-relaxed">
                {service.description}
              </p>

              {/* Arrow */}
              <div className="mt-8 flex items-center gap-2 text-muted/0 group-hover:text-gold transition-all duration-300">
                <span className="text-xs tracking-widest uppercase font-mono">
                  Learn more
                </span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
