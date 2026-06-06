"use client";

import { useEffect, useRef } from "react";
import {
  Code, Palette, Layers, TrendingUp, Zap, Globe,
  BarChart, Megaphone, Smartphone, ShoppingCart, Camera, PenTool,
} from "lucide-react";
import { Service } from "@/lib/types";

const iconMap: Record<string, React.ReactNode> = {
  Code: <Code size={18} />,
  Palette: <Palette size={18} />,
  Layers: <Layers size={18} />,
  TrendingUp: <TrendingUp size={18} />,
  Zap: <Zap size={18} />,
  Globe: <Globe size={18} />,
  BarChart: <BarChart size={18} />,
  Megaphone: <Megaphone size={18} />,
  Smartphone: <Smartphone size={18} />,
  ShoppingCart: <ShoppingCart size={18} />,
  Camera: <Camera size={18} />,
  PenTool: <PenTool size={18} />,
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
    <section id="services" className="section-padding bg-cream" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="anim-hidden flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="sangria-line" />
              <span className="text-sangria text-[0.65rem] font-bold tracking-[0.2em] uppercase font-body">
                What We Do
              </span>
            </div>
            <h2
              className="font-display font-black text-sangria leading-tight"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
            >
              Our <em>Services</em>
            </h2>
          </div>
          <p className="text-sangria-dark text-[0.72rem] leading-[1.8] max-w-xs font-body tracking-[0.03em]">
            End-to-end digital solutions crafted with precision, purpose, and a
            sharp eye for detail.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-sangria/20">
          {data.map((service, i) => (
            <div
              key={service.id}
              className="anim-hidden group bg-cream hover:bg-cornflower-light p-8 transition-colors duration-300 cursor-default border border-sangria/10"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              {/* Number */}
              <p className="font-body text-[0.6rem] text-sangria/30 mb-6 tracking-[0.2em] font-bold">
                {String(i + 1).padStart(2, "0")}
              </p>

              {/* Icon */}
              <div className="w-9 h-9 border-2 border-sangria/30 group-hover:border-sangria flex items-center justify-center text-sangria/50 group-hover:text-sangria transition-all duration-300 mb-6">
                {iconMap[service.icon] ?? <Zap size={18} />}
              </div>

              {/* Title */}
              <h3 className="font-display font-bold text-sangria text-xl mb-3 group-hover:italic transition-all duration-300">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-sangria-dark text-[0.7rem] leading-[1.8] font-body tracking-[0.02em]">
                {service.description}
              </p>

              {/* Arrow */}
              <div className="mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 text-sangria">
                <span className="text-[0.6rem] tracking-[0.15em] uppercase font-body font-bold">
                  Learn more
                </span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}