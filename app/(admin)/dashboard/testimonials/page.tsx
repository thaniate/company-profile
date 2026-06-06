'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Testimonial } from '@/lib/types';
import { Plus, Pencil, Trash2, X, Save, Upload, UserCircle2 } from 'lucide-react';

const emptyForm = {
  name: '',
  role: '',
  company: '',
  content: '',
  avatar_url: null as string | null,
  order_index: 0,
};

type FormState = typeof emptyForm;

export default function TestimonialsPage() {
  const supabase = createClient();

  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('order_index', { ascending: true });
    if (!error && data) setItems(data);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (item: Testimonial) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      role: item.role,
      company: item.company,
      content: item.content,
      avatar_url: item.avatar_url,
      order_index: item.order_index,
    });
    setImageFile(null);
    setImagePreview(item.avatar_url);
    setError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    setError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'order_index' ? Number(value) : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!imageFile) return form.avatar_url;
    setUploading(true);
    const ext = imageFile.name.split('.').pop();
    const fileName = `avatars/avatar-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(fileName, imageFile, { upsert: true });
    if (uploadError) { setError('Avatar upload failed.'); setUploading(false); return null; }
    const { data: urlData } = supabase.storage.from('media').getPublicUrl(fileName);
    setUploading(false);
    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const avatarUrl = await uploadAvatar();
    if (avatarUrl === null && imageFile) { setSaving(false); return; }

    const payload = {
      name: form.name,
      role: form.role,
      company: form.company,
      content: form.content,
      avatar_url: avatarUrl,
      order_index: form.order_index,
    };

    if (editingId) {
      const { error } = await supabase.from('testimonials').update(payload).eq('id', editingId);
      if (error) { setError('Failed to update testimonial.'); setSaving(false); return; }
    } else {
      const { error } = await supabase.from('testimonials').insert(payload);
      if (error) { setError('Failed to create testimonial.'); setSaving(false); return; }
    }

    setSaving(false);
    closeModal();
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (!error) { setDeleteId(null); fetchItems(); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Testimonials</h1>
          <p className="text-gray-400 text-sm mt-1">Manage client testimonials</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg px-4 py-2.5 transition"
        >
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      {/* List */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-600">
          <UserCircle2 size={40} className="mb-3" />
          <p className="text-sm">No testimonials yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <p className="text-gray-300 text-sm leading-relaxed mb-5 line-clamp-4">
                  &ldquo;{item.content}&rdquo;
                </p>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  {item.avatar_url ? (
                    <img
                      src={item.avatar_url}
                      alt={item.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                      <UserCircle2 size={20} className="text-gray-600" />
                    </div>
                  )}
                  <div>
                    <p className="text-white text-sm font-medium">{item.name}</p>
                    <p className="text-gray-500 text-xs">{item.role}, {item.company}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(item)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium rounded-lg px-3 py-2 transition"
                  >
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(item.id)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium rounded-lg px-3 py-2 transition"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h2 className="text-white font-semibold text-base">
                {editingId ? 'Edit Testimonial' : 'Add Testimonial'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-white transition">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Avatar */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Avatar</label>
                <div className="flex items-center gap-4">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="avatar preview"
                      className="w-16 h-16 rounded-full object-cover border border-gray-700 shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-800 border border-dashed border-gray-700 flex items-center justify-center shrink-0">
                      <UserCircle2 size={24} className="text-gray-600" />
                    </div>
                  )}
                  <label className="cursor-pointer inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-sm font-medium rounded-lg px-4 py-2.5 transition">
                    <Upload size={14} />
                    {uploading ? 'Uploading...' : 'Choose Avatar'}
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              {/* Role + Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Role</label>
                  <input
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Company</label>
                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Content</label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  rows={4}
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                />
              </div>

              {/* Order Index */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Order Index</label>
                <input
                  name="order_index"
                  type="number"
                  value={form.order_index}
                  onChange={handleChange}
                  min={0}
                  className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2.5">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-lg px-4 py-2.5 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg px-4 py-2.5 transition"
                >
                  {saving ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save size={14} />
                  )}
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-white font-semibold text-base mb-2">Delete Testimonial</h3>
            <p className="text-gray-400 text-sm mb-6">
              Are you sure you want to delete this testimonial? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-lg px-4 py-2.5 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg px-4 py-2.5 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
