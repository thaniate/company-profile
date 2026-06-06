"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Save, Upload, X } from "lucide-react";
import { HeroSection } from "@/lib/types";
import Image from "next/image";

export default function HeroEditor() {
  const supabase = createClient();
  const [data, setData] = useState<HeroSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const { data: hero } = await supabase
        .from("hero_section")
        .select("*")
        .single();
      setData(hero);
      setLoading(false);
    };
    fetch();
  }, []);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("hero_section")
        .update({
          headline: data.headline,
          subheadline: data.subheadline,
          cta_text: data.cta_text,
          cta_url: data.cta_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", data.id);

      if (error) throw error;
      toast.success("Hero section saved.");
    } catch {
      toast.error("Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !data) return;
    setUploading(true);

    try {
      const ext = file.name.split(".").pop();
      const path = `hero/hero-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("media")
        .getPublicUrl(path);

      const { error: updateError } = await supabase
        .from("hero_section")
        .update({ image_url: urlData.publicUrl })
        .eq("id", data.id);

      if (updateError) throw updateError;

      setData({ ...data, image_url: urlData.publicUrl });
      toast.success("Image uploaded.");
    } catch {
      toast.error("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!data) return;
    const { error } = await supabase
      .from("hero_section")
      .update({ image_url: null })
      .eq("id", data.id);
    if (!error) {
      setData({ ...data, image_url: null });
      toast.success("Image removed.");
    }
  };

  if (loading) {
    return (
      <div className="p-10 flex items-center gap-3 text-muted font-mono text-sm">
        <div className="w-4 h-4 border-2 border-muted/30 border-t-gold rounded-full animate-spin" />
        Loading...
      </div>
    );
  }

  if (!data) return <div className="p-10 text-muted font-mono text-sm">No data found.</div>;

  return (
    <div className="p-6 md:p-10 max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="gold-line" />
          <span className="text-gold text-xs tracking-[0.3em] uppercase font-mono">
            Hero Section
          </span>
        </div>
        <h1 className="font-display text-4xl text-cream">Edit Hero</h1>
      </div>

      <div className="space-y-6">
        {/* Headline */}
        <div className="space-y-1.5">
          <label className="text-xs tracking-widest uppercase font-mono text-muted/60">
            Headline
          </label>
          <input
            value={data.headline}
            onChange={(e) => setData({ ...data, headline: e.target.value })}
            className="input-base"
            placeholder="We Build Digital Experiences"
          />
        </div>

        {/* Subheadline */}
        <div className="space-y-1.5">
          <label className="text-xs tracking-widest uppercase font-mono text-muted/60">
            Subheadline
          </label>
          <textarea
            value={data.subheadline}
            onChange={(e) => setData({ ...data, subheadline: e.target.value })}
            rows={3}
            className="input-base resize-none"
            placeholder="A short compelling description..."
          />
        </div>

        {/* CTA row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs tracking-widest uppercase font-mono text-muted/60">
              CTA Button Text
            </label>
            <input
              value={data.cta_text}
              onChange={(e) => setData({ ...data, cta_text: e.target.value })}
              className="input-base"
              placeholder="See Our Work"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs tracking-widest uppercase font-mono text-muted/60">
              CTA Button URL
            </label>
            <input
              value={data.cta_url}
              onChange={(e) => setData({ ...data, cta_url: e.target.value })}
              className="input-base"
              placeholder="#portfolio"
            />
          </div>
        </div>

        {/* Image */}
        <div className="space-y-3">
          <label className="text-xs tracking-widest uppercase font-mono text-muted/60">
            Background Image
          </label>
          {data.image_url ? (
            <div className="relative aspect-video border border-border overflow-hidden bg-surface">
              <Image
                src={data.image_url}
                alt="Hero"
                fill
                className="object-cover"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-3 right-3 bg-background/80 border border-border text-muted hover:text-red-400 p-1.5 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center aspect-video border border-dashed border-border hover:border-gold cursor-pointer transition-colors group bg-surface">
              <Upload
                size={20}
                className="text-muted group-hover:text-gold transition-colors mb-2"
              />
              <span className="text-muted text-xs font-mono group-hover:text-gold transition-colors">
                {uploading ? "Uploading..." : "Click to upload image"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          )}
        </div>

        {/* Save */}
        <div className="pt-4 border-t border-border">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-3 bg-gold text-background px-6 py-3 text-sm tracking-widest uppercase font-body font-medium hover:bg-gold-light transition-colors duration-300 disabled:opacity-50 group"
          >
            <Save size={14} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
