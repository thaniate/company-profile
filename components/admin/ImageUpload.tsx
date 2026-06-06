'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Upload, Trash2, ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  folder?: string;
  initialUrl?: string | null;
  onUpload: (url: string | null) => void;
}

export default function ImageUpload({ folder = 'uploads', initialUrl, onUpload }: ImageUploadProps) {
  const supabase = createClient();

  const [preview, setPreview] = useState<string | null>(initialUrl ?? null);
  const [currentPath, setCurrentPath] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    const ext = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      setError('Upload failed. Please try again.');
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('media').getPublicUrl(fileName);

    setPreview(urlData.publicUrl);
    setCurrentPath(fileName);
    onUpload(urlData.publicUrl);
    setUploading(false);

    // reset input so same file can be re-selected
    e.target.value = '';
  };

  const handleDelete = async () => {
    setError(null);
    setDeleting(true);

    if (currentPath) {
      const { error: deleteError } = await supabase.storage
        .from('media')
        .remove([currentPath]);

      if (deleteError) {
        setError('Delete failed. Please try again.');
        setDeleting(false);
        return;
      }
    }

    setPreview(null);
    setCurrentPath(null);
    onUpload(null);
    setDeleting(false);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Preview */}
      {preview ? (
        <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-700 group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 disabled:bg-red-600/50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg px-4 py-2 transition"
            >
              {deleting
                ? <Loader2 size={15} className="animate-spin" />
                : <Trash2 size={15} />
              }
              {deleting ? 'Removing...' : 'Remove'}
            </button>
          </div>
        </div>
      ) : (
        <label className={`cursor-pointer w-full h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition
          ${uploading
            ? 'border-indigo-500/50 bg-indigo-500/5 cursor-not-allowed'
            : 'border-gray-700 hover:border-indigo-500/50 hover:bg-indigo-500/5'
          }`}
        >
          {uploading ? (
            <>
              <Loader2 size={28} className="text-indigo-400 animate-spin" />
              <span className="text-gray-400 text-sm">Uploading...</span>
            </>
          ) : (
            <>
              <ImageIcon size={28} className="text-gray-600" />
              <span className="text-gray-400 text-sm">Click to upload image</span>
              <span className="text-gray-600 text-xs">PNG, JPG, WEBP supported</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      )}

      {/* Replace button when preview exists */}
      {preview && (
        <label className={`cursor-pointer inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-sm font-medium rounded-lg px-4 py-2.5 transition w-fit
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Upload size={14} />
          {uploading ? 'Uploading...' : 'Replace Image'}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-400 text-xs">{error}</p>
      )}
    </div>
  );
}
