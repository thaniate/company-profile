'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { HeroSection } from '@/lib/types';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { Upload, Save, ImageIcon, AlertCircle, Sparkles } from 'lucide-react';

export default function HeroPage() {
  const supabase = createClient();

  const [data, setData] = useState<HeroSection | null>(null);
  const [form, setForm] = useState({
    headline: '',
    subheadline: '',
    cta_text: '',
    cta_url: '',
    image_url: '' as string | null,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchHero = async () => {
      const { data: hero, error } = await supabase
        .from('hero_section')
        .select('*')
        .single();

      if (error) {
        setFetchError('Failed to load hero section. Please refresh the page.');
        setLoading(false);
        return;
      }

      setData(hero);
      setForm({
        headline: hero.headline,
        subheadline: hero.subheadline,
        cta_text: hero.cta_text,
        cta_url: hero.cta_url,
        image_url: hero.image_url,
      });
      setImagePreview(hero.image_url);
      setLoading(false);
    };

    fetchHero();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return form.image_url;
    setUploading(true);
    const ext = imageFile.name.split('.').pop();
    const fileName = `hero/hero-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(fileName, imageFile, { upsert: true });
    if (uploadError) { setError('Image upload failed.'); setUploading(false); return null; }
    const { data: urlData } = supabase.storage.from('media').getPublicUrl(fileName);
    setUploading(false);
    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);

    const imageUrl = await uploadImage();
    if (imageUrl === null && imageFile) { setSaving(false); return; }

    const { error: updateError } = await supabase
      .from('hero_section')
      .update({
        headline: form.headline,
        subheadline: form.subheadline,
        cta_text: form.cta_text,
        cta_url: form.cta_url,
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', data?.id);

    if (updateError) { setError('Failed to save changes.'); setSaving(false); return; }

    setForm((prev) => ({ ...prev, image_url: imageUrl }));
    setImageFile(null);
    setSuccess(true);
    setSaving(false);
  };

  // Loading State
  if (loading) {
    return (
      <div className="p-6 md:p-10 max-w-2xl">
        <div className="mb-8">
          <div className="h-8 w-40 bg-gray-800 rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-56 bg-gray-800 rounded animate-pulse" />
        </div>
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <div className="h-4 w-24 bg-gray-800 rounded animate-pulse mb-2" />
              <div className="h-10 w-full bg-gray-800 rounded-lg animate-pulse" />
            </div>
          ))}
          <div className="h-48 w-full bg-gray-800 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  // Error State
  if (fetchError) {
    return (
      <div className="p-6 md:p-10 max-w-2xl">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center mb-4">
            <AlertCircle size={24} className="text-red-400" />
          </div>
          <h3 className="text-white font-semibold text-base mb-2">Failed to Load</h3>
          <p className="text-gray-400 text-sm mb-6 max-w-xs">{fetchError}</p>
          <button
            onClick={() => { setFetchError(null); setLoading(true); }}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg px-5 py-2.5 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty State
  if (!data) {
    return (
      <div className="p-6 md:p-10 max-w-2xl">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
            <Sparkles size={24} className="text-gray-600" />
          </div>
          <h3 className="text-white font-semibold text-base mb-2">No Hero Data</h3>
          <p className="text-gray-400 text-sm max-w-xs">Hero section record not found in the database.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Hero Section</h1>
        <p className="text-gray-400 text-sm mt-1">Edit your homepage hero content</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Headline</label>
          <input
            name="headline"
            value={form.headline}
            onChange={handleChange}
            required
            className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Subheadline</label>
          <textarea
            name="subheadline"
            value={form.subheadline}
            onChange={handleChange}
            rows={3}
            required
            className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">CTA Text</label>
            <input
              name="cta_text"
              value={form.cta_text}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">CTA URL</label>
            <input
              name="cta_url"
              value={form.cta_url}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Hero Image</label>
          <div className="flex flex-col gap-3">
            {imagePreview ? (
              <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-700">
                <img src={imagePreview} alt="Hero preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-full h-48 rounded-xl border border-dashed border-gray-700 flex items-center justify-center">
                <ImageIcon size={32} className="text-gray-600" />
              </div>
            )}
            <label className="cursor-pointer inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-sm font-medium rounded-lg px-4 py-2.5 transition w-fit">
              <Upload size={15} />
              {uploading ? 'Uploading...' : 'Choose Image'}
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2.5">
            <AlertCircle size={15} className="shrink-0" /> {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-lg px-4 py-2.5">
            Hero section updated successfully.
          </div>
        )}

        <button
          type="submit"
          disabled={saving || uploading}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg px-6 py-2.5 transition"
        >
          {saving ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={15} />
          )}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
