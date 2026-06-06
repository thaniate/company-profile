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
    <section id="contact" className="section-padding bg-cream" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="anim-hidden mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="sangria-line" />
            <span className="text-sangria text-[0.65rem] font-bold tracking-[0.2em] uppercase font-body">
              Get In Touch
            </span>
          </div>
          <h2
            className="font-display font-black text-sangria leading-[0.92]"
            style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
          >
            Let&apos;s<br />
            <em>Work</em><br />
            Together.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          {/* Info */}
          <div className="lg:col-span-2 space-y-10 anim-hidden">
            <p className="text-sangria-dark text-[0.72rem] leading-[1.8] font-body tracking-[0.03em]">
              Have a project in mind? We&apos;d love to hear about it. Send us a
              message and we&apos;ll get back to you within 24 hours.
            </p>

            <div className="space-y-5">
              {[
                { icon: <Mail size={14} />, label: "Email", value: "hello@studio.com" },
                { icon: <Phone size={14} />, label: "Phone", value: "+62 812 3456 7890" },
                { icon: <MapPin size={14} />, label: "Location", value: "Bandung, Indonesia" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4 group">
                  <div className="w-8 h-8 border-2 border-sangria/30 group-hover:border-sangria flex items-center justify-center text-sangria/50 group-hover:text-sangria transition-all duration-300 flex-shrink-0 mt-0.5">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[0.58rem] tracking-[0.2em] uppercase font-body font-bold text-muted mb-1">
                      {item.label}
                    </p>
                    <p className="text-sangria text-[0.78rem] font-body font-bold">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Response time */}
            <div className="pt-6 border-t-2 border-sangria/10">
              <p className="text-[0.58rem] tracking-[0.2em] uppercase font-body font-bold text-muted mb-3">
                Response time
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-sangria animate-pulse" />
                <p className="text-[0.72rem] text-sangria-dark font-body">
                  Usually within 24 hours
                </p>
              </div>
            </div>

            {/* Decorative sticker */}
            <div
              className="hidden lg:flex w-fit bg-cornflower border-2 border-sangria px-5 py-3 font-body font-bold text-sangria text-[0.6rem] tracking-[0.1em] uppercase"
              style={{ transform: "rotate(-2deg)", animation: "wobble1 5s ease-in-out infinite" }}
            >
              ✦ Let&apos;s create something great
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3 anim-hidden">
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[0.58rem] tracking-[0.2em] uppercase font-body font-bold text-muted">
                    Name <span className="text-sangria">*</span>
                  </label>
                  <input
                    {...register("name", { required: "Name is required" })}
                    placeholder="Your full name"
                    className="input-base"
                  />
                  {errors.name && (
                    <p className="text-sangria-light text-[0.65rem] font-body">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[0.58rem] tracking-[0.2em] uppercase font-body font-bold text-muted">
                    Email <span className="text-sangria">*</span>
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
                    <p className="text-sangria-light text-[0.65rem] font-body">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[0.58rem] tracking-[0.2em] uppercase font-body font-bold text-muted">
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
                <label className="text-[0.58rem] tracking-[0.2em] uppercase font-body font-bold text-muted">
                  Message <span className="text-sangria">*</span>
                </label>
                <textarea
                  {...register("message", { required: "Message is required" })}
                  rows={6}
                  placeholder="Tell us about your project..."
                  className="input-base resize-none"
                />
                {errors.message && (
                  <p className="text-sangria-light text-[0.65rem] font-body">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={loading}
                data-cursor
                className="w-full bg-sangria text-cream py-4 text-[0.65rem] tracking-[0.18em] uppercase font-body font-bold hover:bg-sangria-dark transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send size={13} className="group-hover:translate-x-1 transition-transform duration-300" />
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