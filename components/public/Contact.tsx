"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Send } from "lucide-react";

type FormData = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

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

  const onSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to send");
      toast.success("Message sent! We'll get back to you soon.");
      reset();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section-padding" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="anim-hidden mb-16">
          <div className="flex items-center gap-4 mb-4">
            <span className="gold-line" />
            <span className="text-gold text-xs tracking-[0.3em] uppercase font-mono">
              Get In Touch
            </span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl text-cream leading-tight">
            Start a <em>Project</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          {/* Info */}
          <div className="lg:col-span-2 space-y-10 anim-hidden">
            <p className="text-muted leading-relaxed">
              Have a project in mind? We&apos;d love to hear about it. Send us a
              message and we&apos;ll get back to you within 24 hours.
            </p>

            <div className="space-y-6">
              {[
                {
                  icon: <Mail size={16} />,
                  label: "Email",
                  value: "hello@studio.com",
                },
                {
                  icon: <Phone size={16} />,
                  label: "Phone",
                  value: "+62 812 3456 7890",
                },
                {
                  icon: <MapPin size={16} />,
                  label: "Location",
                  value: "Bandung, Indonesia",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4 group">
                  <div className="w-8 h-8 border border-border group-hover:border-gold flex items-center justify-center text-muted group-hover:text-gold transition-all duration-300 flex-shrink-0 mt-0.5">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs tracking-widest uppercase font-mono text-muted/60 mb-1">
                      {item.label}
                    </p>
                    <p className="text-cream text-sm">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Decorative */}
            <div className="pt-8 border-t border-border">
              <p className="text-xs tracking-widest uppercase font-mono text-muted/40 mb-4">
                Response time
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <p className="text-sm text-muted">Usually within 24 hours</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3 anim-hidden">
            <div
              className="space-y-5"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs tracking-widest uppercase font-mono text-muted/60">
                    Name <span className="text-gold">*</span>
                  </label>
                  <input
                    {...register("name", { required: "Name is required" })}
                    placeholder="Your full name"
                    className="input-base"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs font-mono">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs tracking-widest uppercase font-mono text-muted/60">
                    Email <span className="text-gold">*</span>
                  </label>
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email address",
                      },
                    })}
                    type="email"
                    placeholder="your@email.com"
                    className="input-base"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs font-mono">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs tracking-widest uppercase font-mono text-muted/60">
                  Phone
                </label>
                <input
                  {...register("phone")}
                  type="tel"
                  placeholder="+62 812 xxxx xxxx"
                  className="input-base"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs tracking-widest uppercase font-mono text-muted/60">
                  Message <span className="text-gold">*</span>
                </label>
                <textarea
                  {...register("message", { required: "Message is required" })}
                  rows={5}
                  placeholder="Tell us about your project..."
                  className="input-base resize-none"
                />
                {errors.message && (
                  <p className="text-red-400 text-xs font-mono">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={loading}
                className="w-full bg-gold text-background py-4 text-sm tracking-widest uppercase font-body font-medium hover:bg-gold-light transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send
                      size={14}
                      className="group-hover:translate-x-1 transition-transform duration-300"
                    />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
