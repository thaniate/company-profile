"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Save, Upload, X } from "lucide-react";
import { AboutSection } from "@/lib/types";
import Image from "next/image";

export default function AboutEditor() {
  const supabase = createClient();
  const [data, setData] = useState<AboutSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const { data: about } = await supabase
        .from("about_section")
        .select("*")
        .single();
      setData(about);
      setLoading(false);
    };
    fetch();
  }, []);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("about_section")
        .update({
          title: data.title,
          description: data.description,
          updated_at: new Date().toISOString(),
        })
        .eq("id", data.id);

      if (error) throw error;
      toast.success("About section saved.");
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
      const path = `about/about-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("media")
        .getPublicUrl(path);

      const { error: updateError } = await supabase
        .from("about_section")
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
      .from("about_section")
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
            About Section
          </span>
        </div>
        <h1 className="font-display text-4xl text-cream">Edit About</h1>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs tracking-widest uppercase font-mono text-muted/60">
            Section Title
          </label>
          <input
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            className="input-base"
            placeholder="About Us"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs tracking-widest uppercase font-mono text-muted/60">
            Description
          </label>
          <textarea
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            rows={6}
            className="input-base resize-none"
            placeholder="Tell your story..."
          />
        </div>

        {/* Image */}
        <div className="space-y-3">
          <label className="text-xs tracking-widest uppercase font-mono text-muted/60">
            Section Image
          </label>
          {data.image_url ? (
            <div className="relative aspect-[4/5] max-w-xs border border-border overflow-hidden bg-surface">
              <Image
                src={data.image_url}
                alt="About"
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
            <label className="flex flex-col items-center justify-center h-48 max-w-xs border border-dashed border-border hover:border-gold cursor-pointer transition-colors group bg-surface">
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
