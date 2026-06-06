"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SiteSettings } from "@/lib/types";
import { toast } from "sonner";
import { Save, Building2, Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";

type Section = "company" | "social";

export default function SettingsPage() {
  const supabase = createClient();
  const [data, setData] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>("company");

  useEffect(() => {
    const fetch = async () => {
      const { data: settings } = await supabase
        .from("site_settings")
        .select("*")
        .single();
      setData(settings);
      setLoading(false);
    };
    fetch();
  }, []);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("site_settings")
        .update({
          company_name: data.company_name,
          company_email: data.company_email,
          company_phone: data.company_phone,
          company_address: data.company_address,
          facebook_url: data.facebook_url,
          instagram_url: data.instagram_url,
          linkedin_url: data.linkedin_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", data.id);

      if (error) throw error;
      toast.success("Settings saved.");
    } catch {
      toast.error("Failed to save. Try again.");
    } finally {
      setSaving(false);
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

  if (!data) {
    return (
      <div className="p-10 text-muted font-mono text-sm">
        No settings found. Run the SQL migration first.
      </div>
    );
  }

  const tabs: { key: Section; label: string }[] = [
    { key: "company", label: "Company Info" },
    { key: "social", label: "Social Media" },
  ];

  return (
    <div className="p-6 md:p-10 max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="gold-line" />
          <span className="text-gold text-xs tracking-[0.3em] uppercase font-mono">
            Site Configuration
          </span>
        </div>
        <h1 className="font-display text-4xl text-cream">Settings</h1>
        <p className="text-muted text-sm font-mono mt-2">
          Manage your company information and social links.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveSection(tab.key)}
            className={`px-5 py-3 text-xs tracking-widest uppercase font-mono transition-all duration-200 border-b-2 -mb-px ${
              activeSection === tab.key
                ? "border-gold text-gold"
                : "border-transparent text-muted hover:text-cream"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Company Info */}
      {activeSection === "company" && (
        <div className="space-y-6">
          {/* Company Name */}
          <div className="space-y-1.5">
            <label className="text-xs tracking-widest uppercase font-mono text-muted/60 flex items-center gap-2">
              <Building2 size={11} />
              Company Name
            </label>
            <input
              value={data.company_name}
              onChange={(e) =>
                setData({ ...data, company_name: e.target.value })
              }
              placeholder="Studio"
              className="input-base"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs tracking-widest uppercase font-mono text-muted/60 flex items-center gap-2">
              <Mail size={11} />
              Company Email
            </label>
            <input
              value={data.company_email}
              onChange={(e) =>
                setData({ ...data, company_email: e.target.value })
              }
              type="email"
              placeholder="hello@studio.com"
              className="input-base"
            />
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-xs tracking-widest uppercase font-mono text-muted/60 flex items-center gap-2">
              <Phone size={11} />
              Company Phone
            </label>
            <input
              value={data.company_phone}
              onChange={(e) =>
                setData({ ...data, company_phone: e.target.value })
              }
              type="tel"
              placeholder="+62 812 3456 7890"
              className="input-base"
            />
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <label className="text-xs tracking-widest uppercase font-mono text-muted/60 flex items-center gap-2">
              <MapPin size={11} />
              Company Address
            </label>
            <textarea
              value={data.company_address}
              onChange={(e) =>
                setData({ ...data, company_address: e.target.value })
              }
              rows={3}
              placeholder="Bandung, Indonesia"
              className="input-base resize-none"
            />
          </div>
        </div>
      )}

      {/* Social Media */}
      {activeSection === "social" && (
        <div className="space-y-6">
          <p className="text-muted text-xs font-mono leading-relaxed">
            Enter full URLs including https://. Leave blank to hide the link.
          </p>

          {/* Facebook */}
          <div className="space-y-1.5">
            <label className="text-xs tracking-widest uppercase font-mono text-muted/60 flex items-center gap-2">
              <Facebook size={11} />
              Facebook URL
            </label>
            <input
              value={data.facebook_url}
              onChange={(e) =>
                setData({ ...data, facebook_url: e.target.value })
              }
              placeholder="https://facebook.com/yourstudio"
              className="input-base"
            />
          </div>

          {/* Instagram */}
          <div className="space-y-1.5">
            <label className="text-xs tracking-widest uppercase font-mono text-muted/60 flex items-center gap-2">
              <Instagram size={11} />
              Instagram URL
            </label>
            <input
              value={data.instagram_url}
              onChange={(e) =>
                setData({ ...data, instagram_url: e.target.value })
              }
              placeholder="https://instagram.com/yourstudio"
              className="input-base"
            />
          </div>

          {/* LinkedIn */}
          <div className="space-y-1.5">
            <label className="text-xs tracking-widest uppercase font-mono text-muted/60 flex items-center gap-2">
              <Linkedin size={11} />
              LinkedIn URL
            </label>
            <input
              value={data.linkedin_url}
              onChange={(e) =>
                setData({ ...data, linkedin_url: e.target.value })
              }
              placeholder="https://linkedin.com/company/yourstudio"
              className="input-base"
            />
          </div>

          {/* Preview */}
          {(data.facebook_url || data.instagram_url || data.linkedin_url) && (
            <div className="border border-border p-5 space-y-3">
              <p className="text-xs tracking-widest uppercase font-mono text-muted/50">
                Active Links Preview
              </p>
              <div className="flex flex-wrap gap-3">
                {data.facebook_url && (
                  
                    href={data.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 border border-border text-muted hover:border-gold hover:text-gold px-3 py-1.5 text-xs font-mono transition-all"
                  >
                    <Facebook size={11} />
                    Facebook ↗
                  </a>
                )}
                {data.instagram_url && (
                  
                    href={data.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 border border-border text-muted hover:border-gold hover:text-gold px-3 py-1.5 text-xs font-mono transition-all"
                  >
                    <Instagram size={11} />
                    Instagram ↗
                  </a>
                )}
                {data.linkedin_url && (
                  
                    href={data.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 border border-border text-muted hover:border-gold hover:text-gold px-3 py-1.5 text-xs font-mono transition-all"
                  >
                    <Linkedin size={11} />
                    LinkedIn ↗
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Save */}
      <div className="pt-8 mt-8 border-t border-border">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-3 bg-gold text-background px-6 py-3 text-sm tracking-widest uppercase font-body font-medium hover:bg-gold-light transition-colors duration-300 disabled:opacity-50 group"
        >
          <Save size={14} />
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
